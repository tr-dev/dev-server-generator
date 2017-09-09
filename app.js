'use strict'

const DigitalOceanHelper = require('./lib/DigitalOceanHelper');
const DO_KEY    = process.env.DO_KEY;
const PAGE_SIZE = process.env.PAGE_SIZE || 2;
const DOHelper = new DigitalOceanHelper(DO_KEY, PAGE_SIZE);


DOHelper.generateKeys()
.then((results) => {
  
  return DOHelper.accountAddKey({
    name: results.uuid,
    public_key: results.public_key
  })
}, (err) =>{ 
  console.log(`Error generating keys: ${err}`)

})
.then((results)=>{
  console.log(results.body);
}, (err) => {
  console.log(err)
})