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
        }
    };
    
    const onCreate = (e) => {
        console.log(e);
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
            <p>Please select the area of land for the water resource assessment by drawing a rectangle on the map.</p>
            
            
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
            </div>
        </fieldset>
    );
}
