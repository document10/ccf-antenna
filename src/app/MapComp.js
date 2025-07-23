'use client';
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import Image from 'next/image';
const containerStyle = {
  width: '100vw',
  height: '100vh',
}

function MapComp() {
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, })
  const [map, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, [])
  const onUnmount = React.useCallback(function callback(map) { setMap(null) }, [])
  const [center, setCenter] = React.useState({ lat: 47.670162200927734, lng: 26.28742027282715, })
  const [zoom, SetZoom] = React.useState(15)
  const [locations, setLocations] = React.useState([]);
  const [operators, setOperators] = React.useState([])
  const [selectedLocation, setSelectedLocation] = React.useState(0)
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
  const opInfo = (op) => `${op.name} (from ${op.origin})`
  return isLoaded ? (
    <div className="flex flex-col items-end justify-center">
      <div className="flex flex-col fixed w-fit top-14 right-3 md:top-2 md:right-3 bg-[#010101aa] backdrop-blur-sm p-2 z-10 rounded-2xl text-lg text-white shadow-md/50 shadow-blue-500">
        {minimized ? (
          <button className='flex flex-row gap-1 justify-center bg-emerald-500 shadow-md/50 shadow-emerald-300 transition-all duration-500 hover:text-gray-700 hover:bg-emerald-400 rounded-2xl cursor-pointer text-base p-2' onClick={(e) => SetMinimized(!minimized)}><Image src='/maximize.svg' width={20} height={20} alt='plus' />Expand</button>
        ) : (
          <div className='flex flex-col' id='expanded'>
            <button className='flex flex-row justify-center gap-2 text-gray-50 bg-emerald-500 transition-all duration-500 hover:text-gray-200 hover:bg-emerald-600 shadow-md/50 shadow-emerald-300 rounded-xl cursor-pointer p-1 mb-2' onClick={() => SetMinimized(!minimized)}><Image src='/minimize.svg' width={20} height={20} alt='plus' />Collapse</button>
            <select id="query" className='text-center text-xl py-1 my-1 text-gray-50 bg-fuchsia-500 rounded-2xl shadow-md/50 shadow-fuchsia-700 hover:bg-fuchsia-700 hover:text-gray-200 transition-all duration-300' onChange={(event) => SetQuery(event.target.value)}>
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
            ) : (query == 'ID' ? ((
              <input type='number' min={0} placeholder='Search locations' className='bg-gray-900 placeholder:text-gray-400 text-green-500 shadow-md/50 shadow-gray-600 rounded-xl transition-all duration-500 hover:bg-gray-950' onChange={(event) => {
                if (event.target.value) setSearchResults(locations.filter((v) => v.id == event.target.value));
                else setSearchResults([]);
              }} />
            )) : (
              <select className='text-center text-2xl text-slate-800 bg-lime-400 rounded-2xl shadow-sm/50 shadow-lime-300 border-2 border-lime-900 hover:bg-lime-500 hover:text-slate-700 hover:border-lime-700 transition-all duration-300' id={`loc${location.id}_op`} defaultValue={location.operatorId} onChange={e => { setSearchResults(locations.filter((v) => v.operatorId == e.target.value)) }}>
                <option key={-1} value={-1}>Unknown</option>
                {operators.map((op, index) => (<option value={op.id} key={op.id}>{op.name}</option>))}
              </select>
            ))}
            {searcResults ? searcResults.map((value, index) => (
              <button key={index} className='text-xl font-bold text-center  my-2 md:my-1 text-gray-50 cursor-pointer transition-all duration-300 hover:text-gray-300' onClick={() => {
                setSelectedLocation(value);
                setCenter({ lat: value.latitude, lng: value.longitude });
                SetZoom(14);
              }}>{value.id}.{value.operatorId}({value.generation})</button>
            ))
              : (
                <></>
              )}
            {selectedLocation ? (
              <div>
                {selectedLocation.active ?
                  (<h1 className='text-2xl font-bold text-green-500 flex flex-row'><Image src='/online.svg' width={16} height={16} alt='ID' className='invert mx-2' />Location no. {selectedLocation.id} (Active)</h1>)
                  : (<h1 className='text-2xl font-bold text-red-500 flex flex-row'><Image src='/offline.svg' width={16} height={16} alt='ID' className='invert mx-2' />Location no. {selectedLocation.id} (Inactive)</h1>)}
                <h2 className='font-bold flex flex-row'>Latitude: <p className='font-light px-2'>{selectedLocation.latitude}</p></h2>
                <h2 className='font-bold flex flex-row'>Longitude: <p className='font-light px-2'>{selectedLocation.longitude}</p></h2>
                <h2 className='font-bold flex flex-row'>Range: <p className='font-light px-2'>{selectedLocation.range} meters</p></h2>
                <h2 className='font-bold flex flex-row'>Generation: <p className='font-light px-2'>{selectedLocation.generation}</p></h2>
                <h2 className='font-bold flex flex-row'>Operated by: {selectedLocation.operatorId != -1 ? (<a className='font-light px-2 underline' href={`http://192.168.0.148:3000/api/images?operator=${selectedLocation.operatorId}`} download={`operator_${selectedLocation.operatorId}.png`} title='Download Operator Info'>{opInfo(operators.find(op => op.id == selectedLocation.operatorId))}</a>) : (<p className='font-medium text-gray-400 px-2'>Unknown</p>)}</h2>
                <Image src={`/api/images?location=${selectedLocation.id}&qr=1`} width={256} height={256} alt='qrcode' className='m-4' />
                <a className='flex flex-row justify-center gap-2 bg-gray-100 text-gray-950 shadow-md/50 shadow-gray-200 rounded-xl cursor-pointer p-1 transition-all duration-300 hover:bg-gray-300 hover:text-gray-800' href={`http://192.168.0.148:3000/api/images?location=${selectedLocation.id}`} download={`location_${selectedLocation.id}.png`}>Download Info</a>
              </div>
            ) : (<h1 className='text2xl'>Select a location to view its details</h1>)}
          </div>
        )}
      </div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={onLoad} onUnmount={onUnmount} options={{ fullscreenControl: false, mapTypeControl: true, mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU } }} >
        {locations.map((location, index) => (
          <Marker key={index} animation={window.google.maps.Animation.DROP} position={{ lat: location.latitude, lng: location.longitude, }} title={`[${location.id}] - ${location.active ? 'Active' : 'Inactive'}, ${location.generation}`}
            onClick={() => {
              SetMinimized(false)
              setSelectedLocation(location)
            }} />
        ))}
        {locations.map((location, index) => (
          <Circle key={index} center={{ lat: location.latitude, lng: location.longitude, }} radius={location.range}
            options={{
              fillColor: location.active ? 'green' : 'red',
              fillOpacity: 0.2,
              strokeColor: location.active ? 'green' : 'red',
              strokeOpacity: 0.8,
              strokeWeight: 1,
            }} />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export default React.memo(MapComp)