import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileI, Key} from '../../../shared/interfaces';
import {AfsService, CarrierService, EventService, KeysService, UserService} from '../../../shared/services';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {Platform} from '@ionic/angular';
import * as _ from 'lodash';
import {Capacitor} from '@capacitor/core';
import {Directory} from '@capacitor/filesystem';

@Component({
  selector: 'app-page-destination',
  templateUrl: 'lacite.page.html',
  styleUrls: ['lacite.page.scss'],
})

export class LacitePage implements OnInit, OnDestroy {
  win: any = window;
  documents: FileI[];
  documentsNb: { en: number; fr: number };
  documentsOpen: boolean;
  englishKeys: any[];
  keys: any[];
  photos: any[];
  private slides: any;

  constructor(
    private afsService: AfsService,
    private event: EventService,
    private fileOpener: FileOpener,
    private keysService: KeysService,
    private platform: Platform,
    public carrier: CarrierService,
    public user: UserService,
  ) {

  }

  ngOnInit() {
    this.documents = [];
    this.documentsNb = {en: 0, fr: 0};
    this.documentsOpen = false;
    this.photos = [];

    this.event.langChangedObserve().subscribe(() => {
      setTimeout(() => {
        this.loadFiles();
      });
    });
    this.loadFiles();
  }

  public setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  public slideChanged(evt): void {
    const currentIndex = this.slides.activeIndex;
    const length = this.slides.slides.length - 1;
  }

  public openDocument(event: Event, document: FileI): void {
    if (Capacitor.isNativePlatform()) {
      event.preventDefault();
      this.fileOpener.open(`${Directory.Data}${document.path}/`, 'application/pdf');
    }
  }

  public photoPressed(file: FileI): void {
    if (file.unlock) {
      this.carrier.addToCarrier(file);
    }
  }

  ngOnDestroy() {
  }


  private loadFiles(): void {

    // eslint-disable-next-line max-len
    const documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === 'lacite'), ['order', 'path'], ['asc', 'desc']);

    if (documents) {

      this.documents = _.filter(documents, (document: FileI) => document.type === 'application/pdf');
      this.documents.forEach((document: FileI) => {
        if (document.language === 'fr') {
          this.documentsNb.fr++;
        } else {
          this.documentsNb.en++;
        }
        if (document.name) {
          document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
        }
      });

      // eslint-disable-next-line max-len
      this.photos = _.filter(documents, (document: FileI) => document.type !== 'application/pdf' && ((document.lang && document.lang === this.user.lang) || !document.lang));

      this.photos.forEach(async (document: FileI) => {
        const folder = document.path.slice(0, document.path.indexOf('/'));
        const path = document.path.slice(document.path.indexOf('/') + 1);
        // @ts-ignore
        document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
      });
      console.log(this.photos);

      const filterKeys = _.filter(this.afsService.keys, (key: Key) => key.id === 'lacite');
      if (filterKeys[0]) {
        [this.keys, this.englishKeys] = this.keysService.formatKeys(filterKeys[0]);
      }

    }

  }
}
