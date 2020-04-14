import React from 'react';
import './style.scss';

const Sidebar = ({ mapObject }) => {

    const [data, setData] = React.useState({});

    const formatNumber = value => new Intl.NumberFormat('es').format(value);

    const fetchData = async endpoint => {
        const response = await fetch(endpoint);
        return await response.json(); 
    };

    const manageData = () => {
        const bounds = mapObject.getBounds();
        const test = [bounds._ne.lng, bounds._ne.lat, bounds._sw.lng, bounds._sw.lat];
    
        const queries = {
            covid: `SELECT * FROM viewportfeatures(${[...test]})`,
            workersFlow: `SELECT * FROM viewportfeaturescodvidworkersflow(${[...test]})`
        }

        const viewportFeaturesEndpoint = query => `https://dotgis.carto.com/api/v2/sql?q=${query}&api_key=5583d7b33b1565885b41ad5dfa24f705a1dfef81`;

        Promise.all([fetchData(viewportFeaturesEndpoint(queries.covid)), fetchData(viewportFeaturesEndpoint(queries.workersFlow))])
          .then(responses => {
            const covidData = responses && responses[0] && responses[0].rows;
            const workersFlowData = responses && responses[1] && responses[1].rows;

            setData({
                total: formatNumber(covidData[0].total),
                last_14_days: formatNumber(covidData[0].last_14_days),
                workersFlow: formatNumber(workersFlowData[0].workers)
            });
          })
          .catch((error) => {
            console.log(error)
          });
    };

    React.useEffect(() => {
        manageData();
        mapObject.on('moveend', manageData);

        return () => mapObject.off('moveend', manageData);
    }, [mapObject]);

    return (
        <div className="sidebar">
            <div className="sidebar__indicator">
                <h1>{data.total}</h1>
                <h3>Infected. Total</h3>
            </div>
            <div className="sidebar__indicator">
                <h1>{data.last_14_days}</h1>
                <h3>Infected. Last 14 days</h3>
            </div>
            <div className="sidebar__indicator">
                <h1>{data.workersFlow}</h1>
                <h3>Workers flow</h3>
            </div>
        </div>
    );
};

export { Sidebar };
