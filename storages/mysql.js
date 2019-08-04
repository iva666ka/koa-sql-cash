const mysql = require('mysql');
const util = require('util');
const {
  sqlConnectionLimit,
  sqlHost,
  sqlUser,
  sqlPassword,
  sqlDatabase,
} = require('../config/config.js').config;

const pool = mysql.createPool({
  sqlConnectionLimit,
  sqlHost,
  sqlUser,
  sqlPassword,
  sqlDatabase,
});

pool.query = util.promisify(pool.query);

module.exports = {
  pool,
};
