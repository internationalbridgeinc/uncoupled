'use strict';

const express = require('express');
const initialize = require('./initialize');

const app = express();
app.use(express.json());

initialize(app);

const port = 9095;
app.listen(port, () => {
    console.log(`Server listening on ${ port }...`);
});