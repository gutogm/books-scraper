const axios = require('axios');
const cheerio = require('cheerio');
const API = require('books-lib');

const page = require('./page');

const URL = 'https://kotlinlang.org/docs/books.html';

let count = 0;
const structure = {};

function next(children, idx=-1) {
  const _idx = idx + 1;
  const element = children[`${_idx}`];
  if (!element)
    return null;
  return {
    element,
    next: () => next(children, _idx)
  }; 
}

function createIterator(article) {
  return { next: () => next(article.children()) };
}

function extract(item) {
  const { element } = item;
  if(element) {
    if(element.type === 'tag') {
      if(element.name === 'h2') {
        count += 1;
        structure[count] = { description: '' };
        structure.length = count;
        structure[count].title = page.getTitle(element);
      }
      if(element.name === 'div'){
        structure[count].language = page.getLanguage(element);
      };
      if(element.name === 'a') {
        structure[count].isbn = page.getISBN(element);
      };
      if(element.name === 'p'){
        structure[count].description = `${structure[count].description} ${page.getDescription(element)}`
      }
    }
  }
}

async function run(url) {
  const { data: content } = await axios.get(url);
  const $ = cheerio.load(content);
  const article = $('body > div.global-layout > div > article');
  const iterator = createIterator(article);
  let item = iterator.next();
  while(item) {
    extract(item);
    item = item.next();
  }
  for (let index = 0; index < structure.length; index++) {
    const element = structure[`${index}`];
    const book = await API.create(element);
    console.log(book);
    console.log(`book with id ${book.id} created.`);
  }
}
run(URL)
  .catch(err => console.error(err));

