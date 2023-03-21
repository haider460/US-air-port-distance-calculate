import React, { useEffect, useState } from "react";
import AirportMarker from "./AirportMarker";
import GoogleMapReact from "google-map-react";
import mapStyles from "../constants/mapStyles";
import "../style/SimpleMap.css";
import { getUSAirportsApi } from "../services/api";

interface mapProps {
  center: number[];
  zoom: number;
}

interface Distance {
  iata_code?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
}

const SimpleMap: React.FC<mapProps> = (props) => {
  const [airports, setAirports] = useState<Distance[]>([]);
  const mapCenter: number[] | undefined = props.center;

  // set icons on airports
  const createMapOptions = () => {
    return {
      styles: mapStyles,
    };
  };

  //  point out all airports in usa
  const Markers = () =>
    airports.map((e, index) => {
      return (
        <AirportMarker
          key={index}
          lat={e.latitude}
          lng={e.longitude}
          text={e.iata_code}
        />
      );
    });

  //  get airport location from api
  const getUSAirports = async () => {
    const data = await getUSAirportsApi();
    if (data) {
      setAirports(data);
    }
  };

  useEffect(() => {
    getUSAirports();
  }, []);

  return (
    <div className="SimpleMap">
      <GoogleMapReact
        center={{ lat: mapCenter[0], lng: mapCenter[1] }}
        options={(maps) => createMapOptions()}
        zoom={props.zoom}
        onGoogleApiLoaded={({ map, maps }) => {
          (window as any).map = map;
          (window as any).maps = maps;
        }}
        yesIWantToUseGoogleMapApiInternals
      >
        {Markers()}
      </GoogleMapReact>
    </div>
  );
};

export default SimpleMap;
