const { Books } = require('./page');

const URL = 'https://kotlinlang.org/docs/books.html';

const info = msg => console.log(msg);

info(`API_URL: ${process.env.API_URL}`);

async function run(url) {
  const books = new Books();
  info('extraindo dados da pagina');
  return books.extract(url)
    .then(() => {
      info('transformação dos dados para');
      info('estrutura interna');
      return books.transform();
    })
    .then(() => {
      info('carregamento de dados utilizando api');
      return books.load();
    });
}
run(URL)
  .catch(err => console.error(err));
