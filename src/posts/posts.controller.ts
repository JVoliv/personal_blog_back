import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: PostQueryDto, @Request() req) {
    // Verificar se o usuário está autenticado e é admin
    const isAuthenticated = req.user && (req.user.isAdmin || req.user.id);
    return this.postsService.findAll(query, isAuthenticated);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // Verificar se o usuário está autenticado e é admin ou autor
    const isAuthenticated = req.user && (req.user.isAdmin || req.user.id);
    return this.postsService.findOne(+id, isAuthenticated);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(+id, updatePostDto, req.user.id, req.user.isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(+id, req.user.id, req.user.isAdmin);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all')
  findAllAdmin() {
    // Endpoint específico para administradores que retorna todos os posts, incluindo não publicados
    return this.postsService.findAll({}, true);
  }
}