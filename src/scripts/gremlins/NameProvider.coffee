goog.provide 'gremlins.NameProvider'
goog.require 'util.Helper'

class gremlins.NameProvider
  DATA_NAME = 'data-gremlin'
  DATA_NAME_PROCESSED = 'data-gremlin-found'
  DATA_NAME_SEARCHING = 'data-gremlin-pending'
  NAME_SEPARATOR  = ","
  CSS_CLASS_GREMLIN_BROKEN = 'gremlin-error'

  hasAttribute = (el, name) ->
    if typeof el.hasAttribute is 'function'
      el.hasAttribute name
    else
      node = el.getAttributeNode name
      !!(node && (node.specified || node.nodeValue))

  isNameString = (names) -> typeof names is 'string'

  @DATA_NAME_ATTR : DATA_NAME
  @isGremlin: (el) ->
    hasAttribute el, DATA_NAME

  @getNames: (el) ->
    names = el.getAttribute(DATA_NAME)
    if names is ""
      html = el.outerHTML ? ""
      gremlins.NameProvider.flagBrokenElement el
      gremlin.debug.console.log "Couldn't process gremlin element, no gremlin names available, '#{DATA_NAME}' is empty!\n" + html
      []
    else
      nameList = (name.trim() for name in names.split(NAME_SEPARATOR))

  @flagBrokenElement: (el) ->
    util.Helper.addClass el, CSS_CLASS_GREMLIN_BROKEN
    gremlins.NameProvider.flagProcessedElement el
    gremlin.debug.reportBrokenGremlin el

  @flagProcessedElement : (el) ->
    names = el.getAttribute DATA_NAME
    el.removeAttribute DATA_NAME
    el.setAttribute DATA_NAME_PROCESSED, names
