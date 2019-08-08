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
  connectionLimit: sqlConnectionLimit,
  host: sqlHost,
  user: sqlUser,
  password: sqlPassword,
  database: sqlDatabase,
  // insecureAuth: true,
});

pool.query = util.promisify(pool.query);

module.exports = {
  pool,
};
