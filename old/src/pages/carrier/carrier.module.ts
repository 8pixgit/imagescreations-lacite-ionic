import { CarrierPage } from './carrier';
import { ExpandableDirective } from '../../directives';
import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CarrierPage,
    ExpandableDirective,
  ],
  imports: [
    IonicPageModule.forChild(CarrierPage),
    MaterialIconsModule,
    TranslateModule.forChild(),
  ],
})

export class CarrierPageModule { }
