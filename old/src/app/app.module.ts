import fr from '@angular/common/locales/fr';
import { AfsService } from '../providers/files/files.service';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { CarrierService } from '../providers/carrier/carrier.service';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { KeysService } from '../providers/keys/keys.service';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { NewcarrierModalModule } from '../modals/newcarrier/newcarrier.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SendcarrierModalModule } from '../modals/sendcarrier/sendcarrier.module';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SyncModalModule } from '../modals/sync/sync.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserService } from '../providers/user/user.service';
import { registerLocaleData } from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(fr);

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyAwCWYIb-H5Kf1Djisq5sDSQopgAI5P6l4',
      authDomain: 'la-cite-e6908.firebaseapp.com',
      databaseURL: 'https://la-cite-e6908.firebaseio.com',
      messagingSenderId: '280747774387',
      projectId: 'la-cite-e6908',
      storageBucket: 'la-cite-e6908.appspot.com',
    }),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    MaterialIconsModule,
    NewcarrierModalModule,
    SendcarrierModalModule,
    SyncModalModule,
    TranslateModule.forRoot({
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
      },
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    AfsService,
    AndroidFullScreen,
    CarrierService,
    File,
    FileOpener,
    FileTransfer,
    Keyboard,
    KeysService,
    Network,
    ScreenOrientation,
    SplashScreen,
    StatusBar,
    UserService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
})
export class AppModule { }
