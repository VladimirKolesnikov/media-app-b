import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucketName = 'media';

  constructor() {
    this.s3 = new S3Client({
      endpoint: "http://localhost:9000",
      region: "us-east-1",
      credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin",
      },
      forcePathStyle: true,
    })
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).slice(1);
    const newFilename = `${uuidv4()}.${ext}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: newFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return newFilename;
  }

  async remove(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    )
  }
}
