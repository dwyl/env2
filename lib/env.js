var fs      = require('fs');
var path    = require('path');
var defaultenv = path.resolve(__dirname + '/../env.json');
try {
  // if(fs.lstatSync(envfile)) { // only attempt to load the file if it exists!
    var env = require('../env.json');
    var keys = Object.keys(env);
    keys.map(function(k) {
      /* istanbul ignore else */
      if(!process.env[k]) { // allow enviroment to take precedence over env.json
        process.env[k] = env[k]; // only set if not set by environment
      }
    }); // for a better way of doing this see: https://github.com/dshaw/env/pull/8
  // }
}
catch (e) {
  var msg = '\n\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n'
  msg    += 'If you are running this app on your local machine \n'
  msg    += 'please follow the instructions in the README to create \n'
  msg    += 'your env.json file with the GitHub Authentication Credentials \n'
  msg    += 'aksk @iteles for access to the Google Doc where these are kept \n'
  msg    += 'on Heroku set these up as environment variables (see README) \n'
  msg    += '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n'
  console.log(msg);
}
