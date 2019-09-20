// the best way to sync mysql and elastic is using Logstash Jdbc input plugin
// https://www.elastic.co/guide/en/logstash/current/plugins-inputs-jdbc.html. Do not use it in production.
// It was written just for sync data during tests.
const mysql = require('mysql');
const { elasticClient } = require('../storages/elastic.js');

const {
  sqlURL,
  elasticIndex,
  elasticType,
} = require('../config/config.js').config;

const connection = mysql.createConnection(sqlURL);

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
      index: elasticIndex,
      type: elasticType,
      body: row,
    });
    if ((row.id % 1000) === 0) console.log(row.id, result);
    connection.resume();
  })
  .on('end', () => {
    console.log('end event');
    connection.end(() => { console.log('connection closed'); });
  });
