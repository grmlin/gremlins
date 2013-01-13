GREMLINJS_PATH_APPENDIX = "gremlin.min"

module.exports =
  GREMLINJS_PATH : requirejs.s.contexts._.config.paths.gremlinjs.replace(GREMLINJS_PATH_APPENDIX, "")