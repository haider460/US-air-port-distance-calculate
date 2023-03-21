import React, { useEffect, useState } from "react";
import AutoCompleteInput from "./components/AutoCompleteInput";
import SimpleMap from "./components/SimpleMap";
import Button from "@mui/material/Button";
import haversine from "./helpers/haversine";
import midpoint from "./helpers/midpoint";
import "./style/App.css";
import { Toolbar } from "@mui/material";
import { getUSAirportsApi } from "./services/api";

interface Distance {
  iata_code?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
}

export const App: React.FC = () => {
  const distanceObject = {
    iata_code: "",
    latitude: 0,
    longitude: 0,
    name: "",
  };
  // local state
  const [start, setStart] = useState<Distance>(distanceObject);
  const [airports, setAirports] = useState<Distance[]>([]);
  const [end, setEnd] = useState<Distance>(distanceObject);
  const [distance, setDistance] = useState<string | number>("");
  const [center, setCenter] = useState<number[]>([37.1, -95.7]);
  const [zoom, setZoom] = useState<number>(4);

  const data = airports.map((e) => e.name + " " + e.iata_code);

  // distanation place input function
  const handleEndInput = (searchText: any) => {
    let end = airports.find((e) => {
      return e.name + " " + e.iata_code === searchText.target.value;
    }) as Distance;
    setEnd(end);

    let flightPath = new (window as any).maps.Polyline({
      strokeColor: "",
      geodesic: false,
      path: [],
    });
    flightPath.setMap((window as any).map);
  };

  // starting airport input function
  const handleStartInput = (searchText: any) => {
    let start = airports.find((e) => {
      return e.name + " " + e.iata_code === searchText.target.value;
    }) as Distance;
    setStart(start);
    let flightPath = new (window as any).maps.Polyline({
      strokeColor: "",
      geodesic: false,
      path: [],
    });
    flightPath.setMap((window as any).map);
  };

  // draw the yallow line between the two airports
  const drawFlightPath = (start: Distance, end: Distance) => {
    let flightPath = new (window as any).maps.Polyline({
      path: [
        { lat: start.latitude, lng: start.longitude },
        { lat: end.latitude, lng: end.longitude },
      ],
      geodesic: true,
      strokeColor: "yellow",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    flightPath.setMap((window as any).map);
  };

  // set the zoom to map during changing the locations
  const scaleZoom = (distance: number) => {
    if (3000 < distance) {
      return 4;
    } else if (1000 < distance) {
      return 5;
    } else if (100 < distance) {
      return 6;
    } else if (distance < 100) {
      return 8;
    } else {
      return 4;
    }
  };

  // calculate the distance between two airports
  const calculateDistance = () => {
    const options = {
      unit: "nmi",
      threshold: 1,
    };

    let distance = Math.round(haversine(start, end, options)),
      newCenter = midpoint(start, end),
      zoom = scaleZoom(distance);
    drawFlightPath(start, end);
    setDistance(distance);
    setCenter(newCenter);
    setZoom(zoom);
  };

  //  convert notical miles to killo meter
  const MilesToKm = (value: number) => {
    const dis = Number(value) * 1.851;
    if (dis.toString().includes(".")) {
      const data: string[] = dis.toString().split(".");
      return data[0] + " " + "km";
    }
    return dis + " " + "km";
  };

  //  getting data from api
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
    <div>
      <div className="container">
        <Toolbar className="toolbar">
          <div className="toolbar-left">
            <AutoCompleteInput
              labelText={"Starting Airport..."}
              data={data}
              onBlurInput={(e) => handleStartInput(e)}
            />
            <AutoCompleteInput
              labelText={"Ending Airport..."}
              data={data}
              onBlurInput={(e) => handleEndInput(e)}
            />
            <Button onClick={() => calculateDistance()} variant="contained">
              Calculate
            </Button>
          </div>
          <div className="distance">
            <h3>
              {distance ? "Distance : " + MilesToKm(Number(distance)) : null}
            </h3>
          </div>
        </Toolbar>
      </div>
      <SimpleMap center={center} zoom={zoom} />
    </div>
  );
};
