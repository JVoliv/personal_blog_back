import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    // Configuração do módulo de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true, // Disponibiliza ConfigService em toda a aplicação
    }),
    
    // Configuração de rate limiting para proteger contra abusos
    ThrottlerModule.forRoot([{
      ttl: 60000, // Tempo de vida da janela em milissegundos (1 minuto)
      limit: 100, // Número máximo de requisições permitidas no período
    }]),
    
    // Módulo do Prisma para acesso ao banco de dados
    PrismaModule,
    
    // Módulos de funcionalidades da aplicação
    UsersModule,     // Gerenciamento de usuários
    AuthModule,      // Autenticação e autorização
    CategoriesModule, // Gerenciamento de categorias
    PostsModule,     // Gerenciamento de posts
    CommentsModule,  // Gerenciamento de comentários
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}