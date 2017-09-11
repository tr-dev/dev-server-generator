
'use strict';

const DigitalOcean = require('do-wrapper');
const RSAKeyGen    = require('rsa-keygen');
const FS           = require('fs');
const UUID         = require('node-uuid');
const FORGE        = require('node-forge')
const SSH_PATH     = `${process.env.HOME}/.ssh/digitalocean`

const DEFAULT_PUBLIC_KEY_PERMISSION  = 0o644;
const DEFAULT_PRIVATE_KEY_PERMISSION = 0o600;

module.exports = class DigitalOceanHelper extends DigitalOcean {

  constructor(DO_KEY, PAGE_SIZE, config) {
    super(DO_KEY, PAGE_SIZE);
    this.config = config;
  }
  
  generateKeys(key) {
    return new Promise((resolve, reject) => {
      let pair     =  RSAKeyGen.generate();
      let keyname  =  key || UUID.v4();
      let filename = `${SSH_PATH}/${ keyname }`;
      
      let pki         = FORGE.pki.publicKeyFromPem(pair.public_key.toString());
      let public_key  = FORGE.ssh.publicKeyToOpenSSH(pki);
      let private_key = pair.private_key.toString();

      Promise.all([
        this.writeLocalKey(filename, pair.private_key.toString(), { mode: DEFAULT_PRIVATE_KEY_PERMISSION }),
        this.writeLocalKey(`${filename}.pub`, pair.public_key.toString(), {  mode: DEFAULT_PUBLIC_KEY_PERMISSION })
      ])
      .then(() => {
        resolve({
          filename, keyname, public_key,private_key
        });
      }, (err) => {
        reject(`Error writing ${filename}: ${err}`)
      })
    });
  }
  
  writeLocalKey(filename, key, options){
    return new Promise((resolve, reject) => {
      FS.writeFile(filename, key, options, (err) => {
        return err ? reject(err) : resolve();
      })
    });
  }

  listLocalKeys() {
    return new Promise((resolve, reject) => {
      FS.readdir(SSH_PATH, (err, files) =>{
        if(err) {
          return reject(err);
        }
        resolve(files.filter((file) =>{
          return file.indexOf('.pub') === -1;
        }))
      })
    });
  }

  removeLocalKey(key) {
    return new Promise((resolve, reject) => {
      FS.unlink(`${SSH_PATH}/${key}.pub`, (err) => {
        if (err) {
          return reject(err);
        } 
        FS.unlink(`${SSH_PATH}/${key}`, (err) => {
          return err ? reject(err) : resolve();
        });
      });
    });
  }
}



