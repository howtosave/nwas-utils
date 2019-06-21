/**
 * example app
 */

// load .env
require('dotenv/config');

const express = require('express');

const app = express();
const port = process.env.APP_PORT;
const host = '127.0.0.1';

app.get('/sub-app', (req, res) => res.send('Hello World! from sub-app'));

if (process.env.NODE_ENV !== 'production') { // use nginx on production
  app.use(express.static('public'));
}

// start server
app.listen(port, host, () => {
  console.log(`Example sub listening on port http://${host}:${port}`);
});
