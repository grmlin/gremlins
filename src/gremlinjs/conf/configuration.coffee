helper = require "../helper.coffee"
config =
  modules : []
  watch   : no

module.exports =
  set : (newConfig = {}) ->
    config = helper.extend config, newConfig

  get : () ->
    config
    