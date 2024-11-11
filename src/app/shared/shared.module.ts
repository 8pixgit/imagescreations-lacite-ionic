import { NgModule } from '@angular/core';
import { SwiperModule } from 'swiper/angular';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../main/components/header/header.component';
@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    TranslateModule,
    IonicModule,
    HeaderComponent,
  ],
})
export class SharedModule {}
