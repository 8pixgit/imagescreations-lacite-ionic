import { FullscreenSecondPage } from './fullscreenSecond';
import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    FullscreenSecondPage,
  ],
  imports: [
    IonicPageModule.forChild(FullscreenSecondPage),
    MaterialIconsModule,
  ],
})

export class FullScreenSecondPageModule { }
