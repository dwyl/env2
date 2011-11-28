Env - In your environment managing your variables.
===

[![Build Status](https://secure.travis-ci.org/dshaw/env.png)](http://travis-ci.org/dshaw/env)

Managing environment variables can be a pain. Env helps make that better.

### Module status

Env is an evolving project based which came out of discussions with [@joemccann](http://twitter.com/joemccann) and [@clintandrewhall](http://twitter.com/clintandrewhall). I don't consider this package fully baked yet.

### Get Env.

```bash
npm install env
```

### Usage

Add an env.json file to your repo.

```json
{
  "DB_HOST": 1,
  "DB_PORT": 1,
  "DB_USER": 1,
  "DB_PASS": 1
}
```

```javascript
var env = require('env')()

env.ok(function(err) {
  if (!err) return
  console.error(err)
  process.exit(1)
})

// Yes, it's SYNC, so you can do this too!

function handleEnv (err) {
  if (!err) return
  process.exit(1)
}

if (env.ok(handleEnv)) {
  var port = env.get('SETUP_PORT')
  server.listen(port)
}
```

Env is sync like require, so it's tasks can be accomplished before app execution.

### Follow dshaw
- [twitter.com/dshaw](http://twitter.com/dshaw)
- [github.com/dshaw](http://github.com/dshaw)
