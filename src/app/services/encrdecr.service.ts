import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment as env } from '@environments/environment';


var keySize = 256;
var ivSize = 128;
var iterations = 100;
var password = env.encryptionKey;

@Injectable({
  providedIn: 'root'
})

export class EncrDecrService {

  constructor() {
  }
  //The set method is use for encrypt the value.
  set(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    console.log('set');
    console.log(key);
    console.log(iv);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    console.log(encrypted.toString());
    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var cipher = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(value));

    console.log('get');
    console.log(key);
    console.log(iv);
    console.log(value);
    var decrypted = CryptoJS.AES.decrypt(cipher, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    //var decrypted = CryptoJS.AES.decrypt(cipher, key, {
    //  keySize: 128 / 8,
    //  iv: iv,
    //  mode: CryptoJS.mode.CBC,
    //  padding: CryptoJS.pad.Pkcs7
    //});
    console.log(decrypted.toString(CryptoJS.enc.Utf8));
    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  encrypt(msg) {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);

    var key = CryptoJS.PBKDF2(password, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    });

    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
  }

  decrypt(transitmessage) {
    var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);

    var key = CryptoJS.PBKDF2(password, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    })
    return decrypted;
  }
}
