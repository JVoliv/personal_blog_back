import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpar o banco existente
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Banco de dados limpo.');

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@blog.com',
      password: adminPassword,
      name: 'Administrador',
      bio: 'Administrador do blog',
      isAdmin: true,
    },
  });
  console.log('Usuário administrador criado:', admin.email);

  // Criar usuário comum
  const userPassword = await bcrypt.hash('user123', 10);
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@blog.com',
      password: userPassword,
      name: 'Usuário Comum',
      bio: 'Um usuário comum do blog',
      isAdmin: false,
    },
  });
  console.log('Usuário comum criado:', regularUser.email);

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Tecnologia',
        description: 'Artigos sobre tecnologia e programação',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Saúde',
        description: 'Dicas e informações sobre saúde',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Viagens',
        description: 'Experiências e dicas de viagem',
      },
    }),
  ]);
  console.log('Categorias criadas:', categories.map(c => c.name).join(', '));

  // Criar tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript' } }),
    prisma.tag.create({ data: { name: 'Node.js' } }),
    prisma.tag.create({ data: { name: 'NestJS' } }),
    prisma.tag.create({ data: { name: 'Angular' } }),
    prisma.tag.create({ data: { name: 'React' } }),
    prisma.tag.create({ data: { name: 'Viagem' } }),
    prisma.tag.create({ data: { name: 'Dicas' } }),
    prisma.tag.create({ data: { name: 'Bem-estar' } }),
  ]);
  console.log('Tags criadas:', tags.map(t => t.name).join(', '));

  // Criar posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Primeiros passos com NestJS',
        content: `
# Primeiros passos com NestJS

NestJS é um framework para construção de aplicações Node.js eficientes e escaláveis no lado do servidor. Ele usa TypeScript progressivo (mantém a compatibilidade com JavaScript puro) e combina elementos de OOP (Programação Orientada a Objetos), FP (Programação Funcional) e FRP (Programação Reativa Funcional).

## Instalação

Para começar um novo projeto NestJS, você pode usar o CLI:

\`\`\`bash
npm i -g @nestjs/cli
nest new nome-do-projeto
\`\`\`

## Estrutura básica

Um módulo básico do NestJS consiste em:

1. **Módulos**: Organizam a aplicação em blocos coesos
2. **Controladores**: Lidam com requisições HTTP
3. **Serviços**: Contêm a lógica de negócios

## Benefícios do NestJS

- Arquitetura inspirada no Angular
- Suporte para TypeScript
- Modular e escalável
- Injeção de dependência
- Fácil integração com diversos bancos de dados
- Documentação excepcional

Experimente NestJS em seu próximo projeto backend!
        `,
        published: true,
        authorId: admin.id,
        categoryId: categories[0].id, // Categoria Tecnologia
        tags: {
          connect: [
            { id: tags[0].id }, // JavaScript
            { id: tags[2].id }, // NestJS
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'Os benefícios da meditação diária',
        content: `
# Os benefícios da meditação diária

A meditação é uma prática que tem ganhado cada vez mais adeptos no mundo ocidental, e por boas razões. Meditar regularmente traz inúmeros benefícios para a saúde mental e física.

## O que é meditação?

Meditar é o ato de treinar a atenção e a consciência para alcançar um estado mental claro e emocionalmente calmo e estável. Existem muitas técnicas diferentes, desde a meditação mindfulness até a meditação transcendental.

## Benefícios comprovados

Estudos científicos têm demonstrado diversos benefícios da meditação regular:

- Redução do estresse e ansiedade
- Melhora na concentração e foco
- Aumento da autoconsciência
- Melhora na qualidade do sono
- Diminuição da pressão sanguínea
- Alívio de sintomas de depressão

## Como começar?

Iniciar uma prática de meditação é mais simples do que parece:

1. Comece com apenas 5 minutos por dia
2. Encontre um local tranquilo
3. Sente-se em uma posição confortável
4. Concentre-se na sua respiração
5. Quando sua mente divagar, gentilmente traga-a de volta

Experimente por 21 dias consecutivos e observe as mudanças em sua vida!
        `,
        published: true,
        authorId: regularUser.id,
        categoryId: categories[1].id, // Categoria Saúde
        tags: {
          connect: [
            { id: tags[7].id }, // Bem-estar
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'Desenvolvendo com Angular e NestJS',
        content: `
# Desenvolvendo com Angular e NestJS

Criar aplicações full-stack usando Angular no frontend e NestJS no backend é uma combinação poderosa. Ambas as tecnologias foram inspiradas pelo mesmo design e compartilham conceitos similares.

## Por que esta combinação?

- **Sintaxe similar**: Ambos usam TypeScript e têm estruturas parecidas
- **Módulos**: Tanto Angular quanto NestJS organizam código em módulos
- **Injeção de dependência**: Ambos usam sistemas robustos de DI
- **Decoradores**: Uso intensivo de decoradores para metadata
- **Testabilidade**: Excelente suporte para testes unitários e e2e

## Estrutura típica de um projeto

Um projeto full-stack típico com esta stack pode ser organizado da seguinte forma:

\`\`\`
projeto/
  ├── client/          # Frontend Angular
  │   ├── src/
  │   └── ...
  ├── server/          # Backend NestJS
  │   ├── src/
  │   └── ...
  └── package.json
\`\`\`

## Comunicação client-server

A comunicação entre o frontend Angular e o backend NestJS geralmente é feita através de uma API RESTful ou GraphQL.

Este artigo é uma introdução a esta poderosa combinação de tecnologias. Em futuros posts, exploraremos exemplos práticos de implementação!
        `,
        published: true,
        authorId: admin.id,
        categoryId: categories[0].id, // Categoria Tecnologia
        tags: {
          connect: [
            { id: tags[2].id }, // NestJS
            { id: tags[3].id }, // Angular
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'Descubra as belezas de Portugal',
        content: `
# Descubra as belezas de Portugal

Portugal é um país repleto de história, cultura e paisagens deslumbrantes. Situado no extremo sudoeste da Europa, oferece experiências únicas para todos os tipos de viajantes.

## Cidades imperdíveis

### Lisboa
A capital portuguesa encanta com suas ruelas íngremes, bondes históricos e vistas panorâmicas. Não deixe de visitar o Bairro Alto, Alfama e a Torre de Belém.

### Porto
Famosa pelo vinho do Porto, esta cidade no norte do país impressiona com sua arquitetura, pontes espetaculares e atmosfera vibrante. O distrito da Ribeira, à beira do Rio Douro, é Patrimônio Mundial da UNESCO.

### Sintra
Como um cenário saído de um conto de fadas, Sintra abriga palácios coloridos e castelos místicos cercados por florestas densas.

## Praias paradisíacas

O Algarve, no sul do país, é conhecido por suas praias de águas cristalinas e formações rochosas impressionantes. Mas todo o litoral português oferece belezas únicas.

## Gastronomia deliciosa

Não deixe Portugal sem experimentar:
- Pastéis de Nata
- Bacalhau (preparado de dezenas de maneiras diferentes)
- Francesinha (sanduíche típico do Porto)
- Vinhos portugueses de diversas regiões

Portugal é um destino que cativa o coração dos viajantes e constantemente os convida a retornar!
        `,
        published: false, // Este post está como rascunho
        authorId: regularUser.id,
        categoryId: categories[2].id, // Categoria Viagens
        tags: {
          connect: [
            { id: tags[5].id }, // Viagem
            { id: tags[6].id }, // Dicas
          ],
        },
      },
    }),
  ]);
  console.log('Posts criados:', posts.map(p => p.title).join(', '));

  // Criar comentários
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Excelente artigo! Estou começando a aprender NestJS e isso me ajudou muito.',
        postId: posts[0].id, // Post sobre NestJS
        authorId: regularUser.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Você poderia escrever mais sobre a estrutura de módulos do NestJS?',
        postId: posts[0].id, // Post sobre NestJS
        authorId: regularUser.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Comecei a meditar recentemente e já notei diferença na minha ansiedade!',
        postId: posts[1].id, // Post sobre meditação
        authorName: 'Visitante Anônimo',
        authorEmail: 'anonimo@email.com',
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Quais apps de meditação você recomenda para iniciantes?',
        postId: posts[1].id, // Post sobre meditação
        authorId: admin.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Angular e NestJS são uma combinação perfeita mesmo! Uso no meu trabalho.',
        postId: posts[2].id, // Post sobre Angular e NestJS
        authorName: 'Desenvolvedor Web',
        authorEmail: 'dev@email.com',
      },
    }),
  ]);
  console.log('Comentários criados:', comments.length);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });