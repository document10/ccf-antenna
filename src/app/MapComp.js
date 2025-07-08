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

function MapComp() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Ensure this is set in your environment variables
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

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <Marker
        animation={window.google.maps.Animation.DROP}
        position={{
          lat: 47.670162200927734,
          lng: 26.28742027282715,
        }}
        title="My location"
      />
      <Circle
        center={{
          lat: 47.670162200927734,
          lng: 26.287420272827,
        }}
      radius={100}
      options={{
        fillColor: '#ff0000',
        fillOpacity: 0.2,
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 1,
      }}
      />
      <Marker
        animation={window.google.maps.Animation.DROP}
        position={{
          lat: 41.670162200927734,
          lng: 22.28742027282715,
        }}
      title="Marker in a different location"
      />
      <Circle
        center={{
          lat: 41.670162200927734,
          lng: 22.287420272827,
        }}
      radius={100}
      options={{
        fillColor: '#ff0000',
        fillOpacity: 0.2,
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 1,
      }}
      />
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(MapComp)