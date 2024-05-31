import { Body, Controller, Delete, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { FolderStrucService } from './folder-struc.service';
import { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('folder-struc')
export class FolderStrucController {
  constructor(private readonly folderStrucService: FolderStrucService) {}

  @Post('folder-set')
  async uploadFolder(
    @Body('folder') folder: Record<string, any>,@Req() req) {
    const userId = req.user._id;
    return this.folderStrucService.createFolder(folder, userId);
  }

  @Get('folder-get')
  async getFolder(@Req() req) {
    const userId = req.user._id;
    const folders = await this.folderStrucService.getFolderByUserId(userId);
    return folders;
  }
  @Get('folder-search')
  async searchFolder(@Req() req, @Query('folderName') folderName: string) {
    const userId = req.user._id;
    try {
      const folderData = await this.folderStrucService.findFolderByName(userId, folderName);
      const fileDetails = this.extractFileDetails(folderData, req);
      return  fileDetails ;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  private extractFileDetails(obj: Record<string, any>, req: Request): any[] {
    let values: any[] = [];

    const extract = (currentObj: Record<string, any>) => {
      for (let key in currentObj) {
        if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
          extract(currentObj[key]);
        } else {
          values.push(currentObj[key]);
        }
      }
    };

    extract(obj);

    return values.map(value => {
      if (typeof value !== 'string') {
        console.error('Invalid value encountered:', value);
        return null;
      }

      const filePath =path.join(__dirname, '..', '..', 'upload', value);
      if (!fs.existsSync(filePath)) {
        console.error('File does not exist:', filePath);
        return null;
      }

      const stats = fs.statSync(filePath);
      return {
        fileName: value,
        size: stats.size, // File size in bytes
        type: path.extname(value).substring(1), // File extension
        lastModified: stats.mtime, // Last modified date
        url: `${req.protocol}://${req.get('host')}/upload/${value}`, // URL to access the file
      };
    }).filter(file => file !== null);
  }
  @Delete('file-delete')
  async deleteFile(@Req() req, @Query('fileName') fileName: string) {
    const userId = req.user._id;
    await this.folderStrucService.removeFileFromFolder(userId, fileName);
    return { message: 'File deleted successfully' };
  }
}