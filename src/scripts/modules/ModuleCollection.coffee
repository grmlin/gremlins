goog.provide 'modules.ModuleCollection'

class modules.ModuleCollection

  modules = {}

  getModules = (Gizmo) ->
    include = Gizmo.include
    type = typeof include
    switch type
      when 'string'
        console.log "includes: #{include}"
        includesList = [include]

      when 'object'
        console.log "includes: ", include
        includesList = include
      else
        console.log "nothing to include here..."
        includesList = []

  @registerModule: (module) ->
    modules[module.name] = module

  @extendGizmo: (Gizmo) ->
    modules = getModules Gizmo

  @bindGizmo: (gizmo) ->


