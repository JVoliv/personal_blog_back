import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: number) {
    const { tags, categoryId, ...postData } = createPostDto;

    // Criar um objeto de dados tipado explicitamente
    const data: Prisma.PostCreateInput = {
      ...postData,
      author: {
        connect: { id: authorId },
      },
      category: {
        connect: { id: categoryId },
      },
    };

    // Adicionar tags se fornecidas
    if (tags && tags.length > 0) {
      data.tags = await this.processTagsForConnect(tags);
    }

    return this.prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });
  }

  async findAll(query: PostQueryDto, includeUnpublished = false) {
    const { search, categoryId, authorId, published } = query;

    // Construir a condição de filtro
    const where: any = {};

    // Filtros de busca
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtrar por publicação
    if (published !== undefined) {
      where.published = published;
    } else if (!includeUnpublished) {
      where.published = true;
    }

    // Filtrar por categoria
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filtrar por autor
    if (authorId) {
      where.authorId = authorId;
    }

    return this.prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, includeUnpublished = false) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post com ID ${id} não encontrado`);
    }

    // Verificar se o post está publicado ou se o usuário tem permissão para ver não publicados
    if (!post.published && !includeUnpublished) {
      throw new NotFoundException(`Post com ID ${id} não encontrado`);
    }

    // Incrementar o contador de visualizações
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number, isAdmin: boolean) {
    // Verificar se o post existe e se o usuário tem permissão para atualizar
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException(`Post com ID ${id} não encontrado`);
    }

    // Verificar se o usuário é o autor ou admin
    if (post.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para atualizar este post');
    }

    const { tags, categoryId, ...updateData } = updatePostDto;

    // Preparar o objeto de dados para atualização
    const data: Prisma.PostUpdateInput = {
      ...updateData,
    };

    // Adicionar categoria se fornecida
    if (categoryId) {
      data.category = {
        connect: { id: categoryId }
      };
    }

    // Processar tags se fornecidas
    if (tags && tags.length > 0) {
      data.tags = await this.processTagsForConnect(tags);
    }

    // Executar a atualização
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });
  }

  async remove(id: number, userId: number, isAdmin: boolean) {
    // Verificar se o post existe e se o usuário tem permissão para remover
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException(`Post com ID ${id} não encontrado`);
    }

    // Verificar se o usuário é o autor ou admin
    if (post.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para remover este post');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  // Método auxiliar para processar tags
  private async processTagsForConnect(tags: string[]) {
    // Criar lista de operações connect/create para as tags
    const tagsData = tags.map((tagName) => ({
      where: { name: tagName.trim() },
      create: { name: tagName.trim() },
    }));

    return {
      connectOrCreate: tagsData,
    };
  }
}