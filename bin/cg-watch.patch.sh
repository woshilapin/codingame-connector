#!/usr/bin/env bash
# The bug on async iterator in Babel need a workaround.
# see https://github.com/babel/babel/issues/4783
#
# This script is a workaround.  This workaround is using 'babel-node' to launch the program instead of the result of a build by 'babel'.  Note that performance will be very bad.
#
# Note:
# 'package.json' has been modified accordingly.  When bug will be fixed, please revert modifications on 'package.json' and on the repository.
#
#####
# 1
##
# In 'package.json', the following 'devDependencies' has been moved to 'dependencies'
#    "babel-cli": "^6.16.0",
#    "babel-core": "^6.17.0",
#    "babel-preset-es2015": "^6.18.0",
#    "babel-preset-es2015-node-auto": "0.0.5",
#    "babel-preset-stage-3": "^6.17.0",
#
#####
# 2
##
# In the 'bin' section on 'package.json', the binary has been modified from
#    "cg-watch": "./bin/cg-watch.js"
# to
#    "cg-watch": "./bin/cg-watch.patch.sh"
#
#####
# 3
##
# The 'bin/cg-watch.patch.sh' has been created for the purpose of the workaround.  Once the bug will be fixed, it can be removed.
declare -r _SOURCE_PATH_=$( readlink -f "${0}" )
declare -r _SOURCE_DIR_=$( dirname "${_SOURCE_PATH_}" )
declare -r _ROOT_="${_SOURCE_DIR_}/.."
declare -r _BABEL_NODE_="${_ROOT_}/node_modules/babel-cli/bin/babel-node.js"
declare -r _JS_PATH_="${_ROOT_}/lib/watch.js"
"${_BABEL_NODE_}" --plugins "transform-runtime" --presets "es2015-node-auto,stage-3" -- "${_JS_PATH_}"
