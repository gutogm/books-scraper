const axios = require('axios');
const cheerio = require('cheerio');
const API = require('books-lib');
const Promise = require('bluebird');

class Book {
  static _title(e) {
    return e.children[0].data;
  }

  static _language(e) {
    return e.children[0].data;
  }

  static _isbn(e) {
    const { href } = e.attribs;
    let isbn = 'Unavailable';
    if (href.indexOf('amazon.com') > -1) {
      isbn = href.split('/dp/')[1] || 'Unavailable';
    }
    return isbn;
  }

  static _description(e) {
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
            this.structure[this.count].title = Book._title(element);
          }
          if (element.name === 'div') {
            this.structure[this.count].language = Book._language(element);
          }
          if (element.name === 'a') {
            this.structure[this.count].isbn = Book._isbn(element);
          }
          if (element.name === 'p') {
            const description = `${this.structure[this.count].description} ${Book._description(element)}`;
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
    const _idx = idx + 1;
    const element = this.children[`${_idx}`];
    if (!element) return null;
    return {
      element,
      next: () => this.next(_idx),
    };
  }

  iterator() {
    return { next: () => this.next() };
  }
}

module.exports = {
  Books,
};
