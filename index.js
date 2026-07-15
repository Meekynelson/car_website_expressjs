
const express = require('express');
const session = require('express-session');
const router = require('./routes/index');

const app = express();
const port = 12000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

// Configure session middleware
app.use(
  session({
    secret: 'any_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(router);


// Configure session middleware
// app.use(
//   session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(function (req, res, next) {
//   if (!req.session.views) {
//     req.session.views = {};
//   }

//   // Get the current path
//   const path = req.path;

//   // count the views for this path
//   req.session.views[path] = (req.session.views[path] || 0) + 1;

//   next();
// });

// app.get('/', function (req, res, next) {
//   res.send('you viewed this page ' + req.session.views['/foo'] + ' times');
// });


app.use((req, res, next) => {
  res.status(404).render("404" , { path: req.path, title: "Page Not Found" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});