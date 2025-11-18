import express from "express";
import axios from "axios";
import cors from "cors";
import xml2js from "xml2js";

const app = express();
app.use(express.json());
app.use(cors());

function parseAndSortSoils(reportJSON) {
  try {
    const tbody = reportJSON?.section?.table?.[0]?.tbody?.[0];
    if (!tbody?.tr?.length) return null;

    const rows = tbody.tr;
    const soils = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.$?.class === "mapunit") {
        const cell = row.td?.[0];
        const text = cell?.para?.[0]?._ || "";
        const symbol = text.split("--")[0]?.trim();
        const desc = text.split("--")[1]?.trim() || "";

        // Map unit acres is usually in td[1]
        const acresText = row.td?.[1]?.para?.[0]?._ || "";
        const acres = parseFloat(acresText.replace(/,/g, "")) || 0;

        soils.push({ symbol, desc, acres });
      }
    }

    if (!soils.length) return null;

    // Sort by acreage descending
    soils.sort((a, b) => b.acres - a.acres);

    // Return all soils
    return soils;
  } 
  
  catch (err) {
    console.warn("Failed to parse soils:", err.message);
    return null;
  }
}

app.get("/", (_req, res) => res.send("Soil API running"));

app.post("/soil", async (req, res) => {
  try {
    // Extract coordinates from request body
    const { north, south, east, west } = req.body;
    
    // Validate required coordinates
    if (!north || !south || !east || !west) {
      return res.status(400).json({ 
        error: "Missing coordinates", 
        required: ["north", "south", "east", "west"] 
      });
    }
    
    // Convert to GeoJSON ring format (lon, lat order)
    // Ring must be closed (first and last coordinates match)
    const ring = [
      [west, north],   // top-left
      [east, north],   // top-right
      [east, south],   // bottom-right
      [west, south],   // bottom-left
      [west, north]    // close ring
    ];
    // Build GeoJSON (FeatureCollection is recommended; properties can be used with FILTER later)
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Fresno Demo Field" },
          geometry: {
            type: "Polygon",
            coordinates: [ring] // IMPORTANT: [ [ [lon,lat], ... ] ]
          }
        }
      ]
    };
	
	const url = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest";
	
	// Establish an area of interest (farmer's field)
	// AOI create: AOICOORDS must be a GeoJSON STRING (not object)
    const aoiResp = await axios.post(url,
      {
        SERVICE: "aoi",
        REQUEST: "create",
        AOICOORDS: JSON.stringify(geojson)
        },
      { headers: { "Content-Type": "application/json" } }
    );
	
	// Confirm we recieved the AOIID return with error if we did not
	const AOIID = aoiResp.data?.id; //ID returned by the api used for future calls
    if (!AOIID) {
      return res.status(502).json({ error: "AOI creation failed", raw: aoiResp.data });
    }

	// Get the catalog of available reports
	// Cannot gauantee that the "Component Legend" report will always have the same ID
	// AOI catalog: Retrieve catalog of available reports
    const aoiCatalog = await axios.post(url,
      {
        SERVICE: "report",
        REQUEST: "getcatalog",
        AOIID
      },
      { headers: { "Content-Type": "application/json" } }
    );
	
	//Confirm we recieved the Catalog return with error if we did not
	const CAT = aoiCatalog.data;
	if (!CAT) {
      return res.status(502).json({ error: "failed to fetch catalog", raw: aoiCatalog.data });
    }
	//console.log("Catalog", JSON.stringify(CAT));
	
	// Confirm the catalog is of a usable format return with error if not
	const folders = aoiCatalog.data?.tables?.[0]?.folders;
    if (!folders) {
      return res.status(502).json({ error: "invalid catalog format", raw: aoiCatalog.data });
    }
	
	//Search the catalog for the proper report and retrieve its ID
    let selected = null;
    for (const folder of folders) {
      const found = folder.reports.find((r) =>
        r.reportname.toLowerCase().includes("component legend")
      );
      if (found) {
        selected = found;
        break;
      }
    }
    if (!selected) selected = folders[0].reports[0]; // fallback
    const REPORTID = selected.reportid;
    console.log(`Using report: ${selected.reportname} (id ${REPORTID})`);
	
	// Get the reports metadata used to run the report on the AOI
	// AOI ReportData: Retrieve the proper report data
    const aoiReportData = await axios.post(
      url,
      {
        SERVICE: "report",
        REQUEST: "getreportdata",
		REPORTID,
        AOIID,
		FORMAT: "short"
      },
      { headers: { "Content-Type": "application/json" } }
    );
	
	// Confirm we recieved the report metadata return with error if we did not
	const REPORTDATA = aoiReportData.data;
	if (!REPORTDATA) {
      return res.status(502).json({ error: "failed to fetch report data", raw: aoiReportData.data });
    }
	
	// Run the report to gather information on the soil makeup of the AOI
	// AOI Report: Run the report
    const aoiReport = await axios.post(
      url,
      {
        SERVICE: "report",
        REQUEST: "getreport",
		SHORTFORMDATA: JSON.stringify(REPORTDATA)
      },
      { headers: { "Content-Type": "application/json" } }
    );
	
	// Confirm we recieved the report (in Book XML format) return with error if we did not
	const REPORTXML = aoiReport.data;
	if (!REPORTXML) {
      return res.status(502).json({ error: "failed to fetch report", raw: aoiReport.data });
    }
	
	// Convert Book XML to JSON
	const REPORTJSON = await xml2js.parseStringPromise(REPORTXML);
	
	// Confirm we recieved the report (in JSON format) return with error if we did not
	if (!REPORTJSON) {
      return res.status(502).json({ error: "failed to convert report to JSON", raw: aoiReport.data });
    }
	console.log("\n Completed \n");
	
	// Parse the JSON into a usable object (seperate symbol from its description)
	const soils = parseAndSortSoils(REPORTJSON);
	
	// Return successful with comprehensive soil data
	return res.status(200).json({
		dominantSoil: {
			symbol: soils[0].symbol,
			description: soils[0].desc,
			acres: soils[0].acres
		},
		allSoils: soils,
		totalArea: soils.reduce((sum, soil) => sum + soil.acres, 0)
	});

  } 
  // Catch errors not related to business logic
  catch (err) {
    console.error("SDA ERROR:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Failed", details: err.response?.data || err.message });
  }
});

// Begin lisining on port 5000 and report server running
app.listen(5000, () => console.log("Server running on port 5000"));
