0.7.0 / 2016-11-11
==================

  * feat: display stdout and stderr in log
    improve output display with 'stdout', 'stderr' and better coloring system
    closes [#37](https://github.com/woshilapin/codingame-connector/issues/37)
  * docs: change link for license badge
    link to the text of the license for the license badge in the README file

0.6.1 / 2016-11-09
==================

  * fix: modify .npmignore to include subfolders
    fix the .npmignore in order to get every file and folder of the package
    closes [#36](https://github.com/woshilapin/codingame-connector/issues/36)
  * chore: nullify version in package.json
    put version in package.json to a null version because of semantic-release
  * docs(changelog): update the changelog
    update changelog from the new published version

0.6.0 / 2016-11-09
==================

  * add support of loop-problem
  * chore: publish a npm version manually
    fix the semantic release because of a forced rewriting of the git history
  * docs(npm): add a NPM badge
    add a NPM badge showing version, dependencies, # of downloads, and # of stars
  * ci: fix the automatic semantic releasing
    configure semantic-release with the CLI tool to fix the automatic Travis release
    closes 34
  * fix(codingame): add support of loop-problem
    add parsing of frames from testing problem with an iterative loop
    closes [#31](https://github.com/woshilapin/codingame-connector/issues/31)

0.5.2 / 2016-11-09
==================

  * refactor(codingame): create modules for parsing requests
    create one module for each kind of test response from Codingame API
  * refactor(codingame): extract Codingame API in a folder
    extract code relative to Codingame in a folder for future other Codingame modules
  * docs(*): improve in-code readibility of the documentation
    add dash-notation for '@param' descriptions
  * chore(package): parse all file recursively with ESlint
    call ESlint with all files in 'src' and 'test' folders, even subfolders
  * docs(*): remove '@version' tags
    remove '@version' tags that end up out of sync because not updated automatically
  * chore(package): add a commit rule
    add a 'commit' rule in 'package.json' in order to use locally commitizen
  * chore(package): order scripts alias in package.json
    order all the alias 'scripts' command of package.json in alphanumerical order
  * chore(dev): Add semantic-release and commitizen
    Improve development pratices with:
    - 'semantic-release' that will release automatically based on the commits
    - 'commitizen' to assist in producing standardized commits
  * Update the changelog

0.5.1 / 2016-11-05
==================

  * Remove option '--version'
  * [#25](https://github.com/woshilapin/codingame-connector/issues/25) Remove the '--version' option
  * Remove changelog rule in prepublishing action
  * Update the Changelog

0.5.0 / 2016-11-04
==================

  * Improve testing and coverage of the program
  * Add comments about a rule bug in ESlint with 'babel-eslint'
  * Improve code style with ESlint
  * Fine check of all tests
  * Reactivate the 'check-coverage' option
  * Fix the use of 'mute' package in tests
  * Fix the testing of 'utils' module
  * Add testing for 'utils' module
  * Sandboxing the use of Sinonjs
  * Mute log to console in mocha tests
  * Add some tests for 'utils' module
  * Improve branching coverage of 'codingame-api' module
  * Improve the 'keep event-loop running'
  * Remove use of 'readline2' and use default 'readline' instead
  * Keep the event loop running for the program to not stop
  * Improve coverage for 'codingame-api' module
  * Reach 100% coverage on 'configure' module
  * Add coverage of questioning in 'configure' module
  * Reorganise npm script commands
  * Improve complexity in 'configure' module
  * Fix JSDoc configuration
  * Fix configure module
  * Improve coverage of configure module
  * New Attempt
  * Attempt to fix Codecov coverage
  * Remove fixes in Codecov configuration
  * Add a codecov.yml configuration file
  * Change names of testing files
  * Use nock to mock HTTP requests
  * Use mock-fs for 'fs' module mocking
  * Add changelog
  * Add badges
  * Simplify integration fo Codecov and Mocha
  * Update Travis configuration for Codecov
  * Introduce code coverage with Istanbul and nyc
  * Use Chai and Chai As Promised as assertion framework
  * Add Mocha framework in the project
  * Use Babel as the ESlint parser
  * Simplify the for-await loop call
  * Improve JSDoc for configure module
  * Use es2015 (es25015-node-auto for 'babel-node')
  * Merge pull request [#24](https://github.com/woshilapin/codingame-connector/issues/24) from chickentuna/fix-typo
    Fixed a tiny little typo in some text
  * Fixed a tiny little typo in some text

0.4.3 / 2016-10-29
==================

  * Update documentation
  * Update asciinema of the documentation

0.4.2 / 2016-10-29
==================

  * Workaround about babel/babel[#4783](https://github.com/woshilapin/codingame-connector/issues/4783)
  * [#22](https://github.com/woshilapin/codingame-connector/issues/22) Workaround using 'babel-node'

0.4.1 / 2016-10-28
==================

  * Fix the binary installation

0.4.0 / 2016-10-28
==================

  * Improve interface and display
  * Add colors and improve feedbacks
  * Syntax sugar thanks to generators and async/await
  * Force JSDoc to convert to ES5 (Node may understand some of ES6)
  * [#20](https://github.com/woshilapin/codingame-connector/issues/20) Fix a bug in the use of 'babel-node'
  * [#20](https://github.com/woshilapin/codingame-connector/issues/20) Fix a bug in the use of 'commander'
  * [#20](https://github.com/woshilapin/codingame-connector/issues/20) Change the name and rights of main binary
  * Add some documentation in main program
  * [#13](https://github.com/woshilapin/codingame-connector/issues/13) Use 'commander' to parse options and get help message
  * [#17](https://github.com/woshilapin/codingame-connector/issues/17) Add JSDoc configuration and documentation in code
  * [#16](https://github.com/woshilapin/codingame-connector/issues/16) Add ESlint
  * Use ES6 destructuring when possible
  * Replace 'var' with 'let'
  * Remove nesting 'new Promise' when possible
  * [#14](https://github.com/woshilapin/codingame-connector/issues/14) Remove use of 'fs.stat()'
  * Improve the test suite and extract it in 'util' module
  * Split into a 'utils' module
  * Use 'configure' module everywhere
  * Remove verbose mode

0.3.0 / 2016-10-26
==================

  * Change the default name of configuration file
  * Change name of default configuration file to '.codingamerc'
  * Remove bundle and .codingame.json from git
  * Create a configuration module

0.2.0 / 2016-10-25
==================

  * Possibility to use commands in configuration file for username/password
  * [#6](https://github.com/woshilapin/codingame-connector/issues/6) Log some message when bundle file doesn't exist
  * [#5](https://github.com/woshilapin/codingame-connector/issues/5) Resume when configuration file is not here
