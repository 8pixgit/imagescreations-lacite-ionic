import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {MainComponent} from './main.component';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {HomePage} from './pages/home/home.page';
import {MainRoutingModule} from './main-routing.module';
import {ServicesPage} from './pages/services/services.page';
import {LacitePage} from './pages/lacite/lacite.page';
import {SpacesPage} from './pages/spaces/spaces.page';
import {DestinationPage} from './pages/destination/destination.page';
import {SwiperModule} from 'swiper/angular';
import {MapDirective} from '../shared/directives/map/map.directive';
import {StarsDirective} from '../shared/directives/stars/stars.directive';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {HeaderComponent} from './components/header/header.component';
import {FullscreenPage} from './pages/fullscreen/fullscreen.page';
import {FullscreenSecondPage} from './pages/fullscreenSecond/fullscreenSecond.page';
import {CarrierPage} from './pages/carrier/carrier.page';
import {ToolboxPage} from './pages/toolbox/toolbox.page';
import {NewcarrierModal, SendCarrierModal, SyncModal} from './components/modals';
import {FormsModule} from '@angular/forms';
import {ExpandableDirective} from "../shared/directives/expandable/expandable.directive";
import {OrderByPipe} from "../shared/pipe/orderBy";

@NgModule({
  declarations: [
    MainComponent,
    HomePage,
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
    HeaderComponent,
    NewcarrierModal,
    SendCarrierModal,
    SyncModal,
    ExpandableDirective,
    OrderByPipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    MainRoutingModule,
    SwiperModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiamJ6Nzk3IiwiYSI6ImNqaGJ5bnVsczA5c3czNm4zcnI3ZjExbTAifQ.nGGXLdpBEGtRRo6Va3gOVw',
    }),
    FormsModule,
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule {
}
