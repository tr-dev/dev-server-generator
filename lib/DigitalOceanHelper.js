
'use strict';

const DigitalOcean = require('do-wrapper');
const RSAKeyGen    = require('rsa-keygen');
const FS           = require('fs');
const UUID         = require('node-uuid');
const FORGE        = require('node-forge')

module.exports = class DigitalOceanHelper extends DigitalOcean {

  constructor(DO_KEY, PAGE_SIZE){
    super(DO_KEY, PAGE_SIZE);
  }
  
  generateKeys() {
    return new Promise((resolve, reject) => {
      let pair =  RSAKeyGen.generate();
      let uuid =  UUID.v4()
      let filename = `/home/tr/.ssh/${ uuid }`;
      
      let pki         = FORGE.pki.publicKeyFromPem(pair.public_key.toString());
      let public_key  = FORGE.ssh.publicKeyToOpenSSH(pki);
      let private_key = pair.private_key.toString();

      Promise.all([
        this.writeKey(filename, pair.private_key.toString()),
        this.writeKey(`${filename}.pub`, pair.public_key.toString())
      ])
      .then(() => {
        resolve({
          filename, uuid, public_key,private_key
        });
      }, (err) => {
        reject(`Error writing ${filename}: ${err}`)
      })
    });
  }
  writeKey(filename, key){
    return new Promise((resolve, reject) => {
      FS.writeFile(filename, key, (err) => {
        return err ? reject(err) : resolve();
      })
    });
  }
  
}



