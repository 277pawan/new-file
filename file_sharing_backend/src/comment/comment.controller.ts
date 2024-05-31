import { Controller, Post, Body, Req, Query, Get } from '@nestjs/common';
import { CommentsService } from './comment.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('fileid')
  async addComment(
    @Body('fileId') fileId: string,
    @Body('feedback') feedback: string,
    @Req() req
  ) {
    const userid = req.user.id;
    const username = req.user.username;
    const result = await this.commentsService.addComment(fileId, userid, username, feedback);
    return result;
  }

  @Get()
  async getComments(@Query('fileId') fileId: string) {
    const comments = await this.commentsService.getComments(fileId);
    return comments;
  }
}
