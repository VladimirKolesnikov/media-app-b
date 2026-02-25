import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

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

  async upload(file: Express.Multer.File, key: string): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  }

  async downloadAsBuffer(key: string): Promise<Buffer<ArrayBuffer>> {
    const result: GetObjectCommandOutput = await this.s3.send(new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    }))

    if (!result.Body) {
      throw new Error();
    }

    const buffer = Buffer.from(
      await result.Body.transformToByteArray()
    )

    return buffer;
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
