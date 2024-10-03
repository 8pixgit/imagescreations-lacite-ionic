import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileI, Key} from '../../../shared/interfaces';
import {AfsService, CarrierService, EventService, KeysService, UserService} from '../../../shared/services';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {Platform} from '@ionic/angular';
import * as _ from 'lodash';
import {Capacitor} from '@capacitor/core';
import {Directory} from '@capacitor/filesystem';

@Component({
  selector: 'app-page-destination',
  templateUrl: 'destination.page.html',
  styleUrls: ['destination.page.scss'],
})

export class DestinationPage implements OnInit, OnDestroy {
  videoElement2: HTMLVideoElement;
  win: any = window;
  currentPage: string;
  documents: FileI[];
  documentsNb: { en: number; fr: number };
  documentsOpen: boolean;
  englishKeys: any[];
  keys: any[];
  mapOption: string;
  photos: any[];
  showVideo: boolean;
  private slides: any;
  @ViewChild('video1') private video1: ElementRef;
  @ViewChild('video2') private video2: ElementRef;

  constructor(private afsService: AfsService,
              private event: EventService,
              private fileOpener: FileOpener,
              private keysService: KeysService,
              private platform: Platform,
              public carrier: CarrierService,
              public user: UserService) {

  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  ngOnInit() {
    this.init();
  }

  ionViewDidEnter() {
    this.showVideo = false;
    if (this.currentPage === 'accessibility') {
      this.videoElement2 = this.video2.nativeElement;
      this.videoElement2.play().then(() => {
        this.showVideo = true;
      });
    }
    if (this.currentPage === '') {
      this.init();
    }
  }

  public goToMap(page: string): void {
    this.mapOption = page;
    this.goToOtherPage('Map');
  }

  public goToOtherPage(page: string): void {
    this.showVideo = false;
    if (this.slides) {
      this.slides.slideTo(0, 500);
    }
    setTimeout(() => {
      this.currentPage = this.currentPage === page ? 'destination_gallery' : page;
      if (page !== 'Map') {
        this.loadFiles(this.currentPage);
      }
      if (this.currentPage === 'accessibility') {
        setTimeout(() => {
          this.videoElement2 = this.video2.nativeElement;
          this.videoElement2.play().then(() => {
            this.showVideo = true;
          });
        });
      }
    });
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

  public slideChanged(evt): void {
    const currentIndex = this.slides.activeIndex;
    const length = this.slides.slides.length - 1;
    if (this.video1) {
      const videoElement1 = this.video1.nativeElement;
      if (currentIndex === length && this.currentPage === 'charter') {
        videoElement1.play();
      } else {
        videoElement1.pause();
      }
    }
  }

  ngOnDestroy() {

  }

  private init() {
    this.currentPage = 'destination_gallery';
    this.documents = [];
    this.documentsNb = {en: 0, fr: 0};
    this.documentsOpen = false;
    this.mapOption = '';
    this.photos = [];

    this.event.langChangedObserve().subscribe(() => setTimeout(() => this.loadFiles(this.currentPage)));

    this.loadFiles('destination_gallery');
  }

  private loadFiles(category: string): void {

    // eslint-disable-next-line max-len
    const documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === category), ['order', 'path'], ['asc', 'desc']);

    if (documents) {

      this.documentsNb = {en: 0, fr: 0};

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

      this.photos = _.filter(documents, (document: FileI) =>
        // eslint-disable-next-line max-len
        document.type !== 'application/pdf' && ((document.lang !== 'null' && document.lang === this.user.lang) || (!document.lang || document.lang === 'null'))
      );

      this.photos.forEach(async (document: FileI) => {
        const folder = document.path.slice(0, document.path.indexOf('/'));
        const path = document.path.slice(document.path.indexOf('/') + 1);
        // @ts-ignore
        document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
      });

      const filterKeys = _.filter(this.afsService.keys, (key: Key) => key.id === category);
      if (filterKeys[0]) {
        [this.keys, this.englishKeys] = this.keysService.formatKeys(filterKeys[0]);
      }

    }

  }
}
