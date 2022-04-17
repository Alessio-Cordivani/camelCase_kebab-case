var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const fs = require('fs');

var app = express();


app.use(logger('dev'));
app.use(express.json());


app.post('/post', function (req, res, next) {
  if (req.body != null) {
    console.log(req.body);
    let data = 'Right;Time;Type\n';
    req.body.forEach(element => {
      data += element.right + ';' + element.time + ';' + element.type + '\n';
    });
    console.log(data);
    let date = new Date();
    fs.writeFile('./results/result-' + date.getTime() + '.csv', data, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  }
  res.send("Thanks for posting!");
});
app.use('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
