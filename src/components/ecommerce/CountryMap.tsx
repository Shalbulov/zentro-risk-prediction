// react plugin for creating vector maps
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

// Координаты Тараза
const tarazLat = 42.896088;
const tarazLng = 71.398430;

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      // Устанавливаем фокус на Тараз
      focusOn={{
        lat: tarazLat,
        lng: tarazLng,
        scale: 6,
        animate: true,
      }}
      markerStyle={{
        initial: {
          fill: "#465FFF",
          r: 6,
        } as any,
      }}
      markersSelectable={true}
      markers={[
        {
          latLng: [37.2580397, -104.657039],
          name: "United States",
          style: {
            fill: "#465FFF",
            borderWidth: 1,
            borderColor: "white",
            stroke: "#383f47",
          },
        },
        {
          latLng: [20.7504374, 73.7276105],
          name: "India",
          style: {
            fill: "#465FFF",
            borderWidth: 1,
            borderColor: "white",
          },
        },
        {
          latLng: [53.613, -11.6368],
          name: "United Kingdom",
          style: {
            fill: "#465FFF",
            borderWidth: 1,
            borderColor: "white",
          },
        },
        {
          latLng: [-25.0304388, 115.2092761],
          name: "Sweden",
          style: {
            fill: "#465FFF",
            borderWidth: 1,
            borderColor: "white",
            strokeOpacity: 0,
          },
        },
        // Маркер для Тараза
        {
          latLng: [tarazLat, tarazLng],
          name: "Taraz, Kazakhstan",
          style: {
            fill: "#FF5A5F",
            borderWidth: 2,
            borderColor: "white",
            stroke: "#000000",
            r: 8,
          },
        },
      ]}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465fff",
          stroke: "none",
        },
        selected: {
          fill: "#465FFF",
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "#35373e",
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
