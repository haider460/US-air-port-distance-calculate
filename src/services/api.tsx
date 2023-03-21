import axios from "axios";

export const getUSAirportsApi = async () => {
  try {
    const data = await axios.get(
      "https://raw.githubusercontent.com/asimhafeezz/airports-data/master/airports.json"
    );
    return data.data;
  } catch (error) {
    return false;
  }
};
