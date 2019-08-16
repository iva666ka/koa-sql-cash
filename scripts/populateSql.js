const JSONStream = require('JSONStream');
const fs = require('fs');
const { create } = require('../services/books/index.js');

const jsonParser = JSONStream.parse('books.objects.*');

fs.createReadStream('data.json')
  .pipe(jsonParser);

let counter = 0;
jsonParser.on('data', async (parsedObj) => {
  counter += 1;
  const bookData = {
    title: String(parsedObj.title).slice(0, 250),
    date: new Date(),
    author: String(parsedObj.authors).slice(0, 250),
    description: String(parsedObj.annotation).slice(0, 10000),
    image: String(parsedObj.cover.large).slice(0, 250),
  };
  console.log(counter, bookData);
  try {
    await create(bookData);
  } catch (e) {
    console.error(e, bookData);
  }
});
