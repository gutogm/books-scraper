const axios = require('axios');
const cheerio = require('cheerio');
const API = require('books-lib');
const Promise = require('bluebird');

class Book {
  static getTitle(e) {
    return e.children[0].data;
  }

  static getLanguage(e) {
    return e.children[0].data;
  }

  static getISBN(e) {
    const { href } = e.attribs;
    let isbn = 'Unavailable';
    if (href.indexOf('amazon.com') > -1) {
      isbn = href.split('/dp/')[1] || 'Unavailable';
    }
    return isbn;
  }

  static getDescription(e) {
    return e.children
      .map((el) => {
        if (el.type === 'text') return el.data;
        return el.children[0].data;
      })
      .join(' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ');
  }
}

class Books {
  constructor() {
    this.article = null;
    this.structure = {};
    this.count = -1;
    this.children = {};
  }

  async extract(url) {
    const { data: content } = await axios.get(url);
    const $ = cheerio.load(content);
    this.article = $('body > div.global-layout > div > article');
    this.children = this.article.children();
  }

  transform() {
    let item = this.iterator().next();
    while (item) {
      const { element } = item;
      if (element) {
        if (element.type === 'tag') {
          if (element.name === 'h2') {
            this.count += 1;
            this.structure[this.count] = { description: '' };
            this.structure.length = this.count + 1;
            this.structure[this.count].title = Book.getTitle(element);
          }
          if (element.name === 'div') {
            this.structure[this.count].language = Book.getLanguage(element);
          }
          if (element.name === 'a') {
            this.structure[this.count].isbn = Book.getISBN(element);
          }
          if (element.name === 'p') {
            const description = `${this.structure[this.count].description} ${Book.getDescription(element)}`;
            this.structure[this.count].description = description;
          }
        }
      }
      item = item.next();
    }
  }

  async load() {
    const promises = [];
    for (let index = 0; index < this.structure.length; index += 1) {
      const element = this.structure[`${index}`];
      promises.push(API.create(element));
    }
    const books = await Promise.all(promises);
    books.forEach(book => console.log(`book with id ${book.id} created.`));
  }

  next(idx = -1) {
    const idy = idx + 1;
    const element = this.children[`${idy}`];
    if (!element) return null;
    return {
      element,
      next: () => this.next(idy),
    };
  }

  iterator() {
    return { next: () => this.next() };
  }
}

module.exports = {
  Books,
};
