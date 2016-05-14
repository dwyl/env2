var test    = require('tape');
var fs      = require('fs');
var path    = require('path');
var decache = require('decache'); //
var envfile = path.resolve(__dirname + '/fixtures/env.json');
// console.log(envfile);
// console.log(' - - - - - - - - - - - ');
// return;
var sample  = path.resolve(__dirname + '/fixtures/env.json_sample');
var dotenv  = path.resolve(__dirname + '/fixtures/.env');
var newenv  = path.resolve(__dirname + '/../new.env');
var tempenv = './tempenv.json';
var ENVCOPY = {};

test("Load env.json and confirm process.env.API_KEY is set", function(t) {
  require('../lib/env')(envfile);
  t.ok(process.env.API_KEY === "secret", 'API_KEY loaded from env.json successfully!');
  t.end();
});

test("TEMPORARILY RENAME env.json file to force the try/catch error in lib/env.js", function(t) {
  require('../lib/env')(envfile);
  try {
    if(require(envfile)) { // check if the file exists!
      var env = require(envfile);
      fs.renameSync(envfile, tempenv);
    }
  }
  catch (e) {
    console.log(envfile + ' NOT exist!');
    // do nothing!. if it failed that's fine!
  }
  Object.keys(process.env).map(function(k) {
    delete process.env[k]; // DELETE all environment variables
  });

  decache('../lib/env'); // need to clear require cache!
  var env = require('../lib/env')(envfile); // this should spit out an ERROR msg
  t.ok(env.indexOf('NOT FOUND!')>-1, "Could not find env.json file");
  t.ok(!process.env.API_KEY, "API_KEY environment variable NOT SET!");
  t.end();
});

test("Call env() without specifying an env.json file! (failure test)", function(t) {
  require('../lib/env')();
  t.ok(!process.env.API_KEY, 'API_KEY is not set (as expected)');
  // delete all environment variables before next test:
  Object.keys(process.env).forEach(function(key){
    delete process.env[key];
  });
  t.end();
});

test("Force error by refencing non-existent env.json file", function(t) {
  require('../lib/env')('./node_modules/env.json');
  t.ok(!process.env.API_KEY, 'API_KEY is not set (as expected)');
  t.end();
});

test("reCREATE the env.json file from env.json_sample if it does not exist", function(t) {
  setTimeout(function(){
    try { // check the tempenv file was created from the previous test
      fs.renameSync(tempenv, envfile); // restore the env.json from tempenv.json
    }
    catch (e) { // else create it from the _sample file!
      fs.createReadStream(envfile+'_sample').pipe(fs.createWriteStream(envfile));
    }
    require('../lib/env')(envfile);
    t.ok(process.env.API_KEY, "API_KEY environment variable is set!");
    t.end();
  },100);
});

test("Load env.json and confirm process.env.API_KEY is set", function(t) {
  require('../lib/env')(envfile);
  t.ok(process.env.API_KEY === "secret", 'API_KEY loaded from env.json successfully!');
  t.end();
});

test("Passing a .env file ", function (t) {
  require('../lib/env')(dotenv);
  t.ok(process.env.DOT_KEY === 'dots_rule', 'we were able to load in a .env!');
  t.end();
});

test("A .env file with equals in the variable value works", function (t) {
  require('../lib/env')(dotenv);
  t.equal(process.env.KEY_WITH_EQUALS, 'http://foo.bar/?baz=quux', 'values with "=" work!');
  t.end();
});

test("An .env file with spaces in the definition should work", function (t) {
  var new_env = fs.createWriteStream(newenv);
  var env_contents = "A_KEY = thing";
  new_env.end(env_contents, function () {
    require('../lib/env')(newenv);
    t.ok(process.env.A_KEY, 'thing');
    fs.unlink(newenv);
    t.end();
  })
})

test("A .env file with comments exports the correct variables and ignores comments", function (t) {
  var new_env = fs.createWriteStream(newenv);
  var env_contents = "COMMENT_KEY=Available \n" +
      "\n" +
      "#COMMENTED_OUT=IGNORED \n" +
      "NEXT_KEY=fine";
  new_env.end(env_contents, function(){
    require('../lib/env')(newenv);
    t.ok(process.env.COMMENT_KEY === 'Available', 'first key without comment loaded in');
    t.ok(!process.env.COMMENTED_OUT, 'commented out comment is not exported');
    t.ok(process.env.NEXT_KEY === 'fine', 'key after comment is still exported');
    fs.unlink(newenv);
    t.end();
  });
});

test('node_modules test with config.env supplied as argument', function(t){
  require('./node_modules/callee.test.js'); // executes file inside "fake" node_modules
  t.end();
})

test('node_modules test WITHOUT a filename argument', function(t){
  require('./node_modules/callee_noarg.test.js'); // executes file inside "fake" node_modules
  t.end();
})

var config  = path.resolve(__dirname + '/../config.env');
require('../lib/env.js')(config); // local

// this ensures that the node_modules condition in lib/env.js is met
test("Confirm that EVERYTHING=AWESOME", function(t) {
  t.ok(process.env.EVERYTHING === 'AWESOME',
  'Worked! Everything is: '+process.env.EVERYTHING)
  t.ok(process.env.BUILD === 'SPACESHIP',
  'What do we want to build? ...> '+process.env.BUILD + ' !!! :-)');
  t.end();
});
