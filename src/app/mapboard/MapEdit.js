'use client';
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import { eventNames } from 'process';
import { JsonContains, Not } from 'typeorm';
const containerStyle = {
    width: '100vw',
    height: '100vh',
}



function MapEdit() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })
    const [map, setMap] = React.useState(null)
    const [center, setCenter] = React.useState({
        lat: 47.670162200927734,
        lng: 26.28742027282715,
    })
    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)

        setMap(map)
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])
    const [locations, setLocations] = React.useState([]);
    const [selectedLocation, setSelectedLocation] = React.useState(0)
    const [zoom, SetZoom] = React.useState(15)
    React.useEffect(() => {
        fetch('/api/locations')
            .then(response => response.json())
            .then(data =>
                setLocations(data)
            )
            .catch(error => console.error('Error fetching locations:', error))
    }, [])
    return isLoaded ? (
        <div className="flex flex-col items-center size-svh justify-center">
            <form className="flex flex-col fixed w-fit top-15 right-5 bg-[#000000bb] p-2 z-10 rounded-2xl text-lg text-white">
                <input type='number' min={0} placeholder='Search by ID' className='bg-gray-900 placeholder:text-gray-400 text-green-500' onChange={(event) => {
                    const location = locations.find((v) => v.id == event.target.value)
                    if (location) {
                        setSelectedLocation(location)
                        setCenter({ lat: location.latitude, lng: location.longitude })
                        SetZoom(15)
                    }
                }} />
                {selectedLocation ? (
                    <div className='flex flex-col'>
                        {selectedLocation.active ? (
                            <h1 className='text-2xl font-bold text-green-600'>Location no. {selectedLocation.id}:{selectedLocation.generation},Active</h1>
                        ) : (
                            <h1 className='text-2xl font-bold text-red-600'>Location no. {selectedLocation.id}:{selectedLocation.generation},Inctive</h1>
                        )}
                        <label className='text-xl text-gray-200 font-medium'>Latitude:<label className='text-center text-base font-light' id={`loc_lat`}>{selectedLocation.latitude}</label></label>
                        <label className='text-xl text-gray-200 font-medium'>Longitude:<label className='text-center text-base font-light' id={`loc_lon`}>{selectedLocation.longitude}</label></label>
                        <label className='text-xl text-gray-200 font-medium'>
                            Range:
                            <button type='button' className="text-xl font-bold text-center w-8 h-8 text-white bg-red-800 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-red-900 hover:text-gray-300" onClick={() => {
                                const newRange = Math.max(selectedLocation.range - Number(document.getElementById('inc').value), 100)
                                setSelectedLocation({
                                    ...selectedLocation, range: newRange
                                })
                            }}>-</button>
                            <label className='text-center text-base font-light' id={`loc_ran`}>{selectedLocation.range}</label>
                            <button type='button' className="text-xl font-bold text-center w-8 h-8 text-white bg-green-800 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-green-900 hover:text-gray-300" onClick={() => {
                                const newRange = Math.max(selectedLocation.range + Number(document.getElementById('inc').value), 100)
                                setSelectedLocation({
                                    ...selectedLocation, range: newRange
                                })
                            }}>+</button>
                            <select id='inc' className='text-center text-xl text-gray-50 bg-purple-500 rounded-2xl hover:bg-purple-600 hover:text-gray-200 transition-all duration-300'>
                                <option value={10}>10</option>
                                <option value={100}>100</option>
                                <option value={1000}>1000</option>
                            </select>
                            <br/>
                            <label className='text-base font-light'><label className='text-yellow-400'>Yellow:old range</label>;<label className='text-green-500'>green:new range</label></label>
                        </label>
                        <label className='text-xl text-gray-200 font-medium'>Operated by:<label className='text-center text-base font-light' id={`loc_lon`}>{selectedLocation.operators}</label></label>
                        <div className='flex flex-row'>
                            <button type='button' className="text-xl font-bold text-center p-1 text-white bg-green-800 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-green-900 hover:text-gray-300" onClick={(event) => {
                                console.log(JSON.stringify(selectedLocation))
                                fetch(`/api/locations/?id=${selectedLocation.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(selectedLocation),
                                }).then(response => {
                                    console.log("Location updated:", response)
                                    window.location.href = "/mapboard?password=admin123"
                                }).catch(error => console.error('Error updating location:', error));
                            }} >Save changes</button>
                            <button type='button' className="text-xl font-bold text-center p-1 text-white bg-rose-800 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-rose-700 hover:text-gray-300" onClick={()=>setSelectedLocation(locations.find((v) => v.id == selectedLocation.id))}>Discard changes</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className='text2xl'>Select a location to edit its information</h1>
                    </div>
                )}
                <button type='button' className="text-xl font-bold text-center p-1 text-gray-950 bg-cyan-400 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-cyan-600 hover:text-gray-900" onClick={() => window.location.href = "/dashboard?password=admin123"} >Return to dashboard</button>
            </form>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >

                {locations.map((location, index) => (
                    <Marker
                        key={index}
                        id={`mark_${location.id}`}
                        animation={window.google.maps.Animation.DROP}
                        position={{
                            lat: location.id == selectedLocation.id ? selectedLocation.latitude : location.latitude,
                            lng: location.id == selectedLocation.id ? selectedLocation.longitude : location.longitude,
                        }}
                        title={`Click to edit location #${location.id}`}
                        onClick={() => {
                            setSelectedLocation(location)
                        }}
                        draggable={location.id == selectedLocation.id}
                        onDragEnd={(event) => {
                            setSelectedLocation({ ...selectedLocation, latitude: event.latLng.lat(), longitude: event.latLng.lng() })
                        }}
                        
                    />
                ))}
                {locations.map((location, index) => (
                    <Circle
                        key={index}
                        center={{
                            lat: location.id == selectedLocation.id ? selectedLocation.latitude : location.latitude,
                            lng: location.id == selectedLocation.id ? selectedLocation.longitude : location.longitude,
                        }}
                        radius={location.id == selectedLocation.id ? selectedLocation.range : location.range}
                        options={{
                            fillColor: location.id == selectedLocation.id ? 'green' : 'yellow',
                            fillOpacity: 0.2,
                            strokeColor: location.id == selectedLocation.id ? 'green' : 'yellow',
                            strokeOpacity: 0.8,
                            strokeWeight: 1,
                        }}
                    />
                ))}
            </GoogleMap>
        </div>
    ) : (
        <></>
    )
}

export default React.memo(MapEdit)