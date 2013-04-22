goog.provide 'gremlin.util.Helper'

class gremlin.util.Helper
  mixin = (target, mixinObject) ->
    target[name] = val for own name, val of mixinObject
    target
    
  @mixin : (targetClass, mixinObject) ->
    mixin targetClass::, mixinObject

  @clone = (obj) ->
    if not obj? or typeof obj isnt 'object'
      return obj

    if obj instanceof Date
      return new Date(obj.getTime())

    if obj instanceof RegExp
      flags = ''
      flags += 'g' if obj.global?
      flags += 'i' if obj.ignoreCase?
      flags += 'm' if obj.multiline?
      flags += 'y' if obj.sticky?
      return new RegExp(obj.source, flags)

    newInstance = new obj.constructor()

    for key of obj
      newInstance[key] = gremlin.util.Helper.clone obj[key]

    return newInstance

  @hasClass : (element, className) ->
    element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    
  @addClass : (element, className) ->
    element.className += " " + className if (!gremlin.util.Helper.hasClass(element, className))
    element.className = element.className.trim()
    
  @removeClass : (element, className) ->
    if (gremlin.util.Helper.hasClass(element, className))
      reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      element.className = element.className.replace(reg, ' ')
      element.className = element.className.trim()

  @addStyleSheet: (cssText) ->
    head = document.getElementsByTagName('head')[0]
    style = document.createElement 'style'
    style.type = 'text/css'

    if style.styleSheet
      style.styleSheet.cssText = cssText
    else
      style.appendChild(document.createTextNode(cssText))

    head.appendChild(style);
