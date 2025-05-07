import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId?: number) {
    // Verificar se o post existe
    const postExists = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
      select: { id: true, published: true },
    });

    if (!postExists) {
      throw new NotFoundException(`Post com ID ${createCommentDto.postId} não encontrado`);
    }

    // Verificar se o post está publicado
    if (!postExists.published) {
      throw new NotFoundException(`Post com ID ${createCommentDto.postId} não encontrado`);
    }

    // Se o usuário estiver autenticado, associe o comentário ao usuário
    if (userId) {
      return this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          post: {
            connect: { id: createCommentDto.postId },
          },
          author: {
            connect: { id: userId },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    // Se o usuário não estiver autenticado, crie um comentário anônimo
    if (!createCommentDto.authorName) {
      createCommentDto.authorName = 'Anônimo';
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        authorName: createCommentDto.authorName,
        authorEmail: createCommentDto.authorEmail,
        post: {
          connect: { id: createCommentDto.postId },
        },
      },
    });
  }

  async findAll(postId: number) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
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
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number, isAdmin: boolean) {
    // Verificar se o comentário existe
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }

    // Se não for o autor (e não for admin), proibir a atualização
    if (comment.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para atualizar este comentário');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number, userId: number, isAdmin: boolean) {
    // Verificar se o comentário existe
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }

    // Se não for o autor (e não for admin), proibir a remoção
    if (comment.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para remover este comentário');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}