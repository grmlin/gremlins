page = new WebPage()

# Page writes JSON to console
page.onConsoleMessage = (msg) ->
  if /^PHANTOM:/.test msg
    console.log msg

    # Exit when finished
    obj = JSON.parse msg.substr 9
    phantom.exit 0 if obj.name is 'done'

  return

page.open "test/index.html", (status) ->
  if status isnt "success"
    window.console.error "Could not open page"
    phantom.exit 1
    return

  # Set up listeners to QUnit events
  page.evaluate ->
    # Hook into QUnit events
    ['log', 'testStart', 'testDone', 'moduleStart', 'moduleDone', 'begin', 'done'].forEach (ev) ->
      window.QUnit[ev] (res) -> window.phantomLog ev, res

# Runs before page loads
page.onInitialized = ->
  page.evaluate ->
    # Helper for sending JSON out of phantom
    window.phantomLog = (name, result) ->
      window.console.log "PHANTOM: #{window.JSON.stringify { name, result }}"
      return

# Catch JS syntax errors
page.onError = (msg, trace) ->
  obj =
    name: 'error'
    result: { msg, trace }

  console.error "PHANTOM: #{ JSON.stringify obj }"
