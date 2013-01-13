helper         = require "../helper.coffee"
ModulesManager = require "../modules/ModulesManager.coffee"

config =
  modules : []
  watch   : no

module.exports =
  set : (newConfig = {}) ->
    config = helper.extend config, newConfig
    ModulesManager.loadModules(config.modules)
    
  get : () ->
    config
    