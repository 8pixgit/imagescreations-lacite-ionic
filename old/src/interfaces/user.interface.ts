import { Carrier } from './carrier.interface';

export interface User {
  carriers: Carrier[];
  email: string;
  englishRole?: string;
  firstname?: string;
  id?: string;
  lastname?: string;
  role?: string;
  tel?: string;
  uid?: string;
}
