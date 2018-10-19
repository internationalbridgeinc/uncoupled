'use strict';

const express = require('express');
const initialize = require('./initialize');

const app = express();
app.use(express.json());

initialize(app);

app.listen(9095);