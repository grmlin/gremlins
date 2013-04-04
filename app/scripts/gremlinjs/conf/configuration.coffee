helper         = require "../helper.coffee"
ModulesManager = require "../modules/ModulesManager.coffee"

PATH    = 'path'
WATCH   = 'watch'
MODULES = 'modules'

config = {}
config[PATH] = './'
config[WATCH] = no
config[MODULES] = []

module.exports =
  PATH    : PATH
  WATCH   : WATCH
  MODULES : MODULES

  set : (newConfig = {}) ->
    config = helper.extend config, newConfig
    ModulesManager.loadModules(config.modules)

  get : (key) ->
    config[key]

 
    