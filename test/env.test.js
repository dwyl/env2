var test    = require('tape');
var fs      = require('fs');
var path    = require('path');
var decache = require('decache');
var envfile = path.resolve(__dirname + '/../env.json');
// decache(envfile);
var sample  = path.resolve(__dirname + '/../env.json_sample');
// decache(sample);
var dotenv  = path.resolve(__dirname + '/../.env');
// decache(dotenv);
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
  decache('../lib/env');
  try {
    if(require(envfile)) { // check if the file exists!
      var env = require(envfile);
      fs.renameSync(envfile, tempenv);
      decache(envfile);
    }
  }
  catch (e) {
    console.log(envfile + ' NOT exist!');
    // do nothing!. if it failed that's fine!
  }
  Object.keys(process.env).map(function(k) {
    delete process.env[k]; // DELETE all environment variables
  });

  decache('../lib/env');
  var env = require('../lib/env')(envfile); // this should spit out an ERROR msg
  // console.log(" - - - - - > " +process.env.GITHUB_CLIENT_ID);
  t.ok(env.indexOf('no such file or directory')>-1, "Could not find env.json file");
  t.ok(!process.env.API_KEY, "API_KEY environment variable NOT SET!");
  decache('../lib/env');
  t.end();
});

test("Call env() without specifying an env.json file! (failure test)", function(t) {
  decache('../lib/env');
  require('../lib/env')();
  t.ok(!process.env.API_KEY, 'API_KEY is not set (as expected)');
  t.end();
});

test("Force error by refencing non-existent env.json file", function(t) {
  decache('../lib/env');
  require('../lib/env')('./env.json');
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
    // var keys = Object.keys(ENVCOPY);
    // keys.map(function(k){
    //   process.env[k] = ENVCOPY[k];
    // });
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
