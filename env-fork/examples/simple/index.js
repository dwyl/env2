var http = require('http')
  , env = require('../..')()

function handleEnv (err) {
  if (!err) return
  process.exit(1)
}

if (env.ok(handleEnv)) {
  var port = env.get('SERVER_PORT')
  var server = http.createServer(function (req, res) {
    res.end('Thanks, Env\n');
  }).listen(port)

  server.on('listening', function () {
    console.log('Node server listening on :%d', port)
  })
}
