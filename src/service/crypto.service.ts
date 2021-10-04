import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto-js';

@Injectable()
export class CryptoService {
  constructor(private configService: ConfigService) {}

  encryptData(data: string): string {
    return crypto.AES.encrypt(
      data,
      this.configService.get('cryptoSecret'),
    ).toString();
  }

  decryptData(data: string): string {
    return crypto.AES.decrypt(
      data,
      this.configService.get('cryptoSecret'),
    ).toString(crypto.enc.Utf8);
  }
}
