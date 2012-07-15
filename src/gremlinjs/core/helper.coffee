#
# #GremlinJS - `gremlinjs/core/helper`
#
# Helper functions used by GremlinJS
#

# defining the requirejs module
define ->
  # ##Private module definitions

  # `typeof` result `undefined` const
  UNDEFINED = "undefined"
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
  extend = (target, mixinObject) ->
    target[name] = method for own name, method of mixinObject
    target
  # ## Public module definition

  # exported module
  exports =
    # check, if a is `undefined`
    isUndefined: (a) ->
      typeof a is UNDEFINED
    # check, if a is a `function`
    isFunction: (a) ->
      typeof a is FUNCTION
    # check, if a is an `Array`
    isArray: (a) ->
      a instanceof Array
    # check, if a i an `object`
    isObject: (a) ->
      a isnt null and typeof a is OBJECT and not exports.isArray(a)
    # check, if a is a `number`
    isNumber: (a) ->
      typeof a is NUMBER
    # check, if a is a `String`
    isString: (a) ->
      typeof a is STRING
    # check, if a is an empty `String`
    isEmptyString: (a) ->
      exports.isString(a) and a.length is EMPTY_STRING_LENGTH
    # check, if a is a `jQuery` object
    isJquery: (a) ->
      (exports.isObject a) and (exports.isString a.jquery)
    # log something into the console, if available
    log: ->
      console.log.apply(console,arguments) if exports.isObject(console) and exports.isFunction(console.log)
    # log a warning into the console, if available
    warn: ->
      console.warn.apply(console,arguments) if exports.isObject(console) and exports.isFunction(console.warn)
    # mix an object literal into a class/constructor function
    mixin: (targetClass, mixinObject) ->
      extend targetClass::, mixinObject
