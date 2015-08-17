var fs   = require('fs');
var path = require('path');

module.exports = function load_environment_variables_from_env_json (filepath) {
  try { // first we determine how to find the env.json or config.env file
    var parent = module.parent.id, mod = parent.indexOf('node_modules');
    if(mod > -1){
      var parent_dir = parent.slice(0,mod)
      filepath = path.resolve(parent_dir + filepath);
    }
    var env_getter = filepath.indexOf('.env') !== -1 ? get_dot_env : require;
    var env = env_getter(filepath);
    var keys = Object.keys(env);
    keys.forEach(function(k) {
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
};

function get_dot_env (filepath) {
  return make_json_from_dot(fs.readFileSync(path.resolve(filepath), 'utf8'));
}

function make_json_from_dot (dot_env) {
  return dot_env.split('\n')
      .map(trim)
      .filter(function(line){ return line.length; })
      .filter(isNotComment)
      .reduce(add_dot_env_line_to_json, {});
}

function trim (string) {
  return string.trim();
}

function isNotComment (line) {
  return line[0] !== '#';
}

function add_dot_env_line_to_json (json, env_variable) {
  var environment_parts = env_variable.split('=');
  json[environment_parts[0]] = environment_parts[1];
  return json;
}

exports.version = require('../package.json').version;
