import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FolderStruc, FolderStrucDocument } from './folder-struc.model';

@Injectable()
export class FolderStrucService {
  constructor(@InjectModel(FolderStruc.name) private readonly folderStrucModel: Model<FolderStrucDocument>) {}

  async createFolder(data: Record<string, any>, userId: string): Promise<folderStrucModel> {
    const newFolder = new this.folderStrucModel({ data, userId });
    return newFolder.save();
  }

  // Add more methods as needed
}
