'use client';
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
const containerStyle = {
  width: '100vw',
  height: '100vh',
}

// const locations = [
//   {
//     "latitude": 47.670162,
//     "longitude": 26.287420,
//     "range": 1000,
//     "operators": "Vodafone, Orange",
//     "generation": "5G",
//     "active": true
//   },
//   {
//     "latitude": 47.071000,
//     "longitude": 26.288000,
//     "range": 200,
//     "operators": "Telekom",
//     "generation": "4G",
//     "active": true
//   },
//   {
//     "latitude": 44.671000,
//     "longitude": 29.288000,
//     "range": 100,
//     "operators": "Digi Mobile",
//     "generation": "3G or older",
//     "active": false
//   }
// ]

function MapComp() {
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
  const [center, setCenter] = React.useState({
    lat: 47.670162200927734,
    lng: 26.28742027282715,
  })
  const [zoom, SetZoom] = React.useState(15)
  const [locations, setLocations] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(0)
  React.useEffect(() => {
    fetch('/api/locations')
      .then(response => response.json())
      .then(data =>
        setLocations(data)
      )
      .catch(error => console.error('Error fetching locations:', error))
  }, [])

  return isLoaded ? (
    <div className="flex flex-col items-end justify-center">
      <div className="flex flex-col fixed w-fit top-15 right-5 bg-[#000000bb] p-2 z-10 rounded-2xl text-lg text-white">
        <input type='number' min={0} placeholder='Search by ID' className='bg-gray-900 placeholder:text-gray-400 text-green-500' onChange={(event) => {
          const location = locations.find((v) => v.id == event.target.value)
          if (location) {
            setSelectedLocation(location)
            setCenter({ lat: location.latitude, lng: location.longitude })
            SetZoom(14)
          }
        }} />
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
            <h2 className='font-bold flex flex-row'>Operated by: <p className='font-light'>{selectedLocation.operators}</p></h2>

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
            title={`[${location.id}] ${location.operators} - ${location.active ? 'Active' : 'Inactive'}, ${location.generation}`}
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