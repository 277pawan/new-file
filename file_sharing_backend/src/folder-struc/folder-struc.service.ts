import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FolderStruc, FolderStrucDocument } from './folder-struc.model';

@Injectable()
export class FolderStrucService {
  constructor(
    @InjectModel(FolderStruc.name) private readonly folderStrucModel: Model<FolderStrucDocument>
  ) {}

  async createFolder(folder: Record<string, any>, userId: string): Promise<FolderStruc> {
    const updatedFolder = await this.folderStrucModel.findOneAndUpdate(
      { userId },
      { $set: { folder: folder } },
      { new: true, upsert: true }
    ).exec();
    return updatedFolder;
  }

  async getFolderByUserId(userId: string): Promise<Record<string, any> | null> {
    const folderdata = await this.folderStrucModel.findOne({ userId }).exec()
    if (!folderdata) {
      return null;
    }
    return folderdata.folder;
  }
  async findFolderByName(userId: string, folderName: string): Promise<Record<string, any> | any[]> {
    const folderData = await this.getFolderByUserId(userId);
    if (!folderData) {
      throw new NotFoundException('User folder structure not found');
    }
  
    const searchFolder = (obj: Record<string, any>, target: string): any => {
      for (let key in obj) {
        if (key === target) {
          return obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const result = searchFolder(obj[key], target);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
  
    const foundFolder = searchFolder(folderData, folderName);
    if (!foundFolder) {
      throw new NotFoundException(`Folder "${folderName}" not found`);
    }
  
    const hasKeyValuePairs = (obj: Record<string, any>): boolean => {
      return Object.keys(obj).some(key => typeof obj[key] !== 'object' || obj[key] === null);
    };
  
    if (typeof foundFolder === 'object' && foundFolder !== null) {
      if (Object.keys(foundFolder).length === 0 || !hasKeyValuePairs(foundFolder)) {
        return [];
      }
      return foundFolder;
    }
  
    return foundFolder;
  }
  async removeFileFromFolder(userId: string, fileName: string): Promise<void> {
    const folderData = await this.getFolderByUserId(userId);
    if (!folderData) {
      throw new NotFoundException('User folder structure not found');
    }

    const updatedFolder = this.removeFileFromFolderData(folderData, fileName);
    await this.folderStrucModel.updateOne({ userId }, { $set: { folder: updatedFolder } }).exec();
  }

  private removeFileFromFolderData(folderData: Record<string, any>, fileName: string): Record<string, any> {
    const removeFile = (currentObj: Record<string, any>): void => {
      for (let key in currentObj) {
        if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
          removeFile(currentObj[key]);
        } else if (currentObj[key] === fileName) {
          delete currentObj[key];
        }
      }
    };

    removeFile(folderData);
    return folderData;
  }
}  
