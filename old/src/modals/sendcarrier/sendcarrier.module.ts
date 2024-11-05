import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';
import { SendcarrierModal } from './sendcarrier';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendcarrierModal,
  ],
  imports: [
    IonicPageModule.forChild(SendcarrierModal),
    MaterialIconsModule,
    TranslateModule.forChild(),
  ],
})

export class SendcarrierModalModule { }
