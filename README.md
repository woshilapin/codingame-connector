# Presentation
`codingame-connector` will help you to develop solutions for Codingame exercises
on your local computer.  You don't need the browser to be open during your
development process (save your RAM!).

# Installation
First, you need NodeJS installed on your machine.  If you don't, you can take a
look to the [nvm](https://github.com/creationix/nvm) project which allow you to
install Node without root access.

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
`.codingame.json`) of the following form.

```
{
	"username": "my@email.me",
	"password": "myP4ssw0rd",
	"language": "Python",
	"exercise": "5711567e959cf54dd2dd79c1b4c259560d6ba46",
	"tests": [1, 2, 3, 4, 5, 6],
	"bundle": "bundle.py"
}
```

To find the `exercise` hash, you'll have to open the webbrowser, browser to the
exercise you'll try to solve and open the IDE.  Then look into your URL, you'll
find the hash.

`tests` are an array of all the test's number available in the IDE of Codingame
(not the validators!).

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

<script
	type="text/javascript"
	src="https://asciinema.org/a/7mr1ji4yqqs2xxt4an769nmn8.js"
	id="asciicast-7mr1ji4yqqs2xxt4an769nmn8" async>
</script>

