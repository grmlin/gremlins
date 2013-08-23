goog.provide 'util.ElementData.DataValue'

# Inspired by jQuery. See https://github.com/jquery/jquery/blob/master/src/data.js
class util.ElementData.DataValue
  rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/
  constructor: (@_dataString) ->
    
  parse: ->
    data   = @_dataString
    result = @_dataString
    
    if typeof @_dataString is "string"
      try 
        if data is "true"
          result = true
        else if data is "false"
          result = false
        else if data is "null"  
          result = null
        else if +data + "" is data
          result = +data
        else
          result = if rbrace.test(data) then JSON.parse(data) else data
          
      catch e
        #console.log e
        
    return result
    
