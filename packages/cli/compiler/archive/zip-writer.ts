import { deflateRaw } from 'node:zlib';
import { promisify } from 'node:util';

import { crc32 } from './crc32';

const deflateRawAsync = promisify(deflateRaw);

interface ZipEntryInput {
  name: string;
  data: Buffer;
}

interface ZipEntryRecord {
  name: string;
  nameBuffer: Buffer;
  compressed: Buffer;
  crc: number;
  uncompressedSize: number;
  compressedSize: number;
  localHeaderOffset: number;
}

const LOCAL_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const COMPRESSION_DEFLATE = 8;

export class ZipWriter {
  private readonly entries: ZipEntryInput[] = [];

  addEntry(name: string, data: Buffer): void {
    this.entries.push({
      name: name.replace(/\\/g, '/'),
      data,
    });
  }

  async finish(): Promise<Buffer> {
    const fileParts: Buffer[] = [];
    const centralParts: Buffer[] = [];
    const records: ZipEntryRecord[] = [];
    let offset = 0;

    for (const entry of this.entries) {
      const nameBuffer = Buffer.from(entry.name, 'utf8');
      const uncompressedSize = entry.data.length;
      const crc = crc32(entry.data);
      const compressed = await deflateRawAsync(entry.data);
      const compressedSize = compressed.length;

      const localHeader = Buffer.alloc(30);
      localHeader.writeUInt32LE(LOCAL_HEADER_SIGNATURE, 0);
      localHeader.writeUInt16LE(20, 4);
      localHeader.writeUInt16LE(0, 6);
      localHeader.writeUInt16LE(COMPRESSION_DEFLATE, 8);
      localHeader.writeUInt16LE(0, 10);
      localHeader.writeUInt16LE(0, 12);
      localHeader.writeUInt32LE(crc, 14);
      localHeader.writeUInt32LE(compressedSize, 18);
      localHeader.writeUInt32LE(uncompressedSize, 22);
      localHeader.writeUInt16LE(nameBuffer.length, 26);
      localHeader.writeUInt16LE(0, 28);

      records.push({
        name: entry.name,
        nameBuffer,
        compressed,
        crc,
        uncompressedSize,
        compressedSize,
        localHeaderOffset: offset,
      });

      fileParts.push(localHeader, nameBuffer, compressed);
      offset += localHeader.length + nameBuffer.length + compressed.length;
    }

    const centralDirectoryOffset = offset;

    for (const record of records) {
      const centralHeader = Buffer.alloc(46);
      centralHeader.writeUInt32LE(CENTRAL_HEADER_SIGNATURE, 0);
      centralHeader.writeUInt16LE(20, 4);
      centralHeader.writeUInt16LE(20, 6);
      centralHeader.writeUInt16LE(0, 8);
      centralHeader.writeUInt16LE(COMPRESSION_DEFLATE, 10);
      centralHeader.writeUInt16LE(0, 12);
      centralHeader.writeUInt16LE(0, 14);
      centralHeader.writeUInt32LE(record.crc, 16);
      centralHeader.writeUInt32LE(record.compressedSize, 20);
      centralHeader.writeUInt32LE(record.uncompressedSize, 24);
      centralHeader.writeUInt16LE(record.nameBuffer.length, 28);
      centralHeader.writeUInt16LE(0, 30);
      centralHeader.writeUInt16LE(0, 32);
      centralHeader.writeUInt16LE(0, 34);
      centralHeader.writeUInt16LE(0, 36);
      centralHeader.writeUInt32LE(0, 38);
      centralHeader.writeUInt32LE(record.localHeaderOffset, 42);

      centralParts.push(centralHeader, record.nameBuffer);
    }

    const centralDirectory = Buffer.concat(centralParts);
    const endOfCentralDirectory = Buffer.alloc(22);
    endOfCentralDirectory.writeUInt32LE(END_OF_CENTRAL_DIRECTORY_SIGNATURE, 0);
    endOfCentralDirectory.writeUInt16LE(0, 4);
    endOfCentralDirectory.writeUInt16LE(0, 6);
    endOfCentralDirectory.writeUInt16LE(records.length, 8);
    endOfCentralDirectory.writeUInt16LE(records.length, 10);
    endOfCentralDirectory.writeUInt32LE(centralDirectory.length, 12);
    endOfCentralDirectory.writeUInt32LE(centralDirectoryOffset, 16);
    endOfCentralDirectory.writeUInt16LE(0, 20);

    return Buffer.concat([
      ...fileParts,
      centralDirectory,
      endOfCentralDirectory,
    ]);
  }
}
