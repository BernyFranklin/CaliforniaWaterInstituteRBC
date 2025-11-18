import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';

window.type = true; // Fixes leaflet issue for drawing rectangles.
// https://github.com/Leaflet/Leaflet.draw/issues/1026

export default function AreaOfInterest() {
    const [selectedArea, setSelectedArea] = useState(null);
    
    const styles = {
        fieldset: {
            borderRadius: '5px',
            border: '3px solid #ccc',
            padding: '0 2rem 2rem 2rem',
            display: 'flex',
            flexDirection: 'row',
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
            height: '600px',
            width: '100%',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        map: {
            height: '100%',
            width: '80%',
        },
        selectedArea: {
            margin: '1rem',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
        },
        square: {
            fontSize: '1.5rem',
        }
    };
    
    const onCreate = (e) => {
        console.log('Draw event:', e);
        
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
            
            console.log('Rectangle coordinates:', coordinates);
            setSelectedArea(coordinates);
        }
    };
    const onEdit = (e) => {
        console.log(e);
    };
    const onDelete = (e) => {
        console.log(e);
    };

    return (
        <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Area of Interest</legend>
            <p>Please click the <span style={styles.square}>■</span> to select the area of land for the water resource assessment by drawing a rectangle on the map.</p>
            
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
                        onEdit={onEdit}
                        onDelete={onDelete}
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
                
                {selectedArea && (
                    <div style={styles.selectedArea}>
                        <strong>Selected Area Coordinates:</strong>
                        <br />
                        North: {selectedArea.north.toFixed(6)}°
                        <br />
                        South: {selectedArea.south.toFixed(6)}°
                        <br />
                        East: {selectedArea.east.toFixed(6)}°
                        <br />
                        West: {selectedArea.west.toFixed(6)}°
                    </div>
                )}
            </div>
        </fieldset>
    );
}
