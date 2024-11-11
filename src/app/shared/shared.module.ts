import { NgModule } from '@angular/core';
import { SwiperModule } from 'swiper/angular';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import {
  NewcarrierModal,
  SendCarrierModal,
  SyncModal,
} from './components/modals';
@NgModule({
  declarations: [HeaderComponent, NewcarrierModal, SendCarrierModal, SyncModal],
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
    NewcarrierModal,
    SendCarrierModal,
    SyncModal,
  ],
})
export class SharedModule {}
