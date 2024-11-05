import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SyncModal } from './sync';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SyncModal,
  ],
  imports: [
    IonicPageModule.forChild(SyncModal),
    TranslateModule.forChild(),
  ],
})

export class SyncModalModule { }
