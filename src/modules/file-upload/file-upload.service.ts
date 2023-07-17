import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_BUCKET, S3_REGION } from 'src/constants/common.constant';
import { ENV } from 'src/constants/common.constant';
import { buildBucketKey } from './file-upload.util';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}

  private getS3Client(): S3Client {
    const config: any = {
      region: S3_REGION,
    };
    const isDevelopment =
      this.configService.get('NODE_ENV') === ENV.DEVELOPMENT;

    // Doesn't need to add credentials for prod deployment because of hosting app on EC2
    if (isDevelopment) {
      config.credentials = {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      };
    }

    return new S3Client(config);
  }

  async createPresignedUrl(options?: {
    folder?: string;
    extension: string;
  }): Promise<{ key: string; url: string }> {
    const key = buildBucketKey(options);
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
