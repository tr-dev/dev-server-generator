'use strict'

const DigitalOceanHelper = require('./lib/do_class');
var item = new DigitalOceanHelper();

item.accountGetActions({},function(err,response, body){
  console.log(body)
});

