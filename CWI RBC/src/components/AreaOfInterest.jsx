import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { soilOptions } from '../utils/form/sectionsSchema.js';

import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

window.type = true; // Fixes leaflet issue for drawing rectangles.
// https://github.com/Leaflet/Leaflet.draw/issues/1026

export default function AreaOfInterest({ formData, setFormData }) {
    const [selectedArea, setSelectedArea] = useState(null);
    const [soilData, setSoilData] = useState(null);
    const [isLoadingSoil, setIsLoadingSoil] = useState(false);
    const [soilError, setSoilError] = useState(null);
    const [soilType, setSoilType] = useState(null);
    
    // Styles
    const styles = {
        fieldset: {
            borderRadius: '5px',
            border: '3px solid #ccc',
            padding: '0 1rem 4rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
            legend: {
            fontFamily: 'inherit',
            fontSize: '1.5rem',
            padding: '0.5rem',
        },
        container: {
            height: '500px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        map: {
            height: '100%',
            width: '80%',
            borderRadius: '5px',
            boxShadow: 'black 0px 0px 10px -1px',
        },
        selectedArea: {
            margin: '1rem auto 0 auto',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
        },
        square: {
            fontSize: '1.5rem',
        },
        list: {
            display: 'block',
            fontSize: '1.1rem',
        },
        tableHead: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.3rem',
        },
        controls: {
            textAlign: 'left',
            width: '80%',
            marginBottom: '-2rem',
        },
        alignRight: {
            textAlign: 'right',
        }
    };
    // Function to calculate distance between two lat/lng points using Haversine formula
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distanceInMeters = R * c;
        const distanceInFeet = distanceInMeters * 3.28084; // Convert to feet
        return Math.round(distanceInFeet);
    };
    
    // Function to calculate rectangle dimensions from coordinates
    const calculateDimensions = (coordinates) => {
        const { north, south, east, west } = coordinates;
        
        // Calculate length (east-west distance at the northern edge)
        const length = calculateDistance(north, west, north, east);
        
        // Calculate width (north-south distance at the western edge)
        const width = calculateDistance(north, west, south, west);
        
        // Calculate acreage (length * width / 43,560 sq ft per acre)
        const acreage = (length * width) / 43560;
        
        return { 
            length, 
            width, 
            acreage: Math.round(acreage * 100) / 100 // Round to 2 decimal places
        };
    };
    // Function to fetch soil data from backend
    const fetchSoilData = async (coordinates) => {
        setIsLoadingSoil(true);
        setSoilError(null);
        
        try {
            const response = await fetch('http://localhost:5000/soil', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coordinates)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const soilResult = await response.json();
            setSoilData(soilResult.dominantSoil.description);
            
        } catch (error) {
            console.error('Failed to fetch soil data:', error);
            setSoilError(error.message);
        } finally {
            setIsLoadingSoil(false);
        }
    };
    
    // Soil matching utility function
    const matchSoilType = (soilDescription) => {
        if (!soilDescription) return null;
        
        // Create keyword-to-soil mapping for better matching
        const soilKeywords = {
            'sand': ['sand', 'sandy'],
            'sandy_fine_layering': ['sand', 'sandy', 'fine', 'layering'],
            'loam': ['loam'],
            'loam_fine_layering': ['loam', 'fine', 'layering'],
            'silt_clay_loam': ['silt', 'silty', 'clay', 'loam'],
            'silt_clay_loam_fine_layering': ['silt', 'silty', 'clay', 'loam', 'fine', 'layering'],
            'clay_restrictive_layers': ['clay', 'restrictive', 'layers']
        };
        
        const desc = soilDescription.toLowerCase();
        let maxScore = 0;
        let bestMatch = null;
        
        // Score each soil option based on keyword matches
        soilOptions.forEach(option => {
            const soilType = option.value;
            const keywords = soilKeywords[soilType] || [soilType];
            
            let score = 0;
            keywords.forEach(keyword => {
                if (desc.includes(keyword)) {
                    // Give higher score for exact keyword matches
                    score += keyword === soilType ? 2 : 1;
                }
            });
            
            // Bonus for primary keywords appearing first
            if (keywords.some(k => desc.startsWith(k))) {
                score += 1;
            }
            
            if (score > maxScore) {
                maxScore = score;
                bestMatch = soilType;
            }
        });
        
        // Fallback logic for common soil combinations
        if (!bestMatch || maxScore === 0) {
            if (desc.includes('sand') && desc.includes('clay')) return 'loam';
            if (desc.includes('sand') && desc.includes('silt')) return 'loam';
            if (desc.includes('clay') && desc.includes('silt')) return 'loam';
            if (desc.includes('sand')) return 'sand';
            return 'loam'; // Default fallback
        }
        
        return bestMatch;
    };
    
    
    const onCreate = (e) => {
        // Extract the layer and get coordinates
        const layer = e.layer;
        if (layer && typeof layer.getBounds === 'function') {
            const bounds = layer.getBounds();
            const coordinates = {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
            };
            
            // Calculate dimensions
            const dimensions = calculateDimensions(coordinates);
            
            // Store coordinates with dimensions for local display
            const areaData = {
                ...coordinates,
                ...dimensions
            };

            setSelectedArea(areaData);
            
            // Update formData with calculated values
            setFormData(prevData => ({
                ...prevData,
                ac_pond: dimensions.acreage,
                length_pond: dimensions.length,
                width_pond: dimensions.width,
                pipeline_length: 2 * (dimensions.length + dimensions.width),
            }));
            
            // Automatically fetch soil data for the selected area
            fetchSoilData(coordinates);
        }
    };
    
    const onEdit = (e) => {
        // The edited event contains layers in e.layers
        const layers = e.layers;
        layers.eachLayer((layer) => {
            if (layer && typeof layer.getBounds === 'function') {
                const bounds = layer.getBounds();
                const coordinates = {
                    north: bounds.getNorth(),
                    south: bounds.getSouth(),
                    east: bounds.getEast(),
                    west: bounds.getWest()
                };
                
                // Calculate dimensions
                const dimensions = calculateDimensions(coordinates);
                
                // Store coordinates with dimensions for local display
                const areaData = {
                    ...coordinates,
                    ...dimensions
                };

                setSelectedArea(areaData);
                
                // Update formData with calculated values
                setFormData(prevData => ({
                    ...prevData,
                    ac_pond: dimensions.acreage,
                    length_pond: dimensions.length,
                    width_pond: dimensions.width
                }));
                
                // Automatically fetch soil data for the updated area
                fetchSoilData(coordinates);
            }
        });
    };
    
    const onDelete = (e) => {
        // Clear the selected area and soil data when shapes are deleted
        setSelectedArea(null);
        setSoilData(null);
        setSoilError(null);
    };

    // Auto-populate soil type when soilData changes
    useEffect(() => {
        if (soilData) {
            const matchedSoilType = matchSoilType(soilData);
            
            if (matchedSoilType) {
                // Find the soil option to get its infiltration rate
                const soilOption = soilOptions.find(opt => opt.value === matchedSoilType);
                setFormData(prevData => ({
                    ...prevData,
                    soil_type: matchedSoilType,
                    infiltration_rate: soilOption ? soilOption.infiltrationRate : ''
                }));

                setSoilType(soilOption ? soilOption.text : null);
            }
        }
    }, [soilData, setFormData]);

    return (
        <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Area of Interest</legend>
            <h3 style={styles.controls}>Controls</h3>
            <ul style={styles.list}>
                <li>
                    <span><FontAwesomeIcon icon="fa-solid fa-plus" /></span>: Zoom in on the map.
                </li>
                <li>
                    <span><FontAwesomeIcon icon="fa-solid fa-minus" /></span>: Zoom out on the map.
                </li>
                <li>
                    <span><FontAwesomeIcon icon="fa-solid fa-square" /></span>: Draw a rectangle to select the area of land for the water resource assessment by drawing a rectangle on the map.
                </li>
                <li>
                    <span><FontAwesomeIcon icon="fa-solid fa-pen-to-square" /></span>: Edit the area by dragging either the corners or the center of the selected area and selecting "Save".
                </li>
                <li>
                    <span><FontAwesomeIcon icon="fa-regular fa-trash-can" /></span>: Select "Clear All" to delete the selected area.
                </li>
            </ul>
            
            <div style={styles.container}>
                <MapContainer
                    center={[36.7378, -119.7871]} // Fresno, CA center
                    zoom={10}
                    style={styles.map}
                >
                    <FeatureGroup> 
                        <EditControl 
                        position="topleft" 
                        onCreated={onCreate}
                        onEdited={onEdit}
                        onDeleted={onDelete}
                        draw={{
                            rectangle: true,
                            polyline: false,
                            polygon: false,
                            marker: false,
                            circle: false,
                            circlemarker: false,
                        }} />
                    </FeatureGroup>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                </MapContainer>
            </div>
            
            {selectedArea && (
                <div style={styles.selectedArea}>
                    <table>
                        <thead>
                            <tr>
                                <th style={styles.tableHead} colSpan={2}>Selected Area Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Dimensions</strong></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Length:</td>
                                <td style={styles.alignRight}>{selectedArea.length?.toLocaleString()} ft</td>
                            </tr>
                            <tr>
                                <td>Width:</td>
                                <td style={styles.alignRight}>{selectedArea.width?.toLocaleString()} ft</td>
                            </tr>
                            <tr>
                                <td>Acreage:</td>
                                <td style={styles.alignRight}>{selectedArea.acreage} acres</td>
                            </tr>
                            <tr>
                                <td><strong>Coordinates</strong></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>North:</td>
                                <td style={styles.alignRight}>{selectedArea.north.toFixed(6)}°</td>
                            </tr>
                            <tr>
                                <td>South:</td>
                                <td style={styles.alignRight}>{selectedArea.south.toFixed(6)}°</td>
                            </tr>
                            <tr>
                                <td>East:</td>
                                <td style={styles.alignRight}>{selectedArea.east.toFixed(6)}°</td>
                            </tr>
                            <tr>
                                <td>West:</td>
                                <td style={styles.alignRight}>{selectedArea.west.toFixed(6)}°</td>
                            </tr>
                            <tr>
                                <td><strong>Soil Detected:</strong></td>
                                <td style={styles.alignRight}>{soilData}</td>
                            </tr>
                            <tr>
                                <td><strong>Best Soil Match:</strong></td>
                                <td style={styles.alignRight}>{soilType}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </fieldset>
    );
}
