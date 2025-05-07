import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user?.id; // Opcional - usuário pode não estar autenticado
    return this.commentsService.create(createCommentDto, userId);
  }

  @Get('post/:postId')
  findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.findAll(+postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.update(+id, updateCommentDto, req.user.id, req.user.isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(+id, req.user.id, req.user.isAdmin);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/:id')
  adminRemove(@Param('id') id: string) {
    // Endpoint específico para administradores removerem comentários
    return this.commentsService.remove(+id, 0, true);
  }
}