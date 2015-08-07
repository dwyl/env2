var Env = require('..')
  , Path = require('path')
  , env_json = Path.resolve(__dirname + '/fixtures/env.json')
  , env = require('..')(env_json)
  , test = require('tape')

test('env core', function (t) {
  t.ok(Env.version)
  t.ok(env.ok)
  t.ok(env.get)
  t.ok(env.set)
  t.ok(env.del)

  t.equal(env.evars, require(env_json))

  t.end()
})

test('env ok', function (t) {
  env.set('DBUSER', 'user')
  env.set('DBPASSWORD', 'password')
  t.ok(env.ok())

  env.del()
  t.end()
})

test('env not ok', function (t) {
  t.plan(3)

  var envHandler = function (err) {
    t.ok(err)
    t.equal(err.message, 'DBUSER not defined')
  }

  t.ok(!env.ok(envHandler))

  t.end()
})

test('env set', function (t) {
  env.set('DBUSER', 'dshaw')
  var dbuser = env.get('DBUSER')
  t.equal(dbuser, 'dshaw');

  env.del()
  t.end()
})

test('env get multi', function (t) {
  env.set('DBUSER', 'user')
  env.set('DBPASSWORD', 'password')
  env.set('DBX', 'x')
  var dbconfig = env.get('DBUSER', 'DBPASSWORD', 'DBX')
  t.equal(dbconfig['DBUSER'], 'user');
  t.equal(dbconfig['DBPASSWORD'], 'password');
  t.equal(dbconfig['DBX'], 'x');

  env.del('DBX')
  env.del()
  t.end()
})

test('env get all', function (t) {
  env.set('DBUSER', 'user')
  env.set('DBPASSWORD', 'password')
  env.set('DBX', 'x')
  var dbconfig = env.get()
  t.equal(dbconfig['DBUSER'], 'user');
  t.equal(dbconfig['DBPASSWORD'], 'password');
  t.equal(dbconfig['DBX'], undefined);

  env.del('DBX')
  env.del()
  t.end()
})

test('env id', function (t) {
  env.set('ENV_ID', '1')
  var env2 = require('..')(env_json)
  t.equal(env2.id, '1')

  t.end()
})

test('env with no env.json', function (t) {
  var env3 = require('..')()
  t.ok(env3.evars)
  t.ok(typeof env3.evars  === 'object', 'env is an object');
  t.deepEqual(env3.evars, {})
  t.deepEqual(env3.get(), {})
  t.end()
})
