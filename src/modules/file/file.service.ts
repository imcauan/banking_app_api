import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Injectable()
export class FileService {
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './storage',
        filename(req, file, callback) {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadPhoto(@UploadedFile() image: Express.Multer.File) {
    return { success: true, image: image.filename };
  }

  async getFileByFileName(fileName: string, res: Response) {
    const filePath = join(__dirname, '..', '..', 'storage', fileName);

    return res.sendFile(filePath);
  }
}
