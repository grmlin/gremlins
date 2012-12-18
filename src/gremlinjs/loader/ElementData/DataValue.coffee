helper = require "./../helper.coffee"

class DataValue
  constructor: (@_dataString) ->
    
  parse: ->
    data   = @_dataString
    result = @_dataString
    
    if helper.isString @_dataString
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
          result = JSON.parse data
          
      catch e
        #console.log e
        
    return result
    
module.exports = DataValue