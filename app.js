'use strict'

const DigitalOceanHelper = require('./lib/DigitalOceanHelper');
const DO_KEY    = process.env.DO_KEY;
const PAGE_SIZE = process.env.PAGE_SIZE || 2;
const DOHelper  = new DigitalOceanHelper(DO_KEY, PAGE_SIZE);
const RS        = require('randomstring');
const config    = require('./config.json');

((DOHelper) => {
  
  DOHelper.generateKeys()
  .then((results) => {
    return DOHelper.accountAddKey({
      name: results.uuid,
      public_key: results.public_key
    });
  }, (err) =>{ 
    console.log(`Error generating keys: ${err}`)
  })
  .then((results)=>{
    /* Results
    {
      ssh_key: {
        id, fingerprint, public_key, name
      }
    }
    */

    let dropletConfig = Object.assign({}, config.droplets, {
      name: RS.generate(),
      ssh_keys: [
       results.body.ssh_key.id
      ]
    })
    return DOHelper.dropletsCreate(dropletConfig)
    
  }, (err) => {
    console.log(err)
  })
  .then((results) => {
    console.log(results.body)
  }, (err) => {
    console.log(err);
  })
})(DOHelper);

// DOHelper.imagesGetAll({
//   includeAll: true
// })
// .then((results) => {
//   console.dir(results.body)
// })