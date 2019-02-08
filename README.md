# books-scraper

Projeto para carregar dados de livros vindos de https://kotlinlang.org/docs/books.html

O projeto foi construida usando NodeJS v8.x e Ubuntu 16.04

## Docker e docker-compose
A imagem da aplicação está no docker hub

Para subir a aplicação com um banco de dados, só é necessário rodar o seguinte
comando dentro da pasta da aplicação
```bash
# criar banco de dados postgresql
docker-compose up books-scraper
```
Obs.: A URL da API é http://localhost:3000 por padrão.
Caso queira qual o endereço a ser utilizado,
utilizar a variavel de ambiente `API_URL`
como no exemplo abaixo:
```bash
API_URL={URL} docker-compose up
```


## Projetos correlacionados
- [books-api](https://github.com/gutogm/books-api): projeto de API que o books-lib faz referencia.
- [books-lib](https://github.com/gutogm/books-lib): biblioteca para uso de API por outros projetos.

