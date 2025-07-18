'use client';
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
const containerStyle = {
  width: '100vw',
  height: '100vh',
}

function MapComp() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  })
  const [map, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const [center, setCenter] = React.useState({
    lat: 47.670162200927734,
    lng: 26.28742027282715,
  })
  const [zoom, SetZoom] = React.useState(15)
  const [locations, setLocations] = React.useState([]);
  const [operators, setOperators] = React.useState([])
  const [selectedLocation, setSelectedLocation] = React.useState(0)
  const [query, SetQuery] = React.useState('ID')
  const [searcResults, setSearchResults] = React.useState([])
  React.useEffect(() => {
    fetch('/api/operators')
      .then(response => response.json())
      .then(data =>
        setOperators(data)
      )
      .catch(error => console.error('Error fetching operators:', error))
  }, [])
  React.useEffect(() => {
    fetch('/api/locations')
      .then(response => response.json())
      .then(data =>
        setLocations(data)
      )
      .catch(error => console.error('Error fetching locations:', error))
  }, [])
  const opInfo = (op)=> `${op.name}(${op.origin})`
  return isLoaded ? (
    <div className="flex flex-col items-end justify-center">
      <div className="flex flex-col fixed w-fit top-15 right-5 bg-[#010101aa] backdrop-blur-sm p-2 z-10 rounded-2xl text-lg text-white">
        <select id="query" className='text-center text-xl p-1 m-1 text-gray-50 bg-fuchsia-500 rounded-2xl hover:bg-fuchsia-700 hover:text-gray-200 transition-all duration-300' onChange={(event) => SetQuery(event.target.value)}>
          <option value="ID">ID</option>
          <option value="Op">Operator</option>
          <option value="Gen">Generation</option>
        </select>
        {query == 'Gen' ? (
          <select className='text-center text-xl text-gray-50 p-1 bg-blue-500 rounded-2xl border-2 border-blue-950 hover:bg-blue-600 hover:text-gray-200 hover:border-blue-800 transition-all duration-300' onChange={(event) => { setSearchResults(locations.filter((v) => v.generation == event.target.value)) }}>
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
            <input type='text' min={0} placeholder='Search locations' className='bg-gray-900 placeholder:text-gray-400 text-green-500 rounded-xl' onChange={(event) => {
              if (event.target.value) setSearchResults(locations.filter((v) => v.id == event.target.value));
              else setSearchResults([]);
            }} />
          )
        ) : (
          <select className='text-center text-2xl text-slate-800 bg-lime-400 rounded-2xl border-2 border-lime-900 hover:bg-lime-500 hover:text-slate-700 hover:border-lime-700 transition-all duration-300' id={`loc${location.id}_op`} defaultValue={location.operatorId} onChange={e => { setSearchResults(locations.filter((v) => v.operatorId == e.target.value)) }}>
            <option key={-1} value={-1}>Unknown</option>
            {operators.map((op, index) => (
              <option value={op.id} key={op.id}>{op.name}</option>
            ))}
          </select>
        ))
        }
        {searcResults ? searcResults.map((value, index) => (
          <button key={index} className='text-xl font-bold text-left p-1 text-gray-50 cursor-pointer transition-all duration-300 hover:text-gray-300' onClick={() => {
            setSelectedLocation(value)
            setCenter({ lat: value.latitude, lng: value.longitude })
            SetZoom(14)
          }}>{value.id}.{value.operatorId}({value.generation})</button>
        ))
          : (
            <></>
          )}
        {selectedLocation ? (
          <div>
            {selectedLocation.active ? (
              <h1 className='text-2xl font-bold text-green-500'>Location no. {selectedLocation.id} (Active)</h1>
            ) : (
              <h1 className='text-2xl font-bold text-red-500'>Location no. {selectedLocation.id} (Inactive)</h1>
            )}
            <h2 className='font-bold flex flex-row'>Latitude: <p className='font-light'>{selectedLocation.latitude}</p></h2>
            <h2 className='font-bold flex flex-row'>Longitude: <p className='font-light'>{selectedLocation.longitude}</p></h2>
            <h2 className='font-bold flex flex-row'>Range: <p className='font-light'>{selectedLocation.range} meters</p></h2>
            <h2 className='font-bold flex flex-row'>Generation: <p className='font-light'>{selectedLocation.generation}</p></h2>
            <h2 className='font-bold flex flex-row'>Operated by: {selectedLocation.operatorId != -1 ? (<p className='font-light'>{opInfo(operators.find(op => op.id == selectedLocation.operatorId))}</p>) : (<p className='font-medium text-gray-400'>Unknown</p>)}</h2>

          </div>
        ) : (
          <div>
            <h1 className='text2xl'>Select a location to view its details</h1>
          </div>
        )}
      </div>
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
            animation={window.google.maps.Animation.DROP}
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            title={`[${location.id}] - ${location.active ? 'Active' : 'Inactive'}, ${location.generation}`}
            onClick={() => {
              setSelectedLocation(location)
            }}
          />
        ))}
        {locations.map((location, index) => (
          <Circle
            key={index}
            center={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            radius={location.range}
            options={{
              fillColor: location.active ? 'green' : 'red',
              fillOpacity: 0.2,
              strokeColor: location.active ? 'green' : 'red',
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

export default React.memo(MapComp)