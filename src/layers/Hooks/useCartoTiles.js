import React, { useState } from 'react';
import CartoMVTRequest from '../Classes/CartoMVTRequest';
import QUERY from '../Config/queries';
import CONFIG from '../Config/config';

function useCartoTiles() {
  const [layersConfig, setLayers] = useState(null);

  const getTiles = async () => {
      
    const infected = new CartoMVTRequest({
      cartoAccount: CONFIG.dotgisUser,
      cartoMapsKey: CONFIG.mapsKey,
      id: CONFIG.infecetedSourceLayer,
      sql: QUERY.infected
    });

    const workers = new CartoMVTRequest({
      cartoAccount: CONFIG.dotgisUser,
      cartoMapsKey: CONFIG.mapsKey,
      id: CONFIG.workersSourceLayer,
      sql: QUERY.workers
    });

    Promise.all([
      infected.getTiles(),
      workers.getTiles()
    ]).then(response => {
      setLayers({
        infected_source: {
          tiles: response[0],
          type: 'polygon'
        },
        workers_source: {
          tiles: response[1],
          type: 'line'
        }
      });
    });
  };

  React.useEffect(() => {
    getTiles();
  }, []);

  return [layersConfig];
}

export { useCartoTiles };
