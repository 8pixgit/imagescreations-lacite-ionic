import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { ServicesPage } from './services';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesPage),
    MaterialIconsModule,
    OrderModule,
    TranslateModule.forChild(),
  ],
})

export class ServicesPageModule { }
