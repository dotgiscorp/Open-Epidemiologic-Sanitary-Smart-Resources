export default {
    infected: 'SELECT * FROM covid',
    workers: `SELECT cartodb_id, workers, ST_Transform(ST_MakeLine(the_geom, ST_GeomFromText(destination_centroid, 4326)), 3857) as the_geom_webmercator FROM workers_flow WHERE workers > 100 ORDER BY workers DESC`
};
