const should = require('should');
const expect = require("chai").expect;

var DO_OBJ = require("../lib/do_class");
var do_obj = new DO_OBJ();

describe('Check Account call', function(){
  it('checks account status is good', (done)=>{
    do_obj.account_data()
    .then((data)=>{
      expect(data.account.status).to.equal('active');
      done();
    })
    .catch((err)=>{
      done(err);
    })
  });
})