import { IonicPageModule } from 'ionic-angular';
import { NewcarrierModal } from './newcarrier';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NewcarrierModal,
  ],
  imports: [
    IonicPageModule.forChild(NewcarrierModal),
    TranslateModule.forChild(),
  ],
})

export class NewcarrierModalModule { }
