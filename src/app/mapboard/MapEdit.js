'use client';
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import Image from 'next/image';
const containerStyle = {
    width: '100vw',
    height: '100vh',
}

function MapEdit() {
    const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, })
    const [map, setMap] = React.useState(null)
    const [center, setCenter] = React.useState({ lat: 47.670162200927734, lng: 26.28742027282715, })
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);
    }, [])
    const onUnmount = React.useCallback(function callback(map) { setMap(null) }, [])
    const [locations, setLocations] = React.useState([]);
    const [operators, setOperators] = React.useState([])
    const [selectedLocation, setSelectedLocation] = React.useState(0)
    const [zoom, SetZoom] = React.useState(15)
    const [query, SetQuery] = React.useState('ID')
    const [searcResults, setSearchResults] = React.useState([])
    const [minimized, SetMinimized] = React.useState(false)
    React.useEffect(() => {
        fetch('/api/operators')
            .then(response => response.json())
            .then(data => setOperators(data))
            .catch(error => console.error('Error fetching operators:', error))
    }, [])
    React.useEffect(() => {
        fetch('/api/locations')
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(error => console.error('Error fetching locations:', error))
    }, [])
    return isLoaded ? (
        <div className="flex flex-col items-center size-svh justify-center">
            <form className="flex flex-col fixed w-fit top-5 right-5 bg-[#10101099] backdrop-blur-sm p-2 z-10 rounded-2xl text-lg text-white">
                {minimized ? (
                    <button className='flex flex-row gap-1 justify-center bg-emerald-500 shadow-md/50 shadow-emerald-300 transition-all duration-500 hover:text-gray-700 hover:bg-emerald-400 rounded-2xl cursor-pointer text-base p-2' onClick={(e) => SetMinimized(!minimized)}><Image src='/maximize.svg' width={20} height={20} alt='plus' />Expand</button>
                ) : (
                    <div className='flex flex-col' id='expanded'>
                        <button className='flex flex-row justify-center gap-2 text-gray-50 bg-emerald-500 transition-all duration-500 hover:text-gray-200 hover:bg-emerald-600 shadow-md/50 shadow-emerald-300 rounded-xl cursor-pointer p-1 mb-2' onClick={() => SetMinimized(!minimized)}><Image src='/minimize.svg' width={20} height={20} alt='plus' />Collapse</button>
                        <select id="query" className='text-center text-xl py-1 mb-1 text-gray-50 bg-fuchsia-500 rounded-2xl shadow-md/50 shadow-fuchsia-700 hover:bg-fuchsia-700 hover:text-gray-200 transition-all duration-300' onChange={(event) => SetQuery(event.target.value)}>
                            <option value="ID">ID</option>
                            <option value="Op">Operator</option>
                            <option value="Gen">Generation</option>
                        </select>
                        {query == 'Gen' ? (
                            <select className='text-center text-xl text-gray-50 py-1 bg-blue-500 shadow-md/50 shadow-blue-700 rounded-2xl border-2 border-blue-950 hover:bg-blue-600 hover:text-gray-200 hover:border-blue-800 transition-all duration-300' onChange={(event) => { setSearchResults(locations.filter((v) => v.generation == event.target.value)) }}>
                                <optgroup label="Outdated" className='text-center'>
                                    <option value="1G">1G</option>
                                    <option value="2G">2G</option>
                                    <option value="3G">3G</option>
                                </optgroup>
                                <optgroup label='In use' className='text-center'>
                                    <option value="4G/LTE">4G/LTE</option>
                                    <option value="5G">5G</option>
                                </optgroup>
                            </select>
                        ) : (query == 'ID' ? (
                            (
                                <input type='text' min={0} placeholder='Search locations' className='bg-gray-900 placeholder:text-gray-400 text-green-500 shadow-md/50 shadow-gray-600 rounded-xl transition-all duration-500 hover:bg-gray-950' onChange={(event) => {
                                    if (event.target.value) setSearchResults(locations.filter((v) => v.id == event.target.value));
                                    else setSearchResults([]);
                                }} />
                            )
                        ) : (
                            <select className='text-center text-2xl text-slate-800 bg-lime-400 rounded-2xl shadow-sm/50 shadow-lime-300 border-2 border-lime-900 hover:bg-lime-500 hover:text-slate-700 hover:border-lime-700 transition-all duration-300' id={`loc${location.id}_op`} defaultValue={location.operatorId} onChange={e => { setSearchResults(locations.filter((v) => v.operatorId == e.target.value)) }}>
                                <option key={-1} value={-1}>Unknown</option>
                                {operators.map((op, index) => (
                                    <option value={op.id} key={op.id}>{op.name}</option>
                                ))}
                            </select>
                        ))
                        }
                        {searcResults ? searcResults.map((value, index) => (
                            <button type='button' key={index} className='text-xl font-bold text-center p-1 text-white cursor-pointer transition-all duration-300 hover:text-gray-300' onClick={() => {
                                setSelectedLocation(value)
                                setCenter({ lat: value.latitude, lng: value.longitude })
                                SetZoom(14)
                            }}>{value.id}.({value.generation})</button>
                        ))
                            : (
                                <></>
                            )}
                        {selectedLocation ? (
                            <div className='flex flex-col'>
                                {selectedLocation.active ?
                                    (<h1 className='text-2xl font-bold text-green-500 flex flex-row'><Image src='/online.svg' width={16} height={16} alt='ID' className='invert mx-2' />Location no. {selectedLocation.id} (Active)</h1>)
                                    : (<h1 className='text-2xl font-bold text-red-500 flex flex-row'><Image src='/offline.svg' width={16} height={16} alt='ID' className='invert mx-2' />Location no. {selectedLocation.id} (Inactive)</h1>)}
                                <label className='text-xl text-gray-200 font-medium'>Latitude:<label className='text-center text-base font-light px-2' id={`loc_lat`}>{selectedLocation.latitude}</label></label>
                                <label className='text-xl text-gray-200 font-medium'>Longitude:<label className='text-center text-base font-light px-2' id={`loc_lon`}>{selectedLocation.longitude}</label></label>
                                <label className='text-xl text-gray-200 font-medium'>
                                    Range:
                                    <button type='button' className="text-xl font-bold text-center w-8 h-8 text-white bg-red-800 rounded-2xl shadow-md/50 shadow-red-700 cursor-pointer transition-all duration-300 hover:bg-red-900 hover:text-gray-300 ml-2" onClick={() => {
                                        const newRange = Math.max(selectedLocation.range - Number(document.getElementById('inc').value), 100)
                                        setSelectedLocation({ ...selectedLocation, range: newRange })
                                    }}>-</button>
                                    <label className='text-center text-base font-light mx-2' id={`loc_ran`}>{selectedLocation.range}</label>
                                    <button type='button' className="text-xl font-bold text-center w-8 h-8 text-white bg-green-800 rounded-2xl shadow-md/50 shadow-green-700 cursor-pointer transition-all duration-300 hover:bg-green-900 hover:text-gray-300" onClick={() => {
                                        const newRange = Math.max(selectedLocation.range + Number(document.getElementById('inc').value), 100)
                                        setSelectedLocation({ ...selectedLocation, range: newRange })
                                    }}>+</button>
                                    <select id='inc' className='text-center text-xl text-gray-50 bg-purple-500 rounded-2xl shadow-md/50 shadow-purple-600 hover:bg-purple-600 hover:text-gray-200 transition-all duration-300 ml-2' defaultValue={10}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={100}>100</option>
                                        <option value={1000}>1000</option>
                                    </select>
                                </label>
                                <label className='text-base font-light'><label className='text-yellow-400 pr-2'>Yellow:old range</label><label className='text-green-500'>green:new range</label></label>
                                <label className='text-xl text-gray-200 font-medium'>Operated by:<label className='text-center text-base font-light px-2' id={`loc_lon`}>{selectedLocation.operatorId != -1 ? operators.find(op => op.id == selectedLocation.operatorId).name : "Unknown"}</label></label>
                                <button type='button' className="text-xl font-bold text-center p-1 my-1 text-white bg-green-800 shadow-md/50 shadow-lime-800 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-green-900 hover:text-gray-300" onClick={(event) => {
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
                                    }).catch(error => {
                                        console.error('Error deleting operator:', error)
                                        alert('Something went wrong. Please try again.')
                                    });
                                }} >Save changes</button>
                                <button type='button' className="text-xl font-bold text-center p-1 my-1 text-white bg-rose-800 shadow-md/50 shadow-rose-700 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-rose-700 hover:text-gray-300" onClick={() => setSelectedLocation(locations.find((v) => v.id == selectedLocation.id))}>Discard changes</button>
                                <button type='button' className="text-xl font-bold text-center p-1 my-1 text-white bg-red-600  shadow-md/50 shadow-red-700 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-red-700 hover:text-gray-300" onClick={() => {
                                    setLocations(locations.filter(loc => loc.id != selectedLocation.id))
                                    fetch(`/api/locations/?id=${selectedLocation.id}`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ id: selectedLocation.id }),
                                    }).then(response => console.log("Location deleted:", response)).catch(error => {
                                        console.error('Error deleting operator:', error)
                                        alert('Something went wrong. Please try again.')
                                    });
                                }}>Delete location</button>
                            </div>
                        ) : (
                            <div>
                                <h1 className='text2xl'>Select a location to edit its information</h1>
                            </div>
                        )}
                        <button type='button' className="text-xl font-bold text-center p-1 my-1 text-gray-950 bg-cyan-400 shadow-md/50 shadow-cyan-700 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-cyan-600 hover:text-gray-900" onClick={() => window.location.href = "/dashboard?password=admin123"} >Return to dashboard</button>
                    </div>
                )}

            </form>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={onLoad} onUnmount={onUnmount} options={{
                fullscreenControl: false
            }}>
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
                            SetMinimized(false)
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