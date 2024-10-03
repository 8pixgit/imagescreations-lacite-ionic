import {FileI} from './file.interface';

export interface Carrier {
  creationDate?: number;
  files?: FileI[];
  lock?: boolean;
  note?: string;
  title?: string;
}
