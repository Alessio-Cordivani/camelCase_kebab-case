var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const fs = require('fs');
const nodemailer = require('nodemailer');

var app = express();


app.use(logger('dev'));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'allen.monahan86@ethereal.email',
    pass: 'gHEKvN6MmE7xXJuM3T'
  }
});

async function sendEmail(data) {
  let date = new Date();
  let info = await transporter.sendMail({
    from: '<allen.monahan86@ethereal.email>',
    to: '<allen.monahan86@ethereal.email>',
    subject: 'Experiment-' + date.getTime(),
    text: data
  });
  console.log('Message sent: %s', info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

app.post('/post', function (req, res, next) {
  if (req.body != null) {
    let data = 'Right;Time;Type\n';
    req.body.forEach(element => {
      data += element.right + ';' + element.time + ';' + element.type + '\n';
    });
    sendEmail(data).then(() => {
      console.log(data);
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
