import * as path from 'path';

import {
  HeadBucketCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private s3Client: S3Client;
  private region: string;

  constructor(
    @Inject('S3_PICTURE_BUCKET')
    private readonly S3_PICTURE_BUCKET: string,

    @Inject('S3_KEY')
    private readonly S3_KEY: string,
    @Inject('S3_SECRET')
    private readonly S3_SECRET: string,
    @Inject('S3_ENDPOINT')
    private readonly S3_ENDPOINT: string,
    @Inject('S3_REGION')
    private readonly S3_REGION: string,
  ) {
    this.s3Client = this.getS3Client();
    // verify that the bucket exists

    this.verifyBucket();
  }

  private async verifyBucket() {
    try {
      this.logger.debug(`Verifying bucket ${this.S3_PICTURE_BUCKET}`);

      await Promise.all([
        this.s3Client.send(
          new HeadBucketCommand({ Bucket: this.S3_PICTURE_BUCKET }),
        ),
      ]);

      this.logger.debug('Buckets verification successful');
    } catch (error) {
      this.logger.error(
        `Error verifying bucket ${this.S3_PICTURE_BUCKET}`,
        error,
      );

      throw error;
    }
  }

  private getS3Client() {
    // Load environment variables
    const key = this.S3_KEY;
    const secret = this.S3_SECRET;
    const endpoint = this.S3_ENDPOINT;
    const region = this.S3_REGION;

    this.region = region;

    // Create S3 client
    const s3Config = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
      },
      forcePathStyle: endpoint.includes('localhost') ? true : false,
    });

    return s3Config;
  }

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
    accessControl: ObjectCannedACL = ObjectCannedACL.public_read,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: accessControl,
      ContentType: mimetype,
      ContentDisposition: `attachment; filename=${name.split('/').pop()}`,
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    const command = new PutObjectCommand(params);

    try {
      const s3Response = await this.s3Client.send(command);
      return s3Response;
    } catch (error) {
      this.logger.error('Error uploading file: ', error);
      throw error;
    }
  }

  public async uploadImage(buffer: Buffer, id: string) {
    const bucket = this.S3_PICTURE_BUCKET;

    const fileName =
      'images/' + path.parse(id).name.replace(/\s/g, '') + '.png';

    const mimetype = 'image/jpeg';

    await this.s3_upload(
      buffer,
      bucket,
      fileName,
      mimetype,
      ObjectCannedACL.public_read,
    );

    return this.getImageUrl(fileName);
  }
  public async getImageUrl(fileName: string) {
    const bucket = this.S3_PICTURE_BUCKET;
    const url = this.getPublicFileUrl(fileName, bucket);
    return url;
  }
  public async getPublicFileUrl(fileName: string, bucket: string) {
    const region = this.region;
    if (this.S3_ENDPOINT.includes('localhost')) {
      // minio url
      return `${this.S3_ENDPOINT}/${bucket}/${fileName}`;
    } // production blackblaze url
    else return `https://${bucket}.s3.${region}.backblazeb2.com/${fileName}`; // TODO: make possible to use custom domain
  }
}
