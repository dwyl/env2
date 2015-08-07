// var fs         = require('fs'); // s
var path       = require('path'); // used to resolve default path
var defaultenv = path.resolve(__dirname + '/../env.json');


module.exports = function load_environment_variables_from_env_json (filepath) {
  var filename = filepath || defaultenv;
  try {
    if(fs.lstatSync(envfile)) { // only attempt to load the file if it exists!
      var env = require(filepath);
      var keys = Object.keys(env);
      keys.map(function(k) {
        /* istanbul ignore else */
        if(!process.env[k]) { // allow enviroment to take precedence over env.json
          process.env[k] = env[k]; // only set if not set by environment
        }
      });
    }
  }
  catch (e) {
    var msg = '\n\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n'
    msg    += 'Your app has invoked env2 to load a configuration file but \n'
    msg    += 'we could not find the configuration file: ' + filepath + '\n'
    msg    += 'please follow the instructions in the README to create your\n'
    msg    += 'env.json file and/or ensure that you give the correct path to it \n'
    msg    += '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n'
    console.log(msg);
  }
}
