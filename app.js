const express = require('express');
const app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

const fs = require('fs');
const HOME_MORTGAGE_FILE_NAME = 'home_mortgage_rest_response.txt';
const VEHICLE_TYPE_FILE_NAME = 'vehicle_rest_response.txt';

let homeMortgageData = mapEvents(getJSONFileData(HOME_MORTGAGE_FILE_NAME));
let vehicleTypeData = mapEvents(getJSONFileData(VEHICLE_TYPE_FILE_NAME));

function getJSONFileData(filename) {
  return fs
    .readFileSync(filename, 'utf-8');
}

function mapEvents(events) {
  return JSON.parse(events);
}

app.locals.columnBarChartHelper = require ('./src/helper/column_bar_chart_helper');
app.locals.pieChartHelper = require('./src/helper/pie_chart_helper');

app.use(express.static(__dirname + '/public'));


app.get('/', function(req,res) {
    res.render('index', { homeMortgageData: homeMortgageData, vehicleTypeData: vehicleTypeData })
});

app.listen(3000);
console.log('listening on port 3000');