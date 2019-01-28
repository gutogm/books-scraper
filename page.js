module.exports = {
  getTitle: (e) => e.children[0].data,

  getLanguage: (e) => e.children[0].data,

  getISBN: (e) => {
    const { href } = e.attribs;
    let isbn = 'Unavailable';
    if(href.indexOf('amazon.com') > -1) {
      isbn = href.split('/dp/')[1] || 'Unavailable';
    }
    return isbn;
  },

  getDescription: (e) => e.children
    .map(el => {
      if(el.type === 'text')
        return el.data;
      return el.children[0].data;
    })
    .join(' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
}
