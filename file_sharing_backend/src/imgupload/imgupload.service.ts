import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Upload, UploadDocument } from './imgupload.models';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class ImguploadService {
  constructor(@InjectModel(Upload.name) private uploadModel: Model<UploadDocument>) {}

  async saveFileInfo(userId: Types.ObjectId, fileName: string): Promise<Upload> {
    const existingUpload = await this.uploadModel.findOne({ userId });

    if (existingUpload) {
      existingUpload.images.push(fileName);
      return existingUpload.save();
    } else {
      const upload = new this.uploadModel({ userId, images: [fileName] });
      return upload.save();
    }
  }

  async getFiles(userId: Types.ObjectId): Promise<any[]> {
    const userdata = await this.uploadModel.findOne({ userId }).populate('userId').exec();
    if (userdata) {
      const filesInfo = userdata.images.map((fileName) => {
        const filePath = path.join(__dirname, '..', '..', 'upload', fileName);
        const stats = fs.statSync(filePath);
        return {
          fileName,
          size: stats.size, // File size in bytes
          type: path.extname(fileName).substring(1), // File extension
          lastModified: stats.mtime, // Last modified date
          url: `/upload/${fileName}`, // URL to access the file, adjusted to match the static file path
        };
      });

      filesInfo.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

      return filesInfo;
    } else {
      return [];
    }
  }
  async fileSearch(userId: string, query: string): Promise<any[]> {
    const user = await this.uploadModel.findOne({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const regex = new RegExp(query, 'i');
    const uploads = await this.uploadModel.find({ userId }).exec();
    const matchingImages: any[] = [];

    uploads.forEach(upload => {
      upload.images.filter(image => regex.test(image)).forEach(image => {
        const filePath = path.join(__dirname, '..', '..', 'upload', image);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          matchingImages.push({
            fileName: image,
            size: stats.size,
            type: path.extname(image).substring(1),
            lastModified: stats.mtime,
          });
        }
      });
    });

    return matchingImages;
}
async getFileData(fileName: string): Promise<any> {
  const filePath = path.join(__dirname, '..', '..', 'upload', fileName);
  const stats = fs.statSync(filePath);
  return {
    fileName: fileName,
    size: stats.size, // File size in bytes
    type: path.extname(fileName).substring(1), // File extension
    lastModified: stats.mtime, // Last modified date
    url: `/upload/${fileName}`, // URL to access the file, adjusted to match the static file path
  };
}
async deleteFile(userId: Types.ObjectId, fileName: string): Promise<void> {
  const user = await this.uploadModel.findOne({ userId });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  user.images = user.images.filter(image => image !== fileName);
  await user.save();

  const filePath = path.join(__dirname, '..', '..', 'upload', fileName);
  fs.unlinkSync(filePath);
}
async renameFile(userId: Types.ObjectId | string, oldFileName: string, newFileName: string): Promise<any> {
  const userIdStr = userId.toString();
  
  // Find the user's document
  const document = await this.uploadModel.findOne({ userId });
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  // Find the index of the old file name in the images array
  const index = document.images.findIndex((fileName) => fileName === oldFileName);
  if (index === -1) {
    throw new NotFoundException('File not found in the images array');
  }

  // Construct the file paths
  const oldFilePath = path.join(__dirname, '..', '..', 'upload', userIdStr, oldFileName);
  const newFilePath = path.join(__dirname, '..', '..', 'upload', userIdStr, newFileName);

  // Check if the old file exists
  try {
    await fs.promises.stat(oldFilePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new NotFoundException(`File ${oldFileName} not found at path ${oldFilePath}`);
    } else {
      throw new InternalServerErrorException(`Error accessing file ${oldFileName}: ${err.message}`);
    }
  }

  // Rename the file in the file system
  try {
    await fs.promises.rename(oldFilePath, newFilePath);
  } catch (err) {
    throw new InternalServerErrorException(`Error renaming file: ${err.message}`);
  }

  // Update the document in the database with the new file name
  document.images[index] = newFileName;
  await document.save();

  return { message: 'File renamed successfully' };
}

}
