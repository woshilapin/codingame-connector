0.5.0 / 2016-11-04
==================

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
  * [#1](https://github.com/woshilapin/codingame-connector/issues/1), [#7](https://github.com/woshilapin/codingame-connector/issues/7) Implement commands in configuration files (username/password)
  * [#9](https://github.com/woshilapin/codingame-connector/issues/9) Put a simple 'travis.yml' file

0.1.1 / 2016-10-22
==================

  * Fix binary name and update documentation
  * Fix the binary name and update documentation

0.1.0 / 2016-10-22
==================

  * 0.1.0
  * Fix the binary for npm publishing

0.0.1 / 2016-10-22
==================

  * Add link to 'asciinema' demo
  * Initial upload
