import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';

import {AfsService, CarrierService, EventService, KeysService, UserService} from './shared/services';
import {CommonModule} from '@angular/common';
import {AuthGuard} from './shared/guards/auth.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {LoadGuard} from './shared/guards/load.guard';
import {OrderByPipe} from "./shared/pipe/orderBy";


// eslint-disable-next-line @typescript-eslint/naming-convention
export const HttpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http);
const configFire = {
  apiKey: "AIzaSyCQvVPZy7uLyc7iVTyJwtmavbeqOEGXZ1E",
  authDomain: "la-cite-e6908.firebaseapp.com",
  databaseURL: "https://la-cite-e6908.firebaseio.com",
  projectId: "la-cite-e6908",
  storageBucket: "la-cite-e6908.appspot.com",
  messagingSenderId: "280747774387",
  appId: "1:280747774387:web:9e4c38a5582f0e9589fbc6"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularFireModule.initializeApp(configFire),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    FileOpener,
    CarrierService,
    EventService,
    AfsService,
    KeysService,
    UserService,
    AuthGuard,
    LoadGuard,
    OrderByPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

/*{
  apiKey: 'AIzaSyAwCWYIb-H5Kf1Djisq5sDSQopgAI5P6l4',
    authDomain: 'la-lacite-e6908.firebaseapp.com',
  databaseURL: 'https://la-cite-e6908.firebaseio.com',
  messagingSenderId: '280747774387',
  projectId: 'la-lacite-e6908',
  storageBucket: 'la-lacite-e6908.appspot.com',
}*/
