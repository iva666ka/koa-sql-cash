const mysql = require('mysql');
const { elasticClient } = require('../storages/elastic.js');

const {
  sqlHost,
  sqlUser,
  sqlPassword,
  sqlDatabase,
} = require('../config/config.js').config;

const connection = mysql.createConnection({
  host: sqlHost,
  user: sqlUser,
  password: sqlPassword,
  database: sqlDatabase,
});

const query = connection.query('SELECT * FROM BOOKS');
query
  .on('error', (err) => {
    console.log('error event', err);
  })
  .on('fields', (fields) => {
    console.log('fields event', fields);
  })
  .on('result', async (row) => {
    connection.pause();
    const result = await elasticClient.index({
      id: row.id,
      index: 'books',
      type: '_doc',
      body: row,
    });
    if ((row.id % 1000) === 0) console.log(row.id, result);
    connection.resume();
  })
  .on('end', () => {
    console.log('end event');
    connection.end(() => { console.log('connection closed'); });
  });
