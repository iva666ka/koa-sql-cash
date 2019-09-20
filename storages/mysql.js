const mysql = require('mysql');
const util = require('util');
const {
  sqlURL,
} = require('../config/config.js').config;

const pool = mysql.createPool(sqlURL);

pool.query = util.promisify(pool.query);

module.exports = {
  pool,
};
