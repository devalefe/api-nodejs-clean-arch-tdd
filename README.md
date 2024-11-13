# API Node.js - Clean Architecture e TDD

Este repositório é uma implementação de uma API RESTful em Node.js, usando uma arquitetura limpa (Clean Architecture) e práticas de desenvolvimento orientado a testes (TDD). O projeto não usa TypeScript, estando totalmente em JavaScript.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Testes](#testes)

---

## Pré-requisitos

Para rodar a API localmente, você precisará dos seguintes requisitos:

- [Node.js](https://nodejs.org/) - versão 16 ou superior
- [npm](https://www.npmjs.com/) - instalado junto com o Node.js

## Instalação

Clone o repositório e acesse o diretório do projeto:

```bash
git clone https://github.com/devalefe/api-nodejs-clean-arch-tdd.git

cd api-nodejs-clean-arch-tdd
```

## Configuração

Roda o comando para instalar as dependências:

```bash
npm install
```
Crie um arquivo .env na raiz do projeto e abra-o:

```bash
touch .env
nano .env
```

Adicione as variáveis de ambiente:

```
MONGO_URL=mongodb://username:password@localhost:27017
DB_NAME=some_database
TOKEN_SECRET=your_custom_secret_key
HASH_SALT=12
PORT=5050
```

## Testes

Para validar o cobertura de testes basta rodar um dos seguinte comandos:

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:staged
npm run test:ci
```

### Agradecimentos

<p>
Obrigado por conferir este projeto! 💻🌟
</p>

<p>
Esperamos que ele seja útil e que você possa aprender algo novo com ele. Se gostou, considere deixar uma ⭐️ no repositório e contribuir com sugestões ou melhorias!
</p>

<p>
Feito com ❤️ por @devalefe.
</p>

<p>
Happy coding! 🚀👨‍💻👩‍💻
</p>
