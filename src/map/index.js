import React from 'react';
import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { useCartoTiles } from '../layers/Hooks/useCartoTiles';
import { MVTLayer } from '@deck.gl/geo-layers';
import { scaleThreshold } from 'd3-scale';
import { Sidebar } from '../components';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZG90Z2lzIiwiYSI6ImNqd3Z6amtjMTBjOTA0OW84ZjVvYzF6bjQifQ.LIbUaYq3GaiWTzsBV6YnTA';

const mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const checkBrowserSupport = () => {
  if (!mapboxgl.supported()) {
    // eslint-disable-next-line
    alert('Tu navegador no soporta Mapbox GL JS.');
    return false;
  }
  return true;
};

const COLOR_SCALE = scaleThreshold()
  .domain([0, 100, 500, 1000, 1500, Number.MAX_SAFE_INTEGER])
  .range([
    [1, 152, 189, 150],
    [73, 227, 206, 150],
    [216, 254, 181, 150],
    [254, 237, 177, 150],
    [254, 173, 84, 150],
    [209, 55, 78, 255] 
]);

const LINE_COLOR_SCALE = scaleThreshold()
  .domain([0, 100, 250, 500, 1000, Number.MAX_SAFE_INTEGER])
  .range([
    [255, 255, 255, 5],
    [255, 255, 255, 10],
    [255, 255, 255, 25],
    [255, 255, 255, 50],
    [255, 255, 255, 100],
    [255, 255, 255, 255]
]);

const LINE_WIDTH = scaleThreshold()
  .domain([0, 100, 10000, 100000, 500000, Number.MAX_SAFE_INTEGER])
  .range([
    10,
    50,
    200,
    500
]);

const MapboxMap = () => {
  const mapObject = React.useRef();
  const [viewState, setViewState] = React.useState({
    latitude: 40.51731304944695,
    longitude: -3.726903525949845,
    zoom: 7.94,
    maxZoom: 16,
    pitch: 0,
    bearing: 0
  });
  const [hoveredObject, setHovered] = React.useState({});
  const [layersConfig] = useCartoTiles();

  const onViewStateChange = ({ viewState }) => {
    setViewState({ ...viewState });
  }

  const formatNumber = value => new Intl.NumberFormat('es').format(value);

  const renderTooltip = () => {
    const {x, y, hoveredFeature, field, label} = hoveredObject;

    return (
      hoveredFeature && (
        <div className="tooltip" style={{left: x, top: y}}>
          {`${formatNumber(hoveredFeature.properties[field])} ${label}`}
        </div>
      )
    );
  };

  const onHover = ({x, y, object, field, label}) => {
    setHovered({x, y, hoveredFeature: object, field, label});
  };

  const tileLayers = config => {
    return Object.values(config).map((layer, index) => (
        new MVTLayer({
          id: index,
          data: layer.tiles[0],
          minZoom: 0,
          maxZoom: 23,
          lineWidthMinPixels: 0.5,
          pickable: true,
          autoHighlight: true,
          highlightColor: [153, 255, 204],
          onHover: ({x, y, object}) => onHover({x, y, object, ...(layer.type === 'polygon' ? { field: 'total', label: 'infected' } : { field: 'workers', label: 'workers' })}),
          ...(layer.type === 'line' && { getLineWidth: f => LINE_WIDTH(f.properties.workers), getLineColor: f => LINE_COLOR_SCALE(f.properties.workers), lineJointRounded: true }),
          ...(layer.type === 'polygon' && { getFillColor: f => COLOR_SCALE(f.properties.total) })
      })
    ));
  };

  return (
    <>
      {checkBrowserSupport() && layersConfig && (
        <>
          <DeckGL
            layers={tileLayers(layersConfig)}
            viewState={viewState}
            onViewStateChange={onViewStateChange}
            controller={true}
          >
            <ReactMapGL
              reuseMaps
              mapStyle={mapStyle}
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              ref={mapObject}
            />
            {renderTooltip()}
          </DeckGL>
          {mapObject.current && <Sidebar mapObject={mapObject.current.getMap()} /> }
        </>
      )}
    </>
  );
};

export default MapboxMap;

/* Deck
  [1, 152, 189, 150],
  [73, 227, 206, 150],
  [216, 254, 181, 150],
  [254, 237, 177, 150],
  [254, 173, 84, 150],
  [209, 55, 78, 255] */

/* SunsetDark
  [252, 222, 156, 200],
  [250, 164, 118, 200],
  [240, 116, 110, 200],
  [227, 79, 111, 200],
  [220, 57, 119, 200],
  [185, 37, 122, 200],
  [124, 29, 111, 200] */

/* Burg
  [255, 198, 196, 255],
  [244, 163, 168, 255],
  [227, 129, 145, 255],
  [204, 96, 125, 255],
  [173, 70, 108, 255],
  [139, 48, 88, 255],
  [103, 32, 68, 255] */

/* Mint
  [228, 241, 225, 255],
  [180, 217, 204, 255],
  [137, 192, 182, 255],
  [99, 166, 160, 255],
  [68, 140, 138, 255],
  [40, 114, 116, 255],
  [13, 88, 95, 255] */
