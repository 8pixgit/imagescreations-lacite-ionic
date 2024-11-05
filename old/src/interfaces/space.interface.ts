import { Service } from './service.interface';

export interface Space {
  englishLabel?: string;
  id: string;
  keys?: string;
  label?: string;
  services?: Service[];
  title?: string;
}
