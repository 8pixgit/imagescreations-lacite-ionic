import { AfsService, CarrierService, UserService } from '../../providers';
import { Component } from '@angular/core';
import { FileI, User } from '../../interfaces';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-carrier',
  templateUrl: 'carrier.html',
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

  public changeUser(user: User) {
    this.carrierService.loadCarrier();
    localStorage.setItem('email', user.email);
  }

  public deleteCarrier(index: number): void {
    this.carrierService.deleteCarrier(index);
  }

  public deleteFile(file: FileI, index: number) {
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
