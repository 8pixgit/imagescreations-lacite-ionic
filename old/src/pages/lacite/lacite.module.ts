import { IonicPageModule } from 'ionic-angular';
import { LacitePage } from './lacite';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LacitePage,
  ],
  imports: [
    IonicPageModule.forChild(LacitePage),
    OrderModule,
    TranslateModule.forChild(),
  ],
})

export class LacitePageModule { }
