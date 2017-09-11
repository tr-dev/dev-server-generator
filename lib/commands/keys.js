'use strict';

module.exports = (config, DOHelper) => {
  return function (args) {
    return new Promise((resolve, reject) => {
      switch(args.action) {
        case 'create':
          createKey(args.key, DOHelper).then(resolve, reject);
          break;
        case 'list':
        case 'ls':
          listKeys(args.options, DOHelper).then(resolve, reject);
          break;
        case 'remove':
        case 'rm':
          removeKey(args.key, args.options, DOHelper).then(resolve, reject);
          break;
        default:
          let err = `${args.action} is not a valid action`
          console.log(err);
          return reject(err);
      }
    });
  }
}

function createKey(key, DOHelper) {
  return new Promise((resolve, reject) => {
    DOHelper.generateKeys(key)
    .then((results) => {
      console.log(`Generated ${results.keyname} locally`)
      return DOHelper.accountAddKey({
        name: results.keyname,
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
  });
}

function listKeys(options, DOHelper){
  return new Promise((resolve, reject) => {
    let tasks = [];
    if(options.local) {
      tasks.push(new Promise((resolve, reject) => {
        DOHelper.listLocalKeys()
        .then((keys) => {
          return resolve({
            type: "local", keys
          });
        }, (err) => {
          return reject(`Error getting local keys: ${err}`)
        });
      }));
    }
  
    if(options.remote) {
      tasks.push(new Promise((resolve, reject) => {
        DOHelper.accountGetKeys({}).then((results) => {
          resolve({
            type: "remote",
            keys: (results.body && results.body.ssh_keys || []).map(k => k.name)
          });
        }, (err) =>{
          console.log(`Error getting remote keys : ${err.message}`)
          reject(err);
        })
      }));
    }
    Promise.all(tasks).then((results) => {
      results.forEach((result) => {
        console.log(`####################${result.type}####################`);
        result.keys.forEach(key => console.log(key));
        console.log('');
      })
      resolve();
    }, reject);
  });
}

function removeKey(key, options, DOHelper, resolve, reject) {
  return new Promise((resolve, reject) => {
    let tasks = [];
  
    if (options.local) {
      tasks.push(new Promise((resolve, reject) => {
        DOHelper.removeLocalKey(key)
        .then(() => {
          console.log(`Removed ${key} locally`)
          resolve();
        }, (err) => {
          console.log(`Error removing local ${key}: ${err}`);
          reject(err);
        })
      }));
    }

    if (options.remote) {
      tasks.push(new Promise((resolve, reject) => {
        DOHelper.accountGetKeys({}).then((results) => {
          let match = (results.body && results.body.ssh_keys || []).filter(k => k.name === key);
          if(match && match.length) {
            DOHelper.accountDeleteKey(match[0].id)
            .then(() => {
              console.log(`Removed ${key} from remote`)
              resolve();
            }, (err) => {
              console.log(`Error while removing remote ${key}: ${err.message}`)   
              reject(err);
            })
          } else {
            let err = `Could not locate key ${key}`
            console.log(err);
            reject(err);
          }
        }, (err) => {
          console.log(`Error getting remote keys ${err.remote}`);
          reject(err);
        });
      }));
    }

    Promise.all(tasks).then(resolve, reject);

  });
  
}
