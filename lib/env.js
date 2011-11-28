/*!
 * env
 * Copyright(c) 2011 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var path = require('path')

/**
 * Exports
 */

exports = module.exports = createEnv;

/**
 * Env Manager
 */

function Env (envfile) {
  this.envfile = path.join(process.cwd(), envfile || 'env.json')
  this.evars = (path.existsSync(this.envfile)) ? require(this.envfile) : {}
  this.id = process.env['ENV_ID']
}

/**
 * Verify environment variables
 *
 * @param fn callback
 * @api public
 */

Env.prototype.ok = function (fn) {
  for (var p in this.evars) {
    if (!process.env[p]) {
      var error = new Error(p + ' not defined')
      console.error(error)
      fn(error)
      return false
    }
  }
  return true
}

/**
 * Environment variable getter
 *
 * @param name
 * @api public
 */

Env.prototype.get = function (name) {
  // get one
  if (arguments.length === 1) return process.env[name]

  // get all, multi
  var evars = (arguments.length === 0) ? Object.keys(this.evars) : Array.prototype.slice.call(arguments)
  return evars.reduce(function (curr, x) {
    curr[x] = process.env[x]
    return curr
  }, {})
}

/**
 * Environment variable setter
 *
 * @param name
 * @param value
 * @api public
 */

Env.prototype.set = function (name, value) {
  process.env[name] = value
}

/**
 * Delete environment variable(s)
 *
 * @param name
 * @api public
 */

Env.prototype.del = function (name) {
  // get one
  if (arguments.length === 1) {
    delete process.env[name]
  }

  // get all, multi
  var evars = (arguments.length === 0) ? this.evars : Array.prototype.slice.call(arguments)
  for (var p in evars) {
    delete process.env[p]
  }
}

/**
 * Instantiate Env
 */

function createEnv (envfile) {
  return new Env(envfile)
}