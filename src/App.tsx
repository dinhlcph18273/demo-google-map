import React, {useCallback,useEffect,useState} from 'react'
import { GoogleMap, useJsApiLoader ,Marker ,Polygon} from '@react-google-maps/api';

const containerStyle = {
  width: '1000px',
  height: '100vh'
};

const center = {
  lat: 35.689884039809364,
  lng: 139.76625680132528
};
function App() {
  const [map, setMap] = React.useState(null)
  const [markers, setMarkers] = React.useState([]);
  const [polygon, setPolygon] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCCL_A-O1DlUGu9ueNq8xhwlf5GB9qmIqI"
  })


  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const addMarker = (e:google.maps.LatLng | google.maps.LatLngLiteral) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
  }

  const handleClickMarker = (e) => {
    markers.forEach((marker,index) => {
      if(marker.lat === e.latLng.lat() && marker.lng === e.latLng.lng() && deleteMode){
        const newListMaker = [...markers.slice(0, index), ...markers.slice(index + 1)]; 
        setMarkers(newListMaker)
      }
    });
  }

  const options = {
    fillColor: "lightblue",
    fillOpacity: 1,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
  }

  const handShowPolygon = (e) => {
    setPolygon(e)
  }

  const handChangeDeleteMode = (e) => {
    setDeleteMode(e)
  }
  

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(event) => addMarker(event)}
      >
        {markers?.map((marker,index) => (
          <Marker 
            key={index}
            position={{ 
              lat: marker.lat,
              lng: marker.lng 
            }} 
            onClick={(e) => handleClickMarker(e)}
            />
        ))}
        <Polygon
          paths={markers}
          options={options}
          visible={polygon}
        />
      </GoogleMap>

      <label htmlFor="deleteMode"><input type="checkbox" id="deleteMode" onClick={(e)=> handChangeDeleteMode(e.target.checked)} />delete Mode</label>
      <label htmlFor="draw"><input type="checkbox" id="draw" onClick={(e)=> handShowPolygon(e.target.checked)} />show draw</label>
      
    </>
) : <></>
}

export default App
