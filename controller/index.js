var fs = require('fs');

// inherit from base controller (global via koop-server)
var Controller = function( dcmetro, BaseController ){

  var controller = {};
  controller.__proto__ = BaseController();

  controller.featureservice = function(req, res){
    var callback = req.query.callback, self = this;
    delete req.query.callback;

    var send = function(err, data){
      if (err) {
        res.send(err, 500);
      } else {
        delete req.query.geometry;
        controller.processFeatureServer( req, res, err, data, callback);
      }
    };

    var params = req.params;
    dcmetro.find(req.params, req.query, send);
  };

  return controller;

}

module.exports = Controller;
