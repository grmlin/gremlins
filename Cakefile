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

task "build", 'Compiles and minifies coffeescript sources for production', (options) ->
  LIB_NAME     = "gremlinjs"
  SRC          = path.join __dirname, "src", "gremlinjs.coffee"
  DIR_OUT      = path.join __dirname, "build", "gremlinjs"
  FILENAME_MIN = "gremlin.min.js"
  DEST         = path.join DIR_OUT, FILENAME_MIN

  webpack = require "webpack"


  fs.unlinkSync DEST if fs.existsSync DIR_OUT

  options =
    output          : FILENAME_MIN
    outputDirectory : DIR_OUT
    library         : LIB_NAME
    #minimize        : true
    #debug          : true
    watch           : true

  webpack SRC, options, (err, stats)->
    console.log err if err
    unless err
      console.log "webpack: files updated"
      result = wrapFile("gremlinjs", DEST)
      fs.writeFileSync DEST, result, 'utf8'


task 'extensions', 'Building gremlinjs extensions', ->
  LIB_NAME     = "gremlinjs"
  DIR_OUT      = path.join __dirname, "build", "gremlinjs", "extensions"
  #DEST         = path.join DIR_OUT, FILENAME_MIN

  webpack = require "webpack"

  wrench.rmdirSyncRecursive DIR_OUT if fs.existsSync DIR_OUT

  files = fs.readdirSync(path.join(__dirname, "src", "extensions"))
  filesToCompile = files.filter (file) ->
    src  = path.join __dirname, "src", "extensions", file
    stat = fs.statSync(src)
    stat.isFile()

  compileNext = ->
    if filesToCompile.length > 0
      file = filesToCompile.shift()
      src  = path.join __dirname, "src", "extensions", file
      filename = file.replace(".coffee", "").toLowerCase()
      out      = path.join DIR_OUT, filename
      options  =
        output          : "index.js"
        outputDirectory : out
        library         : LIB_NAME
        #minimize        : true
        #debug          : true
        watch           : false
      dest     = path.join(out, options.output)


      console.log "File:", file, "(#{dest})"
      webpack src, options, (err, stats)->
        console.log "Error occured:", err if err
        unless err
          console.log "webpack: extensions updated"
          result = wrapFile(filename, dest, yes)
          fs.writeFileSync dest, result, 'utf8'
          compileNext()

  compileNext()

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
        data.push file : file, name : file.replace(".html", "")
      template = handlebars.compile(fs.readFileSync('./build/docco_index.html', 'utf8'))
      ;
      result = template({files : data})
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

wrapFile = do() ->
  packageInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
  version     = packageInfo.version

  wrapEnd     = fs.readFileSync('build/end.frag', 'utf8')

  return (moduleName, file, isExtension) ->
    start = if isExtension then 'build/start-extension.frag' else 'build/start.frag'
    wrapStart   = fs.readFileSync(start, 'utf8').replace("{{VERSION}}", version)
    min = fs.readFileSync file, 'utf8'
    comb = wrapStart.replace("{{MODULE_NAME}}", moduleName) + min + wrapEnd
    return comb

stdOutStreamer = (filter) ->
  (str) ->
    str = filter str if filter
    process.stderr.write str

stdErrorStreamer = (filter) ->
  (str) ->
    str = filter str if filter
    process.stderr.write str.red
