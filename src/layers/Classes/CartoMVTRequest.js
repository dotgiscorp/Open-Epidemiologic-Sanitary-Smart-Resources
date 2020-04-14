class CartoMVTRequest {
    constructor(definition) {
      this.cartoAccount = definition.cartoAccount;
      this.cartoMapsKey = definition.cartoMapsKey;
      this.id = definition.id;
      this.sql = definition.sql;
      this.getGeoJSON = definition.getGeoJSON;
      this.aggregationConfig = definition.aggregationConfig;
    }
  
    async getTiles() {
      const mapConfig = {
        buffersize: { mvt: 1 },
        layers: [
          {
            id: this.id,
            type: 'mapnik',
            options: {
              sql: this.sql,
              aggregation: this.aggregationConfig || undefined,
              id: 'cartodb_id'
            }
          }
        ]
      };
  
      const response = await fetch(
        `https://${this.cartoAccount}.carto.com/api/v1/map${
          this.cartoMapsKey ? `?api_key=${this.cartoMapsKey}` : ''
        }`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mapConfig)
        }
      );
  
      const layergroup = await response.json();
  
      return layergroup.metadata.tilejson.vector.tiles;
    }
  
    get requestInfo() {
      return {
        carto_account: this.cartoAccount,
        carto_maps_key: this.cartoMapsKey,
        request_id: this.id,
        sql_query: this.sql,
        aggregation_config: this.aggregationConfig || undefined
      };
    }
  
    set updateSql(query) {
      this.sql = query;
    }
  }
  
  export default CartoMVTRequest;
  