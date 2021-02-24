const express = require('express');
const app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

// const vehicleData = require('./vehicle_rest_response.txt');
// const homeMortgageData = JSON.parse('./home_mortgage_rest_response.txt');

const fs = require('fs');
const FILE_NAME = 'home_mortgage_rest_response.txt';
let homeMortgageData = mapEvents(getJSONFileData(FILE_NAME));

function getJSONFileData(filename) {
  return fs
    .readFileSync(filename, 'utf-8');
}

function mapEvents(events) {
  return JSON.parse(events);
}


console.log(homeMortgageData["data"] + "DDP");

app.locals.columnBarChartHelper = require ('./column_bar_chart_helper');

app.get('/', function(req,res) {
    res.render('index', { homeMortgageData: homeMortgageData })
});

app.listen(3000);
console.log('listening on port 3000');