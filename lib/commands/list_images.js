'use strict';

const DigitalOceanHelper = require('../DigitalOceanHelper');
const DO_KEY    = process.env.DO_KEY;
const PAGE_SIZE = process.env.PAGE_SIZE || 2;
const DOHelper  = new DigitalOceanHelper(DO_KEY, PAGE_SIZE);
const RS        = require('randomstring');


module.exports = (config) => {
    return function(args) {
      return new Promise((resolve, reject) => {
        DOHelper.imagesGetAll({
          includeAll: true
        })
        .then((results) => {
          console.dir(results.body)
          resolve()
        }, (err) => {
          return reject(err);
        })
      })
    }
};
