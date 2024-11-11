import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { CarrierPage } from './pages/carrier/carrier.page';
import { DestinationPage } from './pages/destination/destination.page';
import { FullscreenPage } from './pages/fullscreen/fullscreen.page';
import { FullscreenSecondPage } from './pages/fullscreenSecond/fullscreenSecond.page';
import { LacitePage } from './pages/lacite/lacite.page';
import { ServicesPage } from './pages/services/services.page';
import { SpacesPage } from './pages/spaces/spaces.page';
import { ToolboxPage } from './pages/toolbox/toolbox.page';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'destination',
        component: DestinationPage,
      },
      {
        path: 'services',
        component: ServicesPage,
      },
      {
        path: 'spaces',
        component: SpacesPage,
      },
      {
        path: 'lacite',
        component: LacitePage,
      },
      {
        path: 'fullscreen',
        component: FullscreenPage,
      },
      {
        path: 'fullscreenSecond',
        component: FullscreenSecondPage,
      },
      {
        path: 'toolbox',
        component: ToolboxPage,
      },
      {
        path: 'carrier',
        component: CarrierPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
