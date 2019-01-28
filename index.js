const { Books } = require('./page');

const URL = 'https://kotlinlang.org/docs/books.html';

async function run(url) {
  const books = new Books();
  // extract data from page
  await books.extract(url);
  // console.log(books.article);
  books.transform();
  console.log(books.structure);
  // books.load();
}
run(URL)
  .catch(err => console.error(err));
