import {
  HeadBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from './file.service';

jest.mock('@aws-sdk/client-s3', () => {
  const mS3Client = {
    send: jest.fn(),
  };

  return {
    S3Client: jest.fn(() => mS3Client),
    GetObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    PutObjectCommand: jest.fn(),
    HeadBucketCommand: jest.fn(),
    ObjectCannedACL: {
      private: 'private',
      public_read: 'public-read',
    },
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('FileService', () => {
  let fileService: FileService;
  let s3Client: S3Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: 'S3_PICTURE_BUCKET',
          useValue: 'test-bucket',
        },
        {
          provide: 'S3_KEY',
          useValue: 'test-key',
        },
        {
          provide: 'S3_SECRET',
          useValue: 'test-secret',
        },
        {
          provide: 'S3_ENDPOINT',
          useValue: 'test-endpoint',
        },
        {
          provide: 'S3_REGION',
          useValue: 'test-region',
        },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    s3Client = new S3Client({});
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('verifyBucket', () => {
    it('should verify the bucket successfully', async () => {
      (s3Client.send as jest.Mock).mockResolvedValueOnce({});

      await fileService['verifyBucket']();

      expect(s3Client.send).toHaveBeenCalledWith(expect.any(HeadBucketCommand));
    });

    it('should log an error if bucket verification fails', async () => {
      const error = new Error('Bucket not found');
      (s3Client.send as jest.Mock).mockRejectedValueOnce(error);

      await expect(fileService['verifyBucket']()).rejects.toThrow(error);
    });
  });

  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const buffer = Buffer.from('test');
      const id = 'test-id';
      const mockResponse = { ETag: 'mock-etag' };
      (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fileService.uploadImage(buffer, id);
      expect(result).toBe(
        'https://test-bucket.s3.test-region.backblazeb2.com/images/test-id.png',
      );
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    });

    it('should throw an error if image upload fails', async () => {
      const buffer = Buffer.from('test');
      const id = 'test-id';

      (s3Client.send as jest.Mock).mockRejectedValueOnce(
        new Error('Upload failed'),
      );

      await expect(fileService.uploadImage(buffer, id)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      const pictureUrl =
        'https://test-bucket.s3.test-region.backblazeb2.com/images/test-id.png';
      const mockResponse = {};
      (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

      await fileService.deleteImage(pictureUrl);
      expect(s3Client.send).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand),
      );
    });

    it('should throw an error if image deletion fails', async () => {
      const pictureUrl =
        'https://test-bucket.s3.test-region.backblazeb2.com/images/test-id.png';

      (s3Client.send as jest.Mock).mockRejectedValueOnce(
        new Error('Deletion failed'),
      );

      await expect(fileService.deleteImage(pictureUrl)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });

  describe('getImageUrl', () => {
    it('should return the correct image URL', async () => {
      const fileName = 'images/test-id.png';
      const result = await fileService.getImageUrl(fileName);
      expect(result).toBe(
        'https://test-bucket.s3.test-region.backblazeb2.com/images/test-id.png',
      );
    });
  });
});
