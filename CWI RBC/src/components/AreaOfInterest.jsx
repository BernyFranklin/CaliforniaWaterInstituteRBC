import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

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

export default function AreaOfInterest() {
    const [selectedArea, setSelectedArea] = useState(null);
    const [soilData, setSoilData] = useState(null);
    const [isLoadingSoil, setIsLoadingSoil] = useState(false);
    const [soilError, setSoilError] = useState(null);
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
            fontWeight: 'bold',
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
            setSoilData(soilResult);
            console.log('Soil type detected:', soilResult.dominantSoil.description);
            
        } catch (error) {
            console.error('Failed to fetch soil data:', error);
            setSoilError(error.message);
        } finally {
            setIsLoadingSoil(false);
        }
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

            setSelectedArea(coordinates);
            
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

                setSelectedArea(coordinates);
                
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
                        <thead style={styles.tableHead}>
                            <tr>
                                <td>Selected Area Coordinates</td>
                            </tr>
                        </thead>
                        <tbody>
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
                        </tbody>
                    </table>
                </div>
            )}
        </fieldset>
    );
}
