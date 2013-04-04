Factory = require "./ModulesFactory.coffee"

activatedModules = {}
ModulesManager   =
  loadModules : (names) ->
    for moduleName in names
      if activatedModules[moduleName] is undefined
        activatedModules[moduleName] = yes
        Factory.create moduleName, (module) ->
          module.initialize()
        
        
        

module.exports = ModulesManager