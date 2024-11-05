import * as _ from 'lodash';
import { AfsService, CarrierService, KeysService, UserService } from '../../providers';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, Platform, Slides } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileI, Image, Key, Service, Space } from '../../interfaces';
import { FileOpener } from '@ionic-native/file-opener';
import { SERVICES_CATEGORIES, SPACES_CATEGORIES } from '../../app/constants';

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})

export class ServicesPage {

  @ViewChild(Slides) private slides: Slides;
  private allDocuments: FileI[];
  private win: any = window;
  public currentPage: string;
  public documents: FileI[];
  public documentsNb: { en: number, fr: number };
  public documentsOpen: boolean;
  public englishKeys: { string }[];
  public keys: { string }[];
  public photos: Image[];
  public servicesCategories: any[];
  public spaceActivated: string;
  public spaces: Space[];

  constructor(
    private afsService: AfsService,
    private event: Events,
    private file: File,
    private fileOpener: FileOpener,
    private keysService: KeysService,
    private platform: Platform,
    public carrier: CarrierService,
    public user: UserService,
  ) {

    this.photos = [];
    this.servicesCategories = [];
    this.spaces = [];

    this.event.subscribe('tabs:services', (page: string) => {
      this.spaceActivated = null;
      this.spaces = [];
      if (page) {
        this.goToService(page);
      } else {
        this.currentPage = '';
        this.loadServicesCards();
      }
    });

    this.event.subscribe('lang:changed', () => {
      setTimeout(() => {
        this.spaceActivated = null;
        this.loadFiles(this.currentPage);
      },         100);
    });

  }

  ngOnInit() {
    setTimeout(() => this.loadServicesCards());
  }

  private loadFiles(category: string): void {

    this.allDocuments = _.orderBy(this.afsService.files, ['order', 'path'], ['asc', 'desc']);

    const documents = _.filter(this.allDocuments, (document: FileI) => {
      return document.category === category;
    });

    if (documents) {

      this.documentsNb = { en: 0, fr: 0 };

      this.documents = _.filter(documents, (document: FileI) => {
        return document.type === 'application/pdf';
      });
      this.documents.forEach((document: FileI) => {
        if (document.language === 'fr') this.documentsNb.fr++;
        else this.documentsNb.en++;
        if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
      });

      this.photos = _.filter(documents, (document: FileI) => {
        return document.type !== 'application/pdf' && ((document.lang !== 'null' && document.lang === this.user.lang) || (!document.lang || document.lang === 'null'));
      });

      this.spaces = [];

      const otherPhotos = _.filter(this.afsService.files, (document: FileI) => {
        return document.type !== 'application/pdf' && document.serviceCategory === category;
      });
      otherPhotos.forEach((photo: Image) => {
        SPACES_CATEGORIES.forEach((space: Space) => {
          if (space.id === photo.category) {
            const isAlreadyPresent = _.findIndex(this.spaces, (o: Space) => {
              return o.id === space.id;
            });
            if (isAlreadyPresent === -1) this.spaces.push(space);
          }
        });
      });
      this.photos = _.filter(this.photos, (document: Image) => {
        return !document.serviceCategory;
      });

      if (this.platform.is('mobile')) {
        this.photos.forEach((document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
        });
      }

      const filterKeys = _.filter(this.afsService.keys, (key: Key) => { return key.id === category; });
      if (filterKeys[0]) [this.keys, this.englishKeys] = this.keysService.formatKeys(filterKeys[0]);

    }

  }

  public activeSpace(id: string): void {
    if (this.slides) this.slides.slideTo(0);
    setTimeout(() => {
      if (this.spaceActivated === id) {
        this.spaceActivated = null;
        this.loadFiles(this.currentPage);
      } else {
        this.spaceActivated = id;
        this.photos = _.filter(this.allDocuments, (document: FileI) => {
          return document.type !== 'application/pdf' && ((document.lang !== 'null' && document.lang === this.user.lang) || (!document.lang || document.lang === 'null')) && document.category === id && document.serviceCategory === this.currentPage;
        });
      }
    });
  }

  private loadServicesCards(): void {
    this.servicesCategories = [];
    const services: any = _.orderBy(_.filter(SERVICES_CATEGORIES, (service: any) => {
      return service.home;
    }),                             ['label']);
    services.forEach((service: Service, i) => {
      setTimeout(() => this.servicesCategories.push(service), 100 * i);
    });
  }

  public goToService(page: string): void {
    this.currentPage = page;
    this.loadFiles(this.currentPage);
    this.loadServicesCards();
  }

  public openDocument(event: Event, document: FileI): void {
    if (this.platform.is('mobile')) {
      event.preventDefault();
      this.fileOpener.open(`${this.file.dataDirectory}${document.path}/`, 'application/pdf');
    }
  }

  public photoPressed(file: FileI): void {
    if (file.unlock) this.carrier.addToCarrier(file);
  }

  ngOnDestroy() {
    this.event.unsubscribe('lang:changed');
    this.event.unsubscribe('tabs:services');
  }

}
