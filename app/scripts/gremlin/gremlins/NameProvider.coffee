goog.provide 'gremlin.gremlins.NameProvider'
goog.require 'gremlin.util.Helper'

class gremlin.gremlins.NameProvider
  DATA_NAME = 'data-gremlin-name'
  NAME_SEPARATOR  = ","
  CSS_CLASS_GREMLIN_BROKEN = 'gremlin-error'
  getNameString = (el) -> el.getAttribute(DATA_NAME)

  isNameString = (names) -> typeof names is 'string'

  @DATA_NAME_ATTR : DATA_NAME
  @isGremlin: (el) ->
    names = getNameString el
    isNameString names

  @getNames: (el) ->
    names = getNameString el
    if isNameString(names) and names.length > 0
      names = (name.trim() for name in names.split(NAME_SEPARATOR))
    else
      html = el.outerHTML ? ""
      gremlin.gremlins.NameProvider.flagBrokenElement el
      throw new Error "Couldn't process gremlin element, maybe the '#{DATA_NAME}' is missing or empty?\n" +
      html

    #names

  @flagBrokenElement: (el) ->
    gremlin.util.Helper.addClass el, CSS_CLASS_GREMLIN_BROKEN
    gremlin.gremlins.NameProvider.flagProcessedElement el

  @flagProcessedElement : (el) -> el.removeAttribute(DATA_NAME)
