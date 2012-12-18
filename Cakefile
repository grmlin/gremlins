fs = require 'fs'
path = require 'path'

exec = require('child_process').exec

try
  colors     = require 'colors'
  wrench     = require 'wrench'
catch error
  console.error 'Please run `npm install` first'
  process.exit 1

option '-t', '--test [YESNO]', 'running test when building gremlinjs'

task "build2", 'Compiles and minifies coffeescript sources for production', (options) ->
  LIB_NAME     = "gremlinjs"
  SRC          = path.join __dirname, "src", "gremlinjs.coffee"
  DIR_OUT      = path.join __dirname, "build"
  FILENAME_MIN = "gremlin.min.js"
  DEST         = path.join DIR_OUT, FILENAME_MIN

  webpack = require "webpack"

  packageInfo =  JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'))
  version = packageInfo.version

  wrapStart = fs.readFileSync('build/start.frag', 'utf8').replace("{{VERSION}}", version)
  wrapEnd = fs.readFileSync('build/end.frag', 'utf8')

  options =
    output          : FILENAME_MIN
    outputDirectory : DIR_OUT
    library         : LIB_NAME
    #minimize       : false
    minimize        : true
    #debug          : true
    watch           : true

  webpack SRC, options, (err, stats)->
    console.log err if err
    unless err
      min = fs.readFileSync DEST, 'utf8'
      comb = wrapStart + min + wrapEnd
      console.log "build successful\n\n", comb, "\n\n", stats
      
      fs.writeFileSync DEST, comb, 'utf8'



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

  wrench.rmdirSyncRecursive('docs');
  files = wrench.readdirSyncRecursive "./src"
  filesToDocco = files.filter (file) ->
    (file.indexOf '.js') isnt -1 or (file.indexOf '.coffee') isnt -1

  filesToDocco.forEach (file) ->
    console.log("building documentation for #{file}")
    exec "docco src/#{file}", (error, stdout, stderr) ->
      filesFinished += 1
      console.log stdout
      buildIndex()

stdOutStreamer = (filter) ->
  (str) ->
    str = filter str if filter
    process.stderr.write str

stdErrorStreamer = (filter) ->
  (str) ->
    str = filter str if filter
    process.stderr.write str.red
