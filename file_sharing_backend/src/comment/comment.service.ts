import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { View, ViewDocument } from './comment.model';
import { CommentDocument } from './comment.model2';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(View.name) private readonly viewModel: Model<ViewDocument>,
  ) {}

  async addComment(fileId: string, userid: string, username: string, feedback: string): Promise<{ message: string }> {
    let view = await this.viewModel.findOne({ fileId }).exec();
    
    if (!view) {

      view = new this.viewModel({ fileId, comments: [{ userid, username, feedback }] });
    } else {
      const existingComment = view.comments.find(comment => comment.userid === userid && comment.feedback === feedback);
      if (existingComment) {
        return { message: 'Duplicate comment' };
      }
      
      view.comments.push({ userid, username, feedback });
    }
    
    await view.save();

    return { message: 'Comment added successfully' };
  }
   async getComments(fileId: string): Promise<ViewDocument> {
    const view = await this.viewModel.findOne({ fileId }).exec();
    if (!view) {
      throw new NotFoundException('File not found');
    }
    return view;
  }
}
