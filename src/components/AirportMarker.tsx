import React from "react";
import { blue } from "@mui/material/colors";
import { LocalAirport } from "@mui/icons-material";

interface propsTypes {
  key: number;
  lat?: number;
  lng?: number;
  text?: string | number;
}

interface StyleTypes {
  Position: string;
  width: number;
  height: number;
  left: number;
  top: number;
  color: string;
}

export default function AirportMarker(props: propsTypes) {
  const MARKER_SIZE = 20;

  const markerStyle: StyleTypes = {
    Position: "absolute",
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    left: -MARKER_SIZE / 2,
    top: -MARKER_SIZE / 2,
    color: blue[500],
  };

  return (
    <div style={markerStyle}>
      <LocalAirport color={"primary"} />
      {props.text}
    </div>
  );
}
