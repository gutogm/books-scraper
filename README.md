# books-scraper

Projeto para carregar dados de livros vindos de https://kotlinlang.org/docs/books.html

O projeto foi construida usando NodeJS v8.x e Ubuntu 16.04

## Variaveis de ambiente
A configuração do endereço a ser acessado para utilização da API deve ser feita utilizando variaveis de ambiente do sistema.

- API_URL: endereço de acesso da api

Exemplo:
```bash
export API_URL="http://localhost:3000";
```

## Dependencias
Instalação das dependencias utilizando
```bash
npm install
```

## Execução
```bash
npm run exec
```


## Instalação de NodeJS v8 no Ubuntu
```bash
sudo apt-get update;
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Projetos correlacionados
- [books-api](https://github.com/gutogm/books-api): projeto de API que o books-lib faz referencia.
- [books-lib](https://github.com/gutogm/books-lib): biblioteca para uso de API por outros projetos.

