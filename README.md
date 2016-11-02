[![Version](https://img.shields.io/npm/v/codingame-connector.svg)](https://www.npmjs.com/package/codingame-connector)
[![License](https://img.shields.io/npm/l/codingame-connector.svg)](https://www.npmjs.com/package/codingame-connector)

[![Dependencies Status](https://img.shields.io/librariesio/github/woshilapin/codingame-connector.svg)](https://libraries.io/npm/codingame-connector)
[![Build Status](https://img.shields.io/travis/woshilapin/codingame-connector.svg)](https://travis-ci.org/woshilapin/codingame-connector)
[![Code Coverage](https://img.shields.io/codecov/c/github/woshilapin/codingame-connector.svg)](https://codecov.io/gh/woshilapin/codingame-connector)
[![Code Quality](https://img.shields.io/scrutinizer/g/woshilapin/codingame-connector.svg)](https://scrutinizer-ci.com/g/woshilapin/codingame-connector/)

# Presentation
`codingame-connector` will help you to develop solutions for Codingame exercises
on your local computer.  You don't need the browser to be open during your
development process (save your RAM!).

# Installation
First, you need NodeJS installed on your machine.  If you don't, you can take a
look to the [nvm](https://github.com/creationix/nvm) project which allow you to
install Node without root access.

## Global installation
You can simply install the `cg-watch` command with the following command.

```
npm install -g codingame-connector
```

Then you can use it from any folder with `cg-watch` (see for configuration
below).

## Local installation
To install `codingame-connector`, you can clone the project.  Then you'll have
to install the Node modules.

```
git clone https://github.com/woshilapin/codingame-connector.git
cd codingame-connector
npm install
```

Then you can launch it (see configuration below) with `npm start`.

# Configuration
It's pretty simple, you give to the program a configuration file (default to
`.codingamerc`) of the following form.

```
{
	"username": "my@email.me",
	"password": "myP4ssw0rd",
	"exercise": "5711567e959cf54dd2dd79c1b4c259560d6ba46",
	"tests": [1, 2, 3, 4, 5, 6],
	"language": "Python",
	"bundle": "bundle.py"
}
```

## Username and password
There is 3 different ways to give your username and password.

### In the configuration file
As simple as the following.

```
{
	"username": "my@email.me",
	"password": "myP4ssw0rd",
	...
}
```

### Through a command in the configuration file
You can also give a command in the configuration file, the output of this
command will be considered the username or password.  For example, imagine you
encrypted your `username` and `password` in GPG files `username.gpg` and
`password.gpg` with the following command.

```
gpg2 --encrypt username
gpg2 --encrypt password
```

Then you could use the following in your configuration file.

```
{
	"username": ["gpg2", "--decrypt", "username.gpg"],
	"password": ["gpg2", "--decrypt", "password.gpg"],
	...
}
```

Note that you might want to encrypt only the password.

```
{
	"username": "my@email.me",
	"password": ["gpg2", "--decrypt", "password.gpg"],
	...
}
```

### Neither of them
If you don't put anything in your configuration file, the software will ask for
it and keep them as long as the software is running.

## Exercise ID
To find the `exercise` hash, you'll have to open the webbrowser, browser to the
exercise you'll try to solve and open the IDE.  Then look into your URL, you'll
find the hash.

## Tests
`tests` are an array of all the test's number available in the IDE of Codingame
(not the validators!).

## Language
Is a value among all the available languages in Codingame.  Be careful of the
case as `Python` will work but `python` will not.

## Bundle
`bundle` is the path towards the file containing your code.

If you prefer to not put your `username` and `password` in a plain file on your
filesystem, don't put the fields, they will be asked when the program is
launched and kept in memory (not safe but at least safer).  The connection
towards the website is encrypted (HTTPS).

# How it works?
`codingame-connector` will continuously watch the file `bundle` for any change.
Each time the file is changed and saved, `codingame-connector` will launch the
tests on Codingame.  Note that it will stop to test on the first one that fail.
To get an idea, see this [asciinema](https://asciinema.org).

[![asciicast](https://asciinema.org/a/70b3j97ji6cljn3vgjzowbifa.png)](https://asciinema.org/a/70b3j97ji6cljn3vgjzowbifa)
