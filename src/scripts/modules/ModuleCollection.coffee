goog.provide 'modules.ModuleCollection'

class modules.ModuleCollection

  modulesRegistry = {}
  moduleGizmoMap = {}

  getModules = (name, Gizmo) ->
    unless moduleGizmoMap[name]
      include = Gizmo.include
      type = typeof include

      switch type
        when 'string'
          includesList = [include]

        when 'object'
          includesList = if Array.isArray(include) then include else []
        else
          includesList = []

      moduleGizmoMap[name] = (modulesRegistry[moduleName] ? throw new Error("The module #{moduleName} does not exists!") for moduleName in includesList)

    return moduleGizmoMap[name]

  @registerModule: (module) ->
    modulesRegistry[module.name] = module

  @extendGizmo: (name, Gizmo) ->
    modules = getModules name, Gizmo
    module.extend Gizmo for module in modules

  @bindGizmo: (name, gizmo) ->
    modules = getModules name, gizmo.klass
    module.bind gizmo for module in modules


