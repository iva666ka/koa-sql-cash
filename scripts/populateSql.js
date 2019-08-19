const JSONStream = require('JSONStream');
const fs = require('fs');
const randomWords = require('random-words');
const { create } = require('../services/books/index.js');
const { pool: sqlConnectionPool } = require('../storages/mysql.js');

const jsonParser = JSONStream.parse('books.objects.*');

fs.createReadStream('data.json')
  .pipe(jsonParser);

jsonParser.on('data', async (parsedObj) => {
  const bookData = {
    title: String(parsedObj.title).slice(0, 255),
    date: new Date(),
    author: String(parsedObj.authors).slice(0, 255),
    description: String(parsedObj.annotation).slice(0, 10000),
    image: String(parsedObj.cover.large).slice(0, 255),
  };
  try {
    await create(bookData);
  } catch (e) {
    console.error(bookData, e);
  }
});

jsonParser.on('end', async () => {
  console.debug('end event');
  const [counter] = await sqlConnectionPool.query('SELECT COUNT (*) FROM BOOKS');
  console.log(counter);
  let i = counter['COUNT (*)'];
  console.log(i);
  while (i < 100000) {
    i += 1;
    const randomBooksData = {
      title: String(randomWords({ min: 1, max: 10, join: ' ' })).slice(0, 255),
      // date between 1900 and current
      date: new Date(-2208988800000 + Math.random() * (new Date().getTime() + 2208988800000)),
      author: String(randomWords({ min: 2, max: 3, join: ' ' })).slice(0, 255),
      description: String(randomWords({ min: 3, max: 100, join: ' ' })).slice(0, 10000),
      image: String(`https://images.site.domain/image${i}`).slice(0, 255),
    };
    if ((i % 1000) === 0) console.log(i, randomBooksData); // display every 1000's record.
    try {
      await create(randomBooksData);
    } catch (e) {
      console.error(randomBooksData, e);
    }
  }
  console.log('data saved in db');
});
