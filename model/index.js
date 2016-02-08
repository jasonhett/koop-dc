
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

  // for large datasets ingore koop's large data limit
  options.bypass_limit = true;
}


module.exports = DCMETRO;
