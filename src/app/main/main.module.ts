import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ExpandableDirective } from '../shared/directives/expandable/expandable.directive';
import { MapDirective } from '../shared/directives/map/map.directive';
import { StarsDirective } from '../shared/directives/stars/stars.directive';
import { OrderByPipe } from '../shared/pipe/orderBy';
import { SharedModule } from '../shared/shared.module';
import {
  NewcarrierModal,
  SendCarrierModal,
  SyncModal,
} from './components/modals';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { CarrierPage } from './pages/carrier/carrier.page';
import { DestinationPage } from './pages/destination/destination.page';
import { FullscreenPage } from './pages/fullscreen/fullscreen.page';
import { FullscreenSecondPage } from './pages/fullscreenSecond/fullscreenSecond.page';
import { LacitePage } from './pages/lacite/lacite.page';
import { ServicesPage } from './pages/services/services.page';
import { SpacesPage } from './pages/spaces/spaces.page';
import { ToolboxPage } from './pages/toolbox/toolbox.page';

@NgModule({
  declarations: [
    MainComponent,
    ServicesPage,
    LacitePage,
    SpacesPage,
    DestinationPage,
    FullscreenPage,
    FullscreenSecondPage,
    CarrierPage,
    ToolboxPage,
    MapDirective,
    StarsDirective,
    NewcarrierModal,
    SendCarrierModal,
    SyncModal,
    ExpandableDirective,
    OrderByPipe,
  ],
  imports: [
    SharedModule,
    MainRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken:
        'pk.eyJ1IjoiamJ6Nzk3IiwiYSI6ImNqaGJ5bnVsczA5c3czNm4zcnI3ZjExbTAifQ.nGGXLdpBEGtRRo6Va3gOVw',
    }),
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class MainModule {}
