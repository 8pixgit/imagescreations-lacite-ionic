import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { ToolboxPage } from './toolbox';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ToolboxPage,
  ],
  imports: [
    IonicPageModule.forChild(ToolboxPage),
    OrderModule,
    TranslateModule.forChild(),
  ],
})
export class ToolboxPageModule { }
