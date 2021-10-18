const request = require('request');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
require('./db/mongoose');
const userRouters = require('./router/users');
const taskRouters = require('./router/task');
const bodyParser = require('body-parser');
//  port
const app = express();
const port = process.env.PORT;

// path
const publicDirectoryPath = path.join(__dirname, '../public/dist');
const viewPath = path.join(__dirname, '../template/views');
const particalPath = path.join(__dirname, '../template/partical');


// parse application/json 

// parse application/x-www-form-urlencoded 
app.set('view engine', 'hbs');
app.set('views', viewPath);
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(userRouters);
app.use(taskRouters);
// path header footer
hbs.registerPartials(particalPath);

app.get('/', (req, res) => {
    res.render('index', {
        title: 'INDEX PAGE',
        name: 'CANHCUTCON'
    })
});

module.exports = app;