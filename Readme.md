env2 - environment variable loader
===

[![Build Status](https://travis-ci.org/dwyl/env2.svg)](https://travis-ci.org/dwyl/env2)
[![Test Coverage](https://codeclimate.com/github/dwyl/env2/badges/coverage.svg)](https://codeclimate.com/github/dwyl/env2/coverage)
[![Code Climate](https://codeclimate.com/github/dwyl/env2/badges/gpa.svg)](https://codeclimate.com/github/dwyl/env2)
[![Dependency Status](https://david-dm.org/dwyl/env2.svg)](https://david-dm.org/dwyl/env2)
[![devDependency Status](https://david-dm.org/dwyl/env2/dev-status.svg)](https://david-dm.org/dwyl/env2#info=devDependencies)
[![npm](https://img.shields.io/npm/v/env2.svg)](https://www.npmjs.com/package/env2)

## Why?

**Environment variables** are the best way of storing sensitive data
like API Keys, Login Credentials and Database Passwords.

> If you are *new* to ***environment variables***
please checkout our ***introduction for complete beginners***:
https://github.com/dwyl/learn-environment-variables

We needed a simple/reliable way of managing **environment variables**;
and being able to share a configuration file among the team
(_without committing it to GitHub_!) **env2** is our *solution*.

## What?

**env2** allows you to store your environment variables in an `env.json` or a
`.env` file which gets loaded when your app starts.

All the entries in the `env` file are exported as environment variables
available as keys in the `process.env` object.

Works fine with build systems
+like [webpack][webpack] and [browserify][browserify].  
+If you want to use it on the frontend,
+you will need some sort of [filesystem shim][brfs]
+
+[webpack]: https://webpack.github.io/
+[browserify]: http://browserify.org/
+[brfs]: https://github.com/substack/brfs

## How?

> Need help getting started? [![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Create a `.env` File

We use (*and recommend*) `.env` files for environment configuration.  
We call our file `.env` for *cross-project consistency*.  
(*but you can call your file what ever you like e.g*: `.env`)  

A `.env` file is a very explicit way of listing environment variables
without the extra syntax (_potential human/input error_) of a JSON file.
It also allows for easier copy-pasting into the terminal
(with an `export` keyword prepended to each line).

The format of a `.env` file is:

```sh
export DB_HOST=127.0.0.1
export DB_PORT=9200
export DB_USER=anon
export DB_PASS=password
```

> Note the **lack of _spaces_**. You may leave blank lines and insert comments
(starting with '#') to organise the file if you wish. Follow the **instructions
below** for placing it in your `.gitignore` file.

### *Alternatively* Create an `env.json` Configuration File

If you *prefer* to use `.json` instead of `.env` create a `config.json` file in your repo with the following format:

```js
{
  "DB_HOST": "127.0.0.1",
  "DB_PORT": 9200,
  "DB_USER": "anon",
  "DB_PASS": "password"
}
```

### *Always* `.gitignore` your configuration file

***Always*** create your `.env` or `env.json` file
in the ***root directory*** of your project and _don't forget_ to add it to your `.gitignore`to
avoid _accidentally_ committing your keys/passwords to GitHub where bad people can (*will*) steal your secrets!

e.g:
```sh
echo '.env' >> .gitignore
```
***or***
```sh
echo 'env.json' >> .gitignore
```


### Install from NPM

Next **install** `env2` from npm and save it to your `package.json` file:

```sh
npm install env2 --save
```

### Use in your Code

Then in your script/module:

```js
const env = require('env2')('./path-to-your/.env');

// your app goes here
console.log(process.env.DB_HOST); // "127.0.0.1"
```

now all the entries in your `env.json` or `.env` file are available as
keys/values of the `process.env` Object which means you can use
`process.env.API_KEY` or `process.env.DB_PASSWORD` in your script.
(*or what ever you have defined as entries in your* `env.json`)


Env is synchronous; it loads all your configuration variables into the
`process.env` object *before* app/script execution.

<br />

## Do you want to Define Priority for Variables?

Do you want the ability to *specify* the priority which
environment variables take precendence?  
e.g: if you supply a command-line argument when running your script/app:
```sh
env=PROD API_KEY=token.dwyl.yolo node myapp.js
```
We have an *open discussion* on this: https://github.com/dwyl/env2/issues/1

At present, any environment variable defined in the environment where
your app is running (or via command-line arguments) will take
precendence over the same key in your `env.json` file ... if you prefer
to have the option to *specify* the priority, please add a comment to the isssue:
https://github.com/dwyl/env2/issues/1


<br />
## Huh?

[The Twelve Factor App](http://12factor.net/config) section 3 states:

> "**Store config in the environment**"

"*An app’s config is everything that is likely to vary between deploys
(staging, production, developer environments, etc)*".

<br />

## Name ?
<small>
**Q**: Why is it called "env2"?  
**A**: as the digit in the name suggests, there was/is an "env" (version 1):
https://www.npmjs.com/package/env written by [@dshaw](https://github.com/dshaw)
sadly, it was never finished and has not been updated in 4 years ...
We asked Dan if he would accept a Pull Request updating the package:
https://github.com/dshaw/env/issues/6 and he said he *would* accept it ...
But after investing the time and submitting the pull request:
https://github.com/dshaw/env/pull/8 which updated the package to the latest
version of Node/io.js and had tests with 100% coverage, the PR got ignored.
see: https://twitter.com/dshaw/status/628237150253772801
Not that we're "_impatient_" but we need to move on with our code/lives.
That's why we wrote **env2**.

We have since added better error handling and alternative file types,
so **env2** is can be considered the "***New & Improved Version***"
</small>
