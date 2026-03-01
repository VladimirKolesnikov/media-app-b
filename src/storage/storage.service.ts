import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucketName = 'media';

  constructor() {
    this.s3 = new S3Client({
      // endpoint: 'http://minio:9000',
      // endpoint: 'http://localhost:9000',
      endpoint: 'http://host.docker.internal:9000',
      region: "us-east-1",
      credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin",
      },
      forcePathStyle: true,
    })
  }

  async upload(file: Express.Multer.File, key: string): Promise<void> {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err) {
      console.error('S3 Upload failed:', err);
      throw new ServiceUnavailableException(
        'File storage service is temporarily unavailable',
      );
    }
  }

  async generateVideoUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(
      this.s3, 
      command, 
      { expiresIn: 6000 }
    );

    return presignedUrl;
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
