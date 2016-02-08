var pkg = require('./package.json')
var provider = require('koop-provider')

var dcmetro = provider({
  name: 'dcmetro',
  version: pkg.version,
  model: require('./model'),
  controller: require('./controller'),
  routes: require('./routes'),
  type: 'provider'
})

module.exports = dcmetro
