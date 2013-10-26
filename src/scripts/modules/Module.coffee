goog.provide 'modules.Module'

goog.require 'modules.ModuleCollection'

class modules.Module

  constructor: (name, module) ->
    return new modules.Module arguments... if this not instanceof modules.Module

    hasExtend = typeof module.extend is 'function'
    hasBind = typeof module.bind is 'function'

    throw new Error("Missing .extend method in your module #{name}") unless hasExtend
    throw new Error("Missing .bind method in your module #{name}") unless hasBind


    @name = name
    @extend = module.extend
    @bind = module.bind

    modules.ModuleCollection.registerModule @