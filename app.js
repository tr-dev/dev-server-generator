'use strict'

const DigitalOceanHelper = require('./lib/do_class');
var item = new DigitalOceanHelper();

item.create()
item.accountGetActions({},function(err,response, body){
  console.log(body)
});
// .then((status) =>{
//   console.log(status);
// })


