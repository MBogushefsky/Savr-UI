import { Injectable } from '@angular/core';
import sjcl from 'sjcl';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encrypt(message: string) {
    return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(message));
  }
}