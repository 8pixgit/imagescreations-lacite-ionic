import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileI, Image, Key, Service, Space} from '../../../shared/interfaces';
import {AfsService, CarrierService, EventService, KeysService, UserService} from '../../../shared/services';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import * as _ from 'lodash';
import {SERVICES_CATEGORIES, SPACES_CATEGORIES} from '../../../shared/constants';
import {Capacitor} from '@capacitor/core';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page-destination',
  templateUrl: 'services.page.html',
  styleUrls: ['services.page.scss'],
})

export class ServicesPage implements OnInit, OnDestroy {
  allDocuments: FileI[];
  win: any = window;
  currentPage: string;
  documents: FileI[];
  documentsNb: { en: number; fr: number };
  documentsOpen: boolean;
  englishKeys: any[];
  keys: any[];
  photos: any[];
  servicesCategories: any[];
  spaceActivated: string;
  spaces: Space[];
  isSpace = false;
  isService = false;
  private slides: any;

  constructor(
    public afsService: AfsService,
    private event: EventService,
    private fileOpener: FileOpener,
    private keysService: KeysService,
    public carrier: CarrierService,
    public user: UserService,
    private router: Router,
  ) {
    this.photos = [];
    this.servicesCategories = [];
    this.spaces = [];
    this.isSpace = this.router.url.includes('spaces');
    this.isService = this.router.url.includes('services');
    if (this.isSpace) {
      this.initSpace();
    } else {
      this.event.tabsServicesObserve().subscribe((page) => {
        this.spaceActivated = null;
        this.spaces = [];
        if (page) {
          this.goToService(page);
        } else {
          this.currentPage = '';
          this.loadServicesCards();
        }
      });
      this.event.langChangedObserve().subscribe(lang => {
        setTimeout(() => {
          this.spaceActivated = null;
          this.loadFiles(this.currentPage);
        }, 100);
      });
    }
  }

  ionViewWillEnter() {
    this.photos = [];
    this.spaces = [];
    this.currentPage = '';

    this.isSpace = this.router.url.includes('spaces');
    if (this.isSpace) {
      this.initSpace();
    }
  }

  initSpace() {
    this.currentPage = 'ate';
    this.loadFiles(this.currentPage);

  }

  ngOnInit() {
    setTimeout(() => this.loadServicesCards());
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  public activeSpace(id: string): void {

    if (id ==='ate') {
      this.router.navigate(['/spaces']);
  }else{
    if (this.slides) {
      this.slides.slideTo(0, 500);
    }
    setTimeout(() => {
      if (this.spaceActivated === id) {
        this.spaceActivated = null;
        this.loadFiles(this.currentPage);
      } else {
        this.spaceActivated = id;
        // eslint-disable-next-line max-len
        this.photos = _.filter(this.allDocuments, (document: FileI) => document.type !== 'application/pdf' && ((document.lang !== 'null' && document.lang === this.user.lang) || (!document.lang || document.lang === 'null')) && document.category === id /*&& document.serviceCategory === this.currentPage*/);
        this.getLocalUrl();
      }
    });
  }
  }

  public goToService(page: string): void {
    this.currentPage = page;
    console.log('goToService', page);
    if (page ==='ate') {
        this.router.navigate(['/spaces']);
    }
    else {
      this.loadFiles(this.currentPage);
      this.activeSpace(page);
      this.loadServicesCards();
    }
  }

  public async openDocument(event: Event, document: FileI) {
    if (Capacitor.isNativePlatform()) {
      event.preventDefault();
      const getUriResult = await Filesystem.getUri({
        directory: Directory.Data,
        path: document.path
      });
      const path = getUriResult.uri;
      await this.fileOpener.open(path, 'application/pdf');
    }

  }

  public photoPressed(file: FileI): void {
    if (file.unlock) {
      this.carrier.addToCarrier(file);
    }
  }

  ngOnDestroy() {

  }

  public getDocument(path: string) {
    return this.afsService.getUri(path);
  }

  private loadFiles(category: string): void {

    this.allDocuments = _.orderBy(this.afsService.files, ['order', 'path'], ['asc', 'desc']);

    const documents = _.filter(this.allDocuments, (document: FileI) => document.category === category);

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

      // eslint-disable-next-line max-len
      this.photos = _.filter(documents, (document: FileI) => document.type !== 'application/pdf' && ((document.lang !== 'null' && document.lang === this.user.lang) || (!document.lang || document.lang === 'null')));

      this.spaces = [];

      // eslint-disable-next-line max-len
      const otherPhotos = _.filter(this.afsService.files, (document: FileI) => document.type !== 'application/pdf');
      otherPhotos.forEach((photo: Image) => {
        SPACES_CATEGORIES.forEach((space: Space) => {
          /*if (space.id === photo.category) {
            const isAlreadyPresent = _.findIndex(this.spaces, (o: Space) => o.id === space.id);
            if (isAlreadyPresent === -1) {
              this.spaces.push(space);
            }
          }*/
          const isAlreadyPresent = _.findIndex(this.spaces, (o: Space) => o.id === space.id);
          if (isAlreadyPresent === -1) {
            this.spaces.push(space);
          }
        });
      });
      this.photos = _.filter(this.photos, (document: Image) => !document.serviceCategory);


      this.getLocalUrl();


      const filterKeys = _.filter(this.afsService.keys, (key: Key) => key.id === category);
      if (filterKeys[0]) {
        [this.keys, this.englishKeys] = this.keysService.formatKeys(filterKeys[0]);
      }

    }
    if (this.isService){
      this.spaces = SERVICES_CATEGORIES;
    }
  }

  private getLocalUrl(): void {
    this.photos.forEach(async (document: FileI) => {
      const folder = document.path.slice(0, document.path.indexOf('/'));
      const path = document.path.slice(document.path.indexOf('/') + 1);
      // @ts-ignore
      document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
    });
  }

  private loadServicesCards(): void {
    this.servicesCategories = [];
    const services: any = _.orderBy(_.filter(SERVICES_CATEGORIES, (service: any) => service.home), ['label']);
    services.forEach((service: Service, i) => {
      setTimeout(() => this.servicesCategories.push(service), 100 * i);
    });
  }
}
