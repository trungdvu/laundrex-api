import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_BUCKET, S3_REGION } from 'src/constants/common.constant';
import * as uuid from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}

  private getS3Client(): S3Client {
    return new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_ACCESS_KEY_SECRET'),
      },
    });
  }

  async createPresignedUrl(
    userId: string,
    extenstion: string,
  ): Promise<{ key: string; url: string }> {
    const key = `${userId}/${uuid.v4()}.${extenstion}`;
    const client = this.getS3Client();
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    const url = await getSignedUrl(client, command, { expiresIn: 3000 });
    return { key, url };
  }

  async deleteObject(key: string) {
    const client = this.getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    return client.send(command);
  }
}
