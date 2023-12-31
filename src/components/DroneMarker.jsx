import 'leaflet/dist/leaflet.css'
import { Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet'
import { droneIcon } from '../assets/icons/icons'


function DroneMarker(props) {

    return (
        <LayersControl.Overlay checked name="Drones">
            <Marker position={props.position} icon={droneIcon}>
                <Popup>
                    <span>
                        {props.position[0]}, {props.position[1]}
                    </span>
                </Popup>
            </Marker>
        </LayersControl.Overlay>
    )
}

export default DroneMarker;
