import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePage} from './pages/home/home.page';
import {MainComponent} from './main.component';
import {DestinationPage} from './pages/destination/destination.page';
import {ServicesPage} from './pages/services/services.page';
import {LacitePage} from './pages/lacite/lacite.page';
import {FullscreenPage} from './pages/fullscreen/fullscreen.page';
import {FullscreenSecondPage} from './pages/fullscreenSecond/fullscreenSecond.page';
import {CarrierPage} from './pages/carrier/carrier.page';
import {ToolboxPage} from './pages/toolbox/toolbox.page';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'destination',
        component: DestinationPage
      },
      {
        path: 'services',
        component: ServicesPage
      },
      {
        path: 'spaces',
        component: ServicesPage
      },
      {
        path: 'lacite',
        component: LacitePage
      },
      {
        path: 'fullscreen',
        component: FullscreenPage
      },
      {
        path: 'fullscreenSecond',
        component: FullscreenSecondPage
      },
      {
        path: 'toolbox',
        component: ToolboxPage
      },
      {
        path: 'carrier',
        component: CarrierPage
      },
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
