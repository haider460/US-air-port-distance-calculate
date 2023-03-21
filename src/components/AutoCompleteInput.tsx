import { Autocomplete } from "@mui/material";
import React from "react";
import "../style/AutoCompleteInput.css";
import TextField from "@mui/material/TextField";

interface propsTypes {
  data: string[];
  labelText: string;
  onBlurInput: React.ReactEventHandler<HTMLDivElement> | undefined;
}

export default function AutoCompleteInput(props: propsTypes) {
  return (
    <div className="AutoCompleteInput">
      <Autocomplete
        className="autocomplete"
        options={props.data.map((option) => option)}
        onSelect={props.onBlurInput}
        renderInput={(params) => (
          <TextField {...params} label={props.labelText} />
        )}
      />
    </div>
  );
}
