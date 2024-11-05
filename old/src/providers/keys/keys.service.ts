import { Injectable } from '@angular/core';
import { Key } from '../../interfaces';

@Injectable()
export class KeysService {

  constructor() { }

  public formatKeys(res: Key): { string }[][] {
    if (res) {
      const englishKeys: { string }[] = [];
      const keys: { string }[] = [];
      if (res.englishKeys) {
        res.englishKeys.forEach((key) => {
          const keyFormat: any = {
            string: '',
          };
          const keysSplit = key.split(' ');
          if (parseInt(keysSplit[0], 0)) {
            keyFormat.number = keysSplit[0];
            keysSplit.slice(1).forEach((keySplit) => {
              keyFormat.string += ` ${keySplit}`;
            });
            englishKeys.push(keyFormat);
          } else {
            englishKeys.push({
              string: key,
            });
          }
        });
      }
      if (res.keys) {
        res.keys.forEach((key) => {
          const keyFormat: any = {
            string: '',
          };
          const keysSplit = key.split(' ');
          if (parseInt(keysSplit[0], 0)) {
            keyFormat.number = keysSplit[0];
            keysSplit.slice(1).forEach((keySplit) => {
              keyFormat.string += ` ${keySplit}`;
            });
            keys.push(keyFormat);
          } else {
            keys.push({
              string: key,
            });
          }
        });
      }
      return [keys, englishKeys];
    }
  }

}
