import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
      },
    });
  }

  async putObject(
    bucketName: string,
    key: string,
    body: PutObjectCommandInput['Body'],
    contentType?: string,
  ): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    try {
      return this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Error putting an object in S3: ${error}`);
      throw error;
    }
  }

  async listObjects(
    bucketName: string,
    prefix?: string,
  ): Promise<ListObjectsCommandOutput> {
    const command = new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: prefix,
    });

    try {
      return this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Error listing objects in S3: ${error}`);
      throw error;
    }
  }

  async getObject(bucketName: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      return this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Error getting an object from S3: ${error}`);
      throw error;
    }
  }

  async removeObject(bucketName: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      return this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Error removing an object from S3: ${error}`);
      throw error;
    }
  }
}
