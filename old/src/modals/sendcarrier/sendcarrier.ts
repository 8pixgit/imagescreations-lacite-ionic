import { AfsService, UserService } from '../../providers';
import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-sendcarrier',
  templateUrl: 'sendcarrier.html',
})

export class SendcarrierModal {

  public cc: string;
  public message: string;
  public recipients: string[];

  constructor(
    private translate: TranslateService,
    private viewCtrl: ViewController,
    public afsService: AfsService,
    public user: UserService,
  ) {
    this.cc = '';
    this.message = this.translate.instant('SEND_MESSAGE');
    this.recipients = [''];
  }

  public addRecipient(): void {
    this.recipients.push('');
  }

  public create(): void {
    this.viewCtrl.dismiss({
      cc: this.cc,
      message: this.message,
      recipients: this.recipients,
    });
  }

  public trackByFn(index: number): number {
    return index;
  }

}
