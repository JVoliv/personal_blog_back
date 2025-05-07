import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma categoria com este nome');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma categoria com este nome');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
      }
      throw error;
    }
  }
}