fs = require 'fs'
exec = require('child_process').exec

task 'build', 'Compiles and minifies JavaScript file for production use', ->
  console.log "Compiling CoffeeScript"
  requirejs = require 'requirejs'
  packageInfo =  JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'))
  version = packageInfo.version

  wrapStart = fs.readFileSync('build/start.frag','utf8').replace("{{VERSION}}",version)
  wrapEnd = fs.readFileSync('build/end.frag','utf8')

  config =
    baseUrl: './src/'
    name: 'gremlinMain'
    optimize: "uglify"
    #    optimize: "none"
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
    onBuildWrite:  (moduleName, path, contents) ->
      contents = contents.replace /cs!/g, ""
      contents = "" if moduleName is "cs"
      contents

  requirejs.optimize config, (buildResponse) ->
    console.log(buildResponse)
    #contents = fs.readFileSync(config.out, 'utf8')

task 'docco', 'Building the docco files for GremlinJS', ->
  wrench = require "wrench"
  wrench.readdirRecursive './src', (error, curFiles) ->
    if curFiles
      for own file in curFiles when (file.indexOf '.coffee') isnt -1
        console.log("building documentation for #{file}")
        exec "docco src/#{file}", (error, stdout, stderr) ->
          console.log(stdout)


