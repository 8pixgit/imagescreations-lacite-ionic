import { DestinationPage } from './destination';
import { IonicPageModule } from 'ionic-angular';
import { MapDirective, StarsDirective } from '../../directives';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { OrderModule } from 'ngx-order-pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DestinationPage,
    MapDirective,
    StarsDirective,
  ],
  imports: [
    IonicPageModule.forChild(DestinationPage),
    MaterialIconsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiamJ6Nzk3IiwiYSI6ImNqaGJ5bnVsczA5c3czNm4zcnI3ZjExbTAifQ.nGGXLdpBEGtRRo6Va3gOVw',
    }),
    OrderModule,
    TranslateModule.forChild(),
  ],
})

export class DestinationPageModule { }
