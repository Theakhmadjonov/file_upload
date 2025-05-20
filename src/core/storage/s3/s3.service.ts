import { HttpException, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as generateUuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  constructor(private config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY') as string,
        secretAccessKey: this.config.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
    this.bucketName = this.config.get<string>('AWS_BUCKET') as string;
  }

  async uploadFile(file: Express.Multer.File, prefix: string) {
    try {
      const fileName = `${prefix}/${generateUuid()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Body: file.buffer,
        Key: fileName,
        ContentType: file.mimetype,
      });
      const response = await this.s3Client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        const getCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          ResponseContentDisposition: `attachment: filename=${encodeURIComponent(file.originalname)}`,
        });
        const url = await getSignedUrl(this.s3Client, getCommand);
        return url;
      }
    } catch (error) {
      throw new HttpException(error, error.$metadata.httpStatusCode);
    }
  }
}
