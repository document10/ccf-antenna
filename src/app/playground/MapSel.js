'use client';
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
const containerStyle = {
    width: '100vw',
    height: '100vh',
}

const center = {
    lat: 47.670162200927734,
    lng: 26.28742027282715,
}

function MapSel() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })
    const [map, setMap] = React.useState(null)
    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)

        setMap(map)
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const [latLng, setLatLng] = React.useState({
        lat: center.lat,
        lng: center.lng,
    });
    const [radius, setRadius] = React.useState(0);
    
    return isLoaded ? (
        <div className="flex flex-col items-center size-svh justify-center">
            <div className="flex flex-row absolute w-fit top-0 bg-[#000000aa] backdrop-blur-sm p-2 z-10 items-center justify-center rounded-2xl">
                <label className="block text-base font-medium text-gray-100">
                    Latitude:
                    <input
                        type="number"
                        min="-90"
                        max="90"
                        className="ml-2 p-1 border rounded w-64"
                        value={latLng.lat}
                        onChange={(e) => setLatLng({ ...latLng, lat: parseFloat(e.target.value) })}
                    />
                </label>
                <label className="block text-base font-medium text-gray-100">
                    Longitude:
                    <input
                        type="number"
                        min="-180"
                        max="180"
                        className="ml-2 p-1 border rounded w-64"
                        value={latLng.lng}
                        onChange={(e) => setLatLng({ ...latLng, lng: parseFloat(e.target.value) })}
                    />
                </label>
                <label className="block text-base font-medium text-gray-100">
                    Radius (meters):
                    <input
                        type="number"
                        min="1"
                        className="ml-2 p-1 border rounded w-32"
                        value={radius}
                        onChange={(e) => setRadius(parseFloat(e.target.value))}
                    />
                </label>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <Marker
                    animation={window.google.maps.Animation.DROP}
                    position={{
                        lat: latLng.lat,
                        lng: latLng.lng,
                    }}
                    draggable={true}
                    onDragEnd={(e) => {
                        setLatLng({
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                        });
                    }}
                    title='Drag me to change location'

                />
                <Circle
                    center={{
                        lat: latLng.lat,
                        lng: latLng.lng,
                    }}
                    radius={radius}
                    options={{
                        fillColor: 'green',
                        fillOpacity: 0.2,
                        strokeColor: 'green',
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                    }}
                />

            </GoogleMap>
        </div>
    ) : (
        <></>
    )
}

export default React.memo(MapSel)