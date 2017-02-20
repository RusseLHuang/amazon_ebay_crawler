const blibli = require('../blibli');
const express = require('express');
const route = express.Router();

route.get('/blibli',blibli);

module.exports = route;