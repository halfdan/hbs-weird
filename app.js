var express = require('express'),
    hbs     = require('express-hbs'),
    when    = require('when'),
    // Init app
    app     = express();

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index', {
    title: 'Some title',
    name: 'Weird express-hbs behaviour'
  });
});

function someAsyncString() {
  return when(function() { return '<title>Tiesto - Escape me</title>'; }, function(val){ return val;});  
}

function someString() {
  return '<title>Tiesto - Escape me</title>';
}

// Register an async handlebars helper for a given handlebars instance
function registerAsyncHelper(hbs, name, fn) {
  hbs.registerAsyncHelper(name, function (options, cb) {
    // Wrap the function passed in with a when.resolve so it can
    // return either a promise or a value
    when.resolve(fn.call(this, options)).then(function (result) {
      cb(result);
    }); // ignore failure
  });
}

hbs.registerHelper('someString', someString);
registerAsyncHelper(hbs, 'asyncString', someAsyncString);

app.listen(3000);

