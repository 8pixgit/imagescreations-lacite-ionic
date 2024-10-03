import {Component} from '@angular/core';
import {AfsService, CarrierService, UserService} from '../../../shared/services';
import {FileI, User} from '../../../shared/interfaces';


@Component({
  selector: 'app-page-carrier',
  templateUrl: 'carrier.page.html',
  styleUrls: ['carrier.page.scss'],
})

export class CarrierPage {

  public limitNb: number;

  constructor(
    public afsService: AfsService,
    public carrierService: CarrierService,
    public user: UserService,
  ) {
    this.limitNb = 4;
  }

  public changeUser(user: any) {
    this.carrierService.loadCarrier();
    localStorage.setItem('email', user.email);
  }

  public deleteCarrier(index: number): void {
    this.carrierService.deleteCarrier(index);
  }

  public deleteFile(file: any, index: number) {
    this.carrierService.deleteFile(file.path, index);
  }

  public editCarrier(index: number): void {
    this.carrierService.editCarrier(index);
  }

  public loadMore(): void {
    this.limitNb += 4;
  }

  public lockCarrier(index: number): void {
    this.carrierService.lockCarrier(index);
  }

  public sendCarrier(index: number): void {
    this.carrierService.sendCarrier(index);
  }
}
