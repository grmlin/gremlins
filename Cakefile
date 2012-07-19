fs = require 'fs'
exec = require('child_process').exec

try
  colors     = require 'colors'
  wrench     = require 'wrench'
catch error
  console.error 'Please run `npm install` first'
  process.exit 1


task 'build', 'Compiles and minifies JavaScript file for production use', ->
  console.log "Compiling CoffeeScript"
  requirejs = require 'requirejs'
  packageInfo =  JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'))
  version = packageInfo.version

  wrapStart = fs.readFileSync('build/start.frag', 'utf8').replace("{{VERSION}}", version)
  wrapEnd = fs.readFileSync('build/end.frag', 'utf8')

  config =
    baseUrl: './src/'
    name: 'gremlinMain'
    optimize: "uglify"
    #optimize: "none"
    paths:
      "jquery": "../vendor/jquery-1.7.1.min"
      "cs": '../vendor/cs'
      "coffee-script": '../vendor/coffee-script'
    exclude: ['coffee-script', 'jquery']
    stubModules: ['cs'],
    out: "build/gremlinjs/gremlin-#{version}.min.js"
    wrap:
      start: wrapStart,
      end: wrapEnd
    onBuildWrite: (moduleName, path, contents) ->
      contents = contents.replace /cs!/g, ""
      contents = "" if moduleName is "cs"
      contents

  requirejs.optimize config, (buildResponse) ->
    console.log(buildResponse)
#contents = fs.readFileSync(config.out, 'utf8')

task 'docco', 'Building the docco files for GremlinJS', ->
  wrench = require "wrench"
  handlebars = require "Handlebars"
  filesToDocco = []
  filesFinished = 0
  buildIndex = ->
    if filesFinished is filesToDocco.length
      doccos = wrench.readdirSyncRecursive "./docs"
      doccos = doccos.filter((file) ->
        return (file.indexOf '.html') isnt -1
      )
      data = []
      doccos.forEach (file) ->
        data.push file: file, name: file.replace(".html", "")
      template = handlebars.compile(fs.readFileSync('./build/docco_index.html', 'utf8'))
      ;
      result = template({files: data})
      #fs.openSync("./docs/index.html", 'a')
      fs.writeFileSync("./docs/index.html", result, "utf8")

  files = wrench.readdirSyncRecursive "./src"
  filesToDocco = files.filter (file) ->
    (file.indexOf '.js') isnt -1 or (file.indexOf '.coffee') isnt -1

  filesToDocco.forEach (file) ->
    console.log("building documentation for #{file}")
    exec "docco src/#{file}", (error, stdout, stderr) ->
      filesFinished += 1
      console.log stdout
      buildIndex()

# from https://github.com/fortes/coffee-script-project-template
task 'test', 'Run tests via phantomJS', ->
  exec "which phantomjs", (e, o, se) ->
    if e
      console.error "Must install PhantomJS http://phantomjs.org/".red
      process.exit -1

  # Disable web security so we don't have to run a server on localhost for AJAX
  # calls
  console.log "Running unit tests via PhantomJS".yellow
  p = exec "phantomjs test/lib/phantom-driver.coffee --web-security=no"
  p.stderr.on 'data', stdErrorStreamer (data) -> data.red
  # The phantom driver outputs JSON
  bufferedOutput = ''
  p.stdout.on 'data', (data) ->
    bufferedOutput += data
    return unless bufferedOutput[bufferedOutput.length - 1] is "\n"

    unless /^PHANTOM/.test bufferedOutput
      process.stdout.write data.grey
      return

    pass = "✔".green
    fail = "✖".red

    # Split lines
    for line in (bufferedOutput.split '\n')
      continue unless line
      try
        obj = JSON.parse(line.substr 9)
        switch obj.name
          when 'error'
            console.error "#{fail}  JS Error: #{obj.result.msg}"
            console.dir obj.result.trace if obj.result.trace

          when 'log'
            continue if obj.result.result
            if 'expected' of obj.result
              console.error "#{fail}  Failure: #{obj.result.message}; Expected: #{obj.result.expected}, Actual: #{obj.result.actual}"
            else
              console.error "#{fail}  Failure: #{obj.result.message}"

          when 'moduleDone'
            if obj.result.failed
              console.error "#{fail}  #{obj.result.name} module: #{obj.result.passed} tests passed, " + "#{obj.result.failed} tests failed".red
            else
              console.log "#{pass}  #{obj.result.name} module: #{obj.result.total} tests passed"

        # Output statistics on completion
          when 'done'
            console.log "\nFinished in #{obj.result.runtime / 1000}s".grey
            if obj.result.failed
              console.error "#{fail}  #{obj.result.passed} tests passed, #{obj.result.failed} tests failed (#{Math.round(obj.result.passed / obj.result.total * 100)}%)"
              process.exit -1
            else
              console.log "#{pass}  #{obj.result.total} tests passed"
      catch ex
        console.error "JSON parsing fail: #{line}".red

    bufferedOutput = ''

  p.on 'exit', (code) ->
    process.exit code

stdOutStreamer = (filter) ->
  (str) ->
    str = filter str if filter
    process.stderr.write str

stdErrorStreamer = (filter) ->
  (str) ->
    str = filter str if filter
    process.stderr.write str.red
