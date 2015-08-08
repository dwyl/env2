module.exports = function load_environment_variables_from_env_json (filepath) {
  try {
      var env = require(filepath);
      var keys = Object.keys(env);
      keys.map(function(k) {
        if(!process.env[k]) { // allow enviroment to take precedence over env.json
          process.env[k] = env[k]; // only set if not set by environment
        }
      });
  }
  catch (e) {
    var msg = '\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n'
    msg    += e
    msg    += '\nYour app has invoked env2 to load a configuration file but \n'
    msg    += 'we could not find the configuration file: ' + filepath + '\n'
    msg    += 'please follow the instructions in the README to create your\n'
    msg    += 'env.json file and/or ensure that you give the correct path to it \n'
    msg    += '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n'
    console.log(msg);
    return msg;
  }
}
