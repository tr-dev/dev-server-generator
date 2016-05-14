
'use strict';
const DigitalOcean = require('do-wrapper');

module.exports = class DO_CLASS {
  constructor(){
    this.DO_API = new DigitalOcean(process.env.DO_KEY, process.env.PAGE_SIZE || 2);
  }

  account_data (){
    var self = this;
    return new Promise(function(accept, reject) {
      self.DO_API.account((err, res, body)=>{
        if(err) {
          return reject(err);
        }
        return accept(body);
      });
    });
  }

  validate_data (data){
    return new Promise(function(accept, reject) {
      return data && data.account && data.account.status === "active" ? accept("We good") : reject(data.status);
    });
  }
}



