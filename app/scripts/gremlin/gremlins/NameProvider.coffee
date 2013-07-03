goog.provide 'gremlin.gremlins.NameProvider'
goog.require 'gremlin.util.Helper'

class gremlin.gremlins.NameProvider
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
    try
      throw new Error "No gremlin names available, '#{DATA_NAME}' is empty!" if names is ""
      nameList = (name.trim() for name in names.split(NAME_SEPARATOR))
    catch e
      html = el.outerHTML ? ""
      gremlin.gremlins.NameProvider.flagBrokenElement el
      console?.warn? "Couldn't process gremlin element, #{e.message}\n" + html
      []

  @flagBrokenElement: (el) ->
    gremlin.util.Helper.addClass el, CSS_CLASS_GREMLIN_BROKEN
    gremlin.gremlins.NameProvider.flagProcessedElement el

  @flagProcessedElement : (el) ->
    names = el.getAttribute DATA_NAME
    el.removeAttribute DATA_NAME
    el.setAttribute DATA_NAME_PROCESSED, names
