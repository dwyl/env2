var test    = require('tape');
var fs      = require('fs');
var path    = require('path');
var envfile = path.resolve(__dirname + '/../env.json');
var sample  = path.resolve(__dirname + '/../env.json_sample');
var tempenv = './tempenv.json';
var decache = require('decache');
var ENVCOPY = {};

test("TEMPORARILY RENAME env.json file to force the try/catch error in lib/env.js", function(t) {
  require('../lib/env');
  decache('../lib/env');
  try {
    if(require(envfile)) { // check if the file exists!
      var env = require(envfile);
      fs.renameSync(envfile, tempenv);
      decache(envfile);
    }
  }
  catch (e) {
    console.log(envfile + ' NOT exist!')
    // do nothing!. if it failed that's fine!
  }
  // make a copy of all the environment variables so we can restore them below
  var keys = Object.keys(process.env)
  keys.map(function(k) {
    ENVCOPY[k] = process.env[k];
    delete process.env[k];
  });

  decache('../lib/env');
  require('../lib/env'); // this should spit out an error message now!
  // console.log(" - - - - - > " +process.env.GITHUB_CLIENT_ID);
  t.ok(!process.env.GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID environment variable NOT SET!");
  decache('../lib/env');
  t.end();
});


test("CREATE the env.json file from env.json_sample if it does not exist", function(t) {
  setTimeout(function(){
    var fs      = require('fs');
    var path    = require('path');
    var envfile = path.resolve(__dirname + '/../env.json');
    try { // check the tempenv file was created from the previous test

      // console.log(fs.lstatSync(tempenv).birthtime);
      fs.renameSync(tempenv, envfile); // restore the env.json from tempenv.json
    }
    catch (e) { // else create it from the _sample file!
      fs.createReadStream(envfile+'_sample').pipe(fs.createWriteStream(envfile));
    }
    // require the ./lib/env.js and expect it to work!
    require('../lib/env');
    // restore environment variables from ENVCOPY for travis-ci ...
    var keys = Object.keys(ENVCOPY);
    keys.map(function(k){
      process.env[k] = ENVCOPY[k];
    });
    t.ok(process.env.GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID environment variable is set!");
    t.end();
  },100);
});
