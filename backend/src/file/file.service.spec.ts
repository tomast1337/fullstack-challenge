import {
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from './file.service';

jest.mock('@aws-sdk/client-s3', () => {
  const mS3Client = {
    send: jest.fn(),
  };

  return {
    S3Client: jest.fn(() => mS3Client),
    GetObjectCommand: jest.fn(),
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
          provide: 'S3_BUCKET_THUMBS',
          useValue: 'test-bucket-thumbs',
        },
        {
          provide: 'S3_BUCKET_SONGS',
          useValue: 'test-bucket-songs',
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
    it('should verify the buckets successfully', async () => {
      (s3Client.send as jest.Mock).mockResolvedValueOnce({});
      (s3Client.send as jest.Mock).mockResolvedValueOnce({});

      await fileService['verifyBucket']();

      expect(s3Client.send).toHaveBeenCalledWith(expect.any(HeadBucketCommand));
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(HeadBucketCommand));
    });

    it('should log an error if bucket verification fails', async () => {
      const error = new Error('Bucket not found');
      (s3Client.send as jest.Mock).mockRejectedValueOnce(error);

      await expect(fileService['verifyBucket']()).rejects.toThrow(error);
    });
  });

  it('should upload a song', async () => {
    const buffer = Buffer.from('test');
    const publicId = 'test-id';
    const mockResponse = { ETag: 'mock-etag' };
    (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fileService.uploadSong(buffer, publicId);
    expect(result).toBe('songs/test-id.nbs');
    expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should throw an error if song upload fails', async () => {
    const buffer = Buffer.from('test');
    const publicId = 'test-id';

    (s3Client.send as jest.Mock).mockRejectedValueOnce(
      new Error('Upload failed'),
    );

    await expect(fileService.uploadSong(buffer, publicId)).rejects.toThrow(
      'Upload failed',
    );
  });

  it('should get a signed URL for a song download', async () => {
    const key = 'test-key';
    const filename = 'test-file.nbs';
    const mockUrl = 'https://mock-signed-url';
    (getSignedUrl as jest.Mock).mockResolvedValueOnce(mockUrl);

    const result = await fileService.getSongDownloadUrl(key, filename);
    expect(result).toBe(mockUrl);

    expect(getSignedUrl).toHaveBeenCalledWith(
      s3Client,
      expect.any(GetObjectCommand),
      { expiresIn: 120 },
    );
  });

  it('should throw an error if signed URL generation fails', async () => {
    const key = 'test-key';
    const filename = 'test-file.nbs';

    (getSignedUrl as jest.Mock).mockRejectedValueOnce(
      new Error('Signed URL generation failed'),
    );

    await expect(fileService.getSongDownloadUrl(key, filename)).rejects.toThrow(
      'Signed URL generation failed',
    );
  });

  it('should upload a thumbnail', async () => {
    const buffer = Buffer.from('test');
    const publicId = 'test-id';
    const mockResponse = { ETag: 'mock-etag' };
    (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fileService.uploadThumbnail(buffer, publicId);

    expect(result).toBe(
      'https://test-bucket-thumbs.s3.test-region.backblazeb2.com/thumbs/test-id.png',
    );

    expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should delete a song', async () => {
    const nbsFileUrl = 'test-file.nbs';
    const mockResponse = {};
    (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    await fileService.deleteSong(nbsFileUrl);
    expect(s3Client.send).toHaveBeenCalledWith(expect.any(GetObjectCommand));
  });

  it('should throw an error if song deletion fails', async () => {
    const nbsFileUrl = 'test-file.nbs';

    (s3Client.send as jest.Mock).mockRejectedValueOnce(
      new Error('Deletion failed'),
    );

    await expect(fileService.deleteSong(nbsFileUrl)).rejects.toThrow(
      'Deletion failed',
    );
  });

  it('should get a song file', async () => {
    const nbsFileUrl = 'test-file.nbs';

    const mockResponse = {
      Body: {
        transformToByteArray: jest
          .fn()
          .mockResolvedValueOnce(new Uint8Array([1, 2, 3])),
      },
    };

    (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fileService.getSongFile(nbsFileUrl);
    expect(result).toEqual(new Uint8Array([1, 2, 3]).buffer);
    expect(s3Client.send).toHaveBeenCalledWith(expect.any(GetObjectCommand));
  });

  it('should throw an error if song file retrieval fails', async () => {
    const nbsFileUrl = 'test-file.nbs';

    (s3Client.send as jest.Mock).mockRejectedValueOnce(
      new Error('Retrieval failed'),
    );

    await expect(fileService.getSongFile(nbsFileUrl)).rejects.toThrow(
      'Retrieval failed',
    );
  });

  it('should throw an error if song file is empty', async () => {
    const nbsFileUrl = 'test-file.nbs';

    const mockResponse = {
      Body: {
        transformToByteArray: jest.fn().mockResolvedValueOnce(null),
      },
    };

    (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    await expect(fileService.getSongFile(nbsFileUrl)).rejects.toThrow(
      'Error getting file',
    );
  });

  it('should get upload a packed song', async () => {
    const buffer = Buffer.from('test');
    const publicId = 'test-id';
    const mockResponse = { ETag: 'mock-etag' };
    (s3Client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fileService.uploadPackedSong(buffer, publicId);
    expect(result).toBe('packed/test-id.zip');
    expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });
});
