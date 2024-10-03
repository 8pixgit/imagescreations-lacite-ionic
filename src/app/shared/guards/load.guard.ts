import {Injectable} from '@angular/core';
import { Route } from '@angular/router';
import {AfsService} from '../services';

@Injectable()
export class LoadGuard  {
  constructor(private afsService: AfsService) {
  }

  canLoad(route: Route): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.afsService.loadAfs();
      resolve(true);
    });
  }
}
