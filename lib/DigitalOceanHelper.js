
'use strict';
const DigitalOcean = require('do-wrapper');

module.exports = class DigitalOceanHelper extends DigitalOcean {
  constructor(){
    super(process.env.DO_KEY, process.env.PAGE_SIZE || 2);
  }
}



