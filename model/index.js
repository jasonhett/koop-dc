
var request = require('request'),
  async = require('async'),
  fs = require('fs');

var DCMETRO = function( koop ){

  var dcmetro = {};
  dcmetro.__proto__ = koop.BaseModel( koop );

  var geomDB;
  // figure out if we have a PostGIS based cache
  if ( koop.Cache.db && koop.Cache.db.type && koop.Cache.db.type === 'elasticsearch' ){
    // require koop-pgcache
    geomDB = require('koop-pgcache').connect(koop.config.db.pg, koop);
  } else {
    geomDB = koop.Cache.db;
  }


  // looks at the cache and checks for data
  // requests it from the API if not found in cache
  dcmetro.find = function(params, options, callback ){

    var type = 'bus';

    var k = 0;
    var q = async.queue(function (task, cb) {
      geomDB._query(task.query, function(err, result) {
        if (err || !result || !result.rows.length){
          return callback(err, null);
        }
        task.feature.geometry = JSON.parse( result.rows[0].geom );
        for (var p in task.feature.properties){
          if (variables[p]){
            task.feature.properties[p] = {
              label: variables[p].label,
              concept: variables[p].concept,
              value: task.feature.properties[p]
            };
          }
          task.feature.properties.source = type;
          task.feature.properties.level = qtype;
        }
        cb( task.feature );
      });
    }, 4);

    q.drain = function(){
      // insert data
      koop.Cache.insert( type, key, geojson, 0, function( err, success){
        if ( success ) {
          callback( null, [geojson] );
        }
      });

    };

    var type = 'bus',
      key,
      headers,
      url,
      query,
      feature,
      geojson = { type:'FeatureCollection', features:[] };

      key = params.routeID;

    // if ( qtype == 'state' ){
    //   key = [params.year, params.state, params.variable].join('-');
    // } else if (qtype == 'county'){
    //   key = [params.year, params.state, params.county, params.variable].join('-');
    // } else if ( qtype == 'tract'){
    //   key = [params.year, params.state, params.county, params.tract, params.variable].join('-');
    // }

    console.log("key: "+key);

    // for large datasets ingore koop's large data limit
    options.bypass_limit = true;

    // check the cache for data with this type & key
    koop.Cache.get(type, key, options, function(err, entry ){
      if (err){
        console.log(params)
        // if we get an err then get the data and insert it
        // switch ( qtype ){
        //   case 'county':
        //     url = 'http://api.census.gov/data/'+params['year']+'/acs5?get='+params['variable']+'&for=county:'+params['county']+'&in=state:'+params['state'];
        //     break;
        //   case 'state':
        //     url = 'http://api.census.gov/data/'+params['year']+'/acs5?get='+params['variable']+'&for=state:'+params['state'];
        //     break;
        //   case 'tract':
        //     url = 'http://api.census.gov/data/'+params['year']+'/acs5?get='+params['variable']+'&for=tract:'+params['tract']+'&in=state:'+params['state']+'+county:'+params['county'];
        //     break;
        // }
        // url += '&key=b2410e6888e5e1e6038d4e115bd8a453f692e820';
        url = 'https://api.wmata.com/Bus.svc/json/jRouteDetails?api_key=ccfeeb81bbc54b3cbc064f3e4d5266ea&RouteID='+params['routeID'];

        request.get(url, function(e, res){

          try {
            var json = JSON.parse(res.body);
            console.log(res.body)
            // json.forEach(function(row,i){
            //   if (i == 0){
            //     headers = row;
            //   } else {
            //     feature = {type:'Feature', properties:{}};
            //     row.forEach(function(col,j){
            //       feature.properties[headers[j]] = (!isNaN(parseInt(col)) && !( headers[j] == 'county' || headers[j] == 'state' || headers[j] == 'tract')) ? parseInt(col) : col;
            //     });
            //     switch ( qtype ){
            //       case 'county':
            //         query = "select st_asgeojson(geom) as geom from us_counties where countyfp = '"+feature.properties.county+"' AND statefp = '"+feature. properties.state+"'";
            //         break;
            //       case 'state':
            //         query = "select st_asgeojson(geom) as geom from us_states where statefp = '"+feature. properties.state+"'";
            //         break;
            //       case 'tract':
            //         query = "select st_asgeojson(geom) as geom from tracts where tractce = '"+feature.properties.tract+"' AND statefp = '"+feature.properties.state+"' AND countyfp = '"+feature.properties.county+"'";
            //         break;
            //     }
            //     q.push({query: query, feature: feature}, function(f){
            //       geojson.features.push( f );
            //     });
            //   }
            // });

          } catch(e){
            console.log(e);
            callback(res.body, null);
          }
        });
      } else {
        // We have data already, send it back
        callback( null, entry );
      }
    });

  };

  return dcmetro;
}


module.exports = DCMETRO;
