import { FullscreenPage } from './fullscreen';
import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    FullscreenPage,
  ],
  imports: [
    IonicPageModule.forChild(FullscreenPage),
    MaterialIconsModule,
  ],
})

export class FullScreenPageModule { }
