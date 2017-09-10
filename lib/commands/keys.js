'use strict';


const RS        = require('randomstring');


module.exports = (config, DOHelper) => {

  return function (args) {
    return new Promise((resolve, reject) => {
      switch(args.action) {
        case 'create':
          createKeys(DOHelper, resolve, reject);
          break;
        case 'list':
        case 'ls':
          listKeys(args.options, DOHelper, resolve, reject);
          break;
        case 'remove':
        case 'rm':
          removeKeys(args.key, args.options, DOHelper, resolve, reject);
          break;
        default:
          let err = `${args.action} is not a valid action`
          console.log(err);
          reject(err);
      }

    });
  }

};

function createKeys(DOHelper, resolve, reject) {
  DOHelper.generateKeys()
  .then((results) => {
    console.log(`Generated ${results.uuid} locally`)
    return DOHelper.accountAddKey({
      name: results.uuid,
      public_key: results.public_key
    });
  }, (err) =>{ 
    console.log(`Error generating keys: ${err}`)
    return reject(err);
  })
  .then((results) => {
    let key = results.body.ssh_key
    console.log(`Successfully created ${key.name} on remote`)
    resolve();
  }, (err) => {
    console.log(`Error creating keys on remove: ${err}`)
    return reject(err);
  })
}

function listKeys(options, DOHelper, resolve, reject){
  let tasks = [];

  if(options.local) {
    tasks.push(new Promise((resolve, reject) => {
      DOHelper.listLocalKeys()
      .then((keys) => {
        console.log("##################Local Keys##################");
        (keys || []).forEach((key) => {
          console.log(key)
        });
        console.log("##############################################");
        
        return resolve();
      }, (err) => {
        return reject(`Error getting local keys: ${err}`)
      });
    }));
  }

  if(options.remote) {
    tasks.push(new Promise((resolve, reject) => {
      DOHelper.accountGetKeys({
        per_page:30
      }).then((results) => {
        console.log("#################Remote Keys##################");
        (results.body && results.body.ssh_keys || []).forEach((key) => {
          console.log(key.name)
        });
        console.log("##############################################");
        resolve();
      }, (err) =>{
        console.log(`Error gettign remote keys : ${err}`)
        reject(err);
      })
    }));
  }

  Promise.all(tasks).then(resolve, reject);
}

function removeKeys(key, options, DOHelper, resolve, reject) {
  let tasks = [];

  if (options.local) {
    tasks.push(new Promise((resolve, reject) => {
      DOHelper.removeLocalKey(key)
      .then(() => {
        console.log(`Removed ${key} locally`)
        resolve();
      }, (err) => {
        console.log(`Error remove remote ${key}: ${err}`);
        reject(err);
      })
    }));
  }
  if (options.remote) {
    tasks.push(new Promise((resolve, reject) => {
      DOHelper.accountGetKeys({
        per_page:30
      }).then((results) => {
        let match = (results.body && results.body.ssh_keys || []).filter((k) => {
          return k.name === key
        });
        if(match && match.length) {
          DOHelper.accountDeleteKey(match[0].id)
          .then(() => {
            console.log(`Removed ${key} from remote`)
            resolve();
          }, (err) => {
            console.log(`Error while removing ${key}: ${err}`)   
            reject(err);
          })
        } else {
          let err = `Could not locate key ${key}`
          console.log(err);
          reject(err);
        }
      }, (err) => {
        console.log(`Error getting remote keys ${err}`);
        reject(err);
      })
    }));
  }

  Promise.all(tasks).then(resolve, reject);
}
