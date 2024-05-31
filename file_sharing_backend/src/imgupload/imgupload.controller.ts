// src/imgupload/imgupload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Query, NotFoundException, Delete, Put, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImguploadService } from './imgupload.service';
import { Upload } from './imgupload.models';

@Controller('imgupload')
export class ImguploadController {
  constructor(private readonly imguploadService: ImguploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user._id; 
    const result = await this.imguploadService.saveFileInfo(userId, file.filename);
    return result;
  }

  @Get('files')
  async getFile(@Req() req){
    const userId = req.user._id;
    const fileNames = await this.imguploadService.getFiles(userId);
    const fileUrls = fileNames.map(fileName => ({
      ...fileName,
      url: `${req.protocol}://${req.get('host')}/upload/${fileName.fileName}`
    }));
    return fileUrls;
  }
  @Get('file-search')
  async fileSearch(@Query('q') query: string, @Req() req): Promise<any[]> {
    const userId = req.user._id;
    const fileInfo = await this.imguploadService.fileSearch(userId, query);
    if (fileInfo.length > 0) {
      const fileUrl = fileInfo.map(file => ({
        ...file,
        url: `${req.protocol}://${req.get('host')}/upload/${file.fileName}`
      }));
      return fileUrl;
    } else {
      throw new NotFoundException('File not found');
    }
  }
    @Get('file-info')
    async getFileInfo(@Req() req,@Query('fileName') fileName: string) {
      const fileInfo = await this.imguploadService.getFileData(fileName);
      if (fileInfo) {
        const fileUrl = {
          ...fileInfo,
          url: `${req.protocol}://${req.get('host')}/upload/${fileInfo.fileName}`
        };
        return fileUrl;
      } else {
        throw new NotFoundException('File not found');
      }
    }
    @Delete('delete-file')
    async deleteFile(@Req() req, @Query('fileName') fileName: string): Promise<void> {
      const userId = req.user._id;
      await this.imguploadService.deleteFile(userId, fileName);
    }
    @Post('rename-file')
  async renameFile(@Req() req, @Body('oldFileName') oldFileName: string, @Body('newFileName') newFileName: string) {
    const userId = req.user._id;
    console.log(oldFileName)
    console.log(newFileName)
    const result = await this.imguploadService.renameFile(userId, oldFileName, newFileName);
    return result;
  }
}

