goog.provide 'gremlin.helper'

gremlin.helper = do ->
  #
  # #GremlinJS - `gremlinjs/core/helper`
  #
  # Helper functions used by GremlinJS
  #

  # ##Private module definitions

  # `typeof` result `object` const
  OBJECT = "object"
  # `typeof` result `string` const
  STRING = "string"
  # `typeof` result `function` const
  FUNCTION = "function"
  # `typeof` result `number` const
  NUMBER = "number"
  # length of empty string length const
  EMPTY_STRING_LENGTH = 0
  # extend helper, mixing in object into another
  mixin = (target, mixinObject) ->
    target[name] = val for own name, val of mixinObject
    target
  # ## Public module definition

  # exported module
  return helper =
  # check, if a is `undefined`
    isUndefined   : (a) ->
      a is undefined
    # check, if a is a `function`
    isFunction    : (a) ->
      typeof a is FUNCTION
    # check, if a is an `Array`
    isArray       : (a) ->
      a instanceof Array
    # check, if a i an `object`
    isObject      : (a) ->
      a isnt null and typeof a is OBJECT and not module.exports.isArray(a)
    # check, if a is a `number`
    isNumber      : (a) ->
      typeof a is NUMBER
    # check, if a is a `String`
    isString      : (a) ->
      typeof a is STRING
    # check, if a is an empty `String`
    isEmptyString : (a) ->
      module.exports.isString(a) and a.length is EMPTY_STRING_LENGTH
    # check, if a is a `jQuery` object
    isJquery      : (a) ->
      (module.exports.isObject a) and (module.exports.isString a.jquery)
    # mix an object literal into a class/constructor function
    mixin         : (targetClass, mixinObject) ->
      throw new TypeError "target has to be a (constructor) function. Only prototypes will be extended" if (not module.exports.isFunction(targetClass))
      throw new TypeError "object has to be used to extend prototype" if (not module.exports.isObject(mixinObject))
      mixin targetClass::, mixinObject
    # deep extend for objects
    extend        : (destination, extenders...) ->
      return {} if not destination?
      for other in extenders
        for own key, val of other
          if not destination[key]? or typeof val isnt "object"
            destination[key] = val
          else
            destination[key] = module.exports.extend destination[key], val
      destination
    # test an dom element for a specific css class
    hasClass      : (element, className) ->
      element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    # add an css class to a dom element
    addClass      : (element, className) ->
      element.className += " " + className if (!module.exports.hasClass(element, className))
    # remove a css class from a dom element
    removeClass   : (element, className) ->
      if (module.exports.hasClass(element, className))
        reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        element.className = element.className.replace(reg, ' ')