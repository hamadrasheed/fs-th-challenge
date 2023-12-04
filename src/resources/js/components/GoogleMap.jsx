import React from "react";
import GoogleMapReact from "google-map-react";
import {
  APP_NAME,
  CLIENT_ADDRESS,
  CLIENT_GMAP_CENTER,
  CLIENT_GMAP_DIRECTION,
  CLIENT_GMAP_KEY,
  CLIENT_GMAP_LAT,
  CLIENT_GMAP_LNG,
} from "../vars/types";

const GoogleMap = () => {
  const getInfoWindowString = () =>
    `<div id="iw-container">
      <div class="iw-content">
      <img src="/images/logotype.png" alt=${APP_NAME}/>
      <div class="iw-subTitle">Address</div>
      <p>${CLIENT_ADDRESS}</p>
      <p><a href="${CLIENT_GMAP_DIRECTION}">Get Direction</a></p><br>`;

  const handleApiLoaded = (map, maps) => {
    const marker = new maps.Marker({
      position: {
        lat: parseFloat(CLIENT_GMAP_LAT),
        lng: parseFloat(CLIENT_GMAP_LNG),
      },
      map,
      icon: "/images/pin.svg",
      anchorPoint: new google.maps.Point(0, -29),
    });

    const infowindow = new maps.InfoWindow({
      content: getInfoWindowString(),
      maxWidth: 350,
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  };

  return (
    <div className="w-full h-full">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: CLIENT_GMAP_KEY,
          libraries: ["places"], // 'geometry', 'drawing', 'visualization'
        }}
        options={{
          disableDefaultUI: true,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
          ],
        }}
        defaultCenter={CLIENT_GMAP_CENTER}
        defaultZoom={15}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      />
    </div>
  );
};

export default GoogleMap;
