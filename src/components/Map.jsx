import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";

import styled from "styled-components";
import { useMemo } from "react";

const Map_container = styled.div`
	position: relative;
	width: 300px;
	height: 400px;
`;

const Map_marker_centered = styled.div`
	background-image: url(https://i.ibb.co/tcBy2Rq/marker.png);
	width: 20%;
	height: 10%;
	background-repeat: no-repeat;
	position: absolute;
	z-index: 400;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transition: all 0.4s ease;
	background-size: contain;
`;

const Map = ({ long, lat, isMapBlurred, onDragEnd, setFlyLoading, fly, listSelected, setListSelected }) => {
  // const [position, setPosition] = useState([lat, long]);

  useEffect(() => {
    console.log('map initiated')
  }, [])
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        filter: `${isMapBlurred ? "blur(10px)" : "blur(0px)"}`,
      }}>
      <MapContainer
        center={[lat, long]}
        zoom={14}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer url='https://api.mapbox.com/styles/v1/devkkali/cl9bbbg6g002815l3y0jhfexu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2a2thbGkiLCJhIjoiY2w5YjB5am9sMGZkdTNxbGU5NmQ0azBxZiJ9.LyGxEiZiUQdpPcGn3iyBrA' />
        <Map_marker_centered />
        <Test onDragEnd={onDragEnd} location={[lat, long]} isMapBlurred={isMapBlurred} setFlyLoading={setFlyLoading} fly={fly} listSelected={listSelected} setListSelected={setListSelected} />
      </MapContainer>
    </div>
  );
};

function Test({ location, onDragEnd, isMapBlurred, setFlyLoading, fly, listSelected, setListSelected }) {

  console.log(location)
  // console.log(isMapBlurred)
  // console.log(setFlyLoading)
  // console.log('fly', fly)
  // console.log('listSelected', listSelected)


  useMapEvents({
    moveend(e) {
      const { lat, lng } = map.getCenter()
      if (!isMapBlurred) {
        onDragEnd(lat, lng);
      }
    },
  });
  const map = useMap();
  if (location) {
    // console.log(location)
    if (fly || listSelected) {
      setListSelected(false)
      map.flyTo(location, 12);
    }
  }
}

export default Map;
