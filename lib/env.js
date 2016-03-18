var fs   = require('fs');
var path = require('path');

/**
 * load_environment_variables_from_file does exactly what its name suggests
 * attempts to load a file containing a list of enviroment variables
 * @param {String} filepath - the path to your env.json or .env file
 * try/catch has a nice stack trace if we fail to find/load your the file
 */
module.exports = function load_environment_variables_from_file (filepath) {
  try { // first we determine how to find the env.json or config.env file
    var module_callee    = module.parent.id;
    var called_by_module = module_callee.indexOf('node_modules');
    var parent_directory = module_callee.slice(0,called_by_module);
    if(filepath) { // if required without a config.env file we search for one!
      if(called_by_module > -1){
        filepath = path.resolve(parent_directory + filepath);
      }
      else {
        filepath = path.resolve(filepath);
      }
    }
    else { // https://github.com/dwyl/env2/issues/6
      var dir = fs.readdirSync(parent_directory); // list of files in dir
      dir.forEach(function(file) {  // search for a .env file in dir
        if(file.indexOf('.env') > -1) { // found a .env file? use it!
          filepath = parent_directory + file;
        }
      })
    }
    var env_getter = filepath.indexOf('.env') !== -1 ? get_dot_env : require;
    var env = env_getter(filepath);
    Object.keys(env).forEach(function(k) {
      if(!process.env[k]) { // allow enviroment to take precedence over env.json
        process.env[k] = env[k]; // only set if not set by environment
      }
    });
  }
  catch (error) {
    // we're defining our own styles to avoid dependencies.
    // if you are curious how this works see: https://github.com/chalk/ansi-styles
    var cyanBg   = '\u001b[46m' + '\u001b[30m'; // Background Cyan Font Black
    var greenBg  = '\u001b[42m' + '\u001b[30m'; // Background Green Font Black
    var endStyle = '\u001b[49m' + '\u001b[39m' + '\u001b[22m'; // reset terminal

    var msg = cyanBg +'\n ' + error + greenBg +'\n '
    msg    += 'env2 was required to load a config file '
    msg    += 'but the file was not found. '
    msg    += 'Please see: http://git.io/vG3UZ'+ endStyle

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
  var environment_parts = env_variable.replace('export','').split('=');
  json[environment_parts[0].trim()] = environment_parts.slice(1).join('=').trim();
  return json;
}

exports.version = require('../package.json').version;
