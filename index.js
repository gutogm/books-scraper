const { Books } = require('./page');

const URL = 'https://kotlinlang.org/docs/books.html';

async function run(url) {
  const books = new Books();
  // extraindo dados da pagina
  await books.extract(url);
  // transformação dos dados para
  // estrutura interna
  books.transform();
  // carregamento de dados utilizando api
  await books.load();
}
run(URL)
  .catch(err => console.error(err));
