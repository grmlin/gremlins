requirejsEnv      = require "../conf/requirejsEnv.coffee"
AbstractModule    = require "./AbstractModule.coffee"
helper            = require "../helper.coffee"


MODULES_PATH      = "#{requirejsEnv.GREMLINJS_PATH}gremlinjsModules/"
MODULE_INDEX_FILE = "/index"

loadModule = (mixin) ->
  class Module extends AbstractModule
  helper.mixin Module, mixin
  return Module 

module.exports = 
  create: (name, cb) ->
    switch name
      when "debug"
        src = "#{MODULES_PATH}debug#{MODULE_INDEX_FILE}"
        window.require [src], (moduleInstance) ->
          Module = loadModule moduleInstance
          cb.call null, new Module 
      else
        console.log "module #{name} unknown"