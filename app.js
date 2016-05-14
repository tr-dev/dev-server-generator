'use strict'

const DO_CLASS = require('./lib/do_class');

var item = new DO_CLASS();
item.account_data()
.then((data) => {
  return item.validate_data(data);
})
.then((status) =>{
  console.log(status);
})
.catch((err)=>{
  console.dir("ERROR!");
  console.dir(err);
})

