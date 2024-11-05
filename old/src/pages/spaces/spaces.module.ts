import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { SpacesPage } from './spaces';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpacesPage,
  ],
  imports: [
    IonicPageModule.forChild(SpacesPage),
    MaterialIconsModule,
    OrderModule,
    TranslateModule.forChild(),
  ],
})

export class SpacesPageModule { }
