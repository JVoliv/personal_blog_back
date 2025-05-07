# Blog Pessoal API

API completa para um blog pessoal, desenvolvida com NestJS e Prisma.

## Funcionalidades

- ✅ Autenticação (registro e login)
- ✅ Gerenciamento de usuários (CRUD)
- ✅ Gerenciamento de categorias (CRUD)
- ✅ Gerenciamento de posts (CRUD)
- ✅ Sistema de comentários
- ✅ Tags para posts
- ✅ Pesquisa de posts
- ✅ Controle de permissões (admin/usuário comum)
- ✅ Proteção contra ataques comuns

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn

## Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd blog-pessoal-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Gerar prisma client
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular o banco de dados com dados de teste
npx prisma db seed
```

## Executando o projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Estrutura do Projeto

```
src/
├── auth/               # Módulo de autenticação
├── categories/         # Módulo de categorias
├── comments/           # Módulo de comentários
├── common/             # Componentes compartilhados (interceptors, filtros, etc)
├── posts/              # Módulo de posts
├── prisma/             # Módulo de serviço do Prisma
├── users/              # Módulo de usuários
├── app.controller.ts   # Controlador principal
├── app.module.ts       # Módulo principal
├── app.service.ts      # Serviço principal
└── main.ts             # Ponto de entrada da aplicação
```

## Endpoints da API

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `GET /auth/profile` - Obter perfil do usuário autenticado

### Usuários

- `GET /users` - Listar todos os usuários (admin)
- `GET /users/:id` - Obter usuário específico
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário (admin)

### Categorias

- `GET /categories` - Listar todas as categorias
- `GET /categories/:id` - Obter categoria específica
- `POST /categories` - Criar nova categoria (admin)
- `PATCH /categories/:id` - Atualizar categoria (admin)
- `DELETE /categories/:id` - Remover categoria (admin)

### Posts

- `GET /posts` - Listar todos os posts publicados
- `GET /posts?search=termo` - Pesquisar posts
- `GET /posts/:id` - Obter post específico
- `POST /posts` - Criar novo post (autenticado)
- `PATCH /posts/:id` - Atualizar post (autor ou admin)
- `DELETE /posts/:id` - Remover post (autor ou admin)
- `GET /posts/admin/all` - Listar todos os posts incluindo não publicados (admin)

### Comentários

- `GET /comments/post/:postId` - Listar comentários de um post
- `GET /comments/:id` - Obter comentário específico
- `POST /comments` - Criar novo comentário (anônimo ou autenticado)
- `PATCH /comments/:id` - Atualizar comentário (autor ou admin)
- `DELETE /comments/:id` - Remover comentário (autor ou admin)
- `DELETE /comments/admin/:id` - Remover comentário (admin)

## Documentação da API

A documentação completa da API está disponível através do Swagger UI na rota:

```
/api
```

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Segurança

Esta API implementa várias camadas de segurança:

- JWT para autenticação
- Hash de senhas com bcrypt
- Proteção contra XSS com Helmet
- Rate Limiting para prevenir ataques de força bruta
- Validação de entrada com class-validator
- CORS configurável
- Sanitização de entradas