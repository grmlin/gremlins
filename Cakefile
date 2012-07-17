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
    onBuildWrite:  (moduleName, path, contents) ->
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
      doccos = doccos.filter( (file) ->
        return (file.indexOf '.html') isnt -1
      )
      data = []
      doccos.forEach (file) ->
        data.push file: file, name: file.replace(".html","")
      template = handlebars.compile(fs.readFileSync('./build/docco_index.html', 'utf8'));
      result = template({files:data})
      #fs.openSync("./docs/index.html", 'a')
      fs.writeFileSync("./docs/index.html",result, "utf8")

  files = wrench.readdirSyncRecursive "./src"
  filesToDocco = files.filter (file) ->
    (file.indexOf '.js') isnt -1 or (file.indexOf '.coffee') isnt -1

  filesToDocco.forEach (file) ->
    console.log("building documentation for #{file}")
    exec "docco src/#{file}", (error, stdout, stderr) ->
      filesFinished += 1
      console.log stdout
      buildIndex()

