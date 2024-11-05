import * as _ from 'lodash';
import { AfsService, CarrierService, KeysService, UserService } from '../../providers';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, Platform, Slides } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileI, Image, Key, Service } from '../../interfaces';
import { FileOpener } from '@ionic-native/file-opener';
import { SERVICES_CATEGORIES } from '../../app/constants';

@IonicPage()
@Component({
  selector: 'page-spaces',
  templateUrl: 'spaces.html',
})

export class SpacesPage {

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
  public serviceActivated: string;
  public services: Service[];

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
    this.services = [];

    this.event.subscribe('tabs:spaces', (page: string) => {
      this.serviceActivated = null;
      this.services = [];
      if (page) this.goToSpace(page);
      else this.currentPage = '';
    });

    this.event.subscribe('lang:changed', () => {
      setTimeout(() => {
        this.serviceActivated = null;
        this.loadFiles(this.currentPage);
      },         100);
    });

  }

  private loadAllPhotos(): void {
    this.photos = _.filter(this.allDocuments, (document: FileI) => {
      return document.type !== 'application/pdf' && ((document.lang !== 'null' && document.lang === this.user.lang) || (!document.lang || document.lang === 'null'));
    });
  }

  private loadFiles(category: string): void {

    this.allDocuments = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === category; }), ['order', 'path'], ['asc', 'desc']);

    if (this.allDocuments) {

      this.documentsNb = { en: 0, fr: 0 };

      this.documents = _.filter(this.allDocuments, (document: FileI) => {
        return document.type === 'application/pdf';
      });
      this.documents.forEach((document: FileI) => {
        if (document.language === 'fr') this.documentsNb.fr++;
        else this.documentsNb.en++;
        if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
      });

      this.loadAllPhotos();

      this.services = [];
      this.photos.forEach((document: FileI) => {
        if (document.serviceCategory) {
          SERVICES_CATEGORIES.forEach((service: Service) => {
            if (service.id === document.serviceCategory) {
              const isAlreadyPresent = _.findIndex(this.services, (o: Service) => {
                return o.id === service.id;
              });
              if (isAlreadyPresent === -1) this.services.push(service);
            }
          });
        }
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

  public activeService(id: string): void {
    if (this.slides) this.slides.slideTo(0);
    setTimeout(() => {
      if (this.serviceActivated === id) {
        this.serviceActivated = null;
        this.loadFiles(this.currentPage);
      } else {
        this.serviceActivated = id;
        this.loadAllPhotos();
        const photos: any = _.filter(this.photos, (document: FileI) => {
          return document.serviceCategory === id;
        });
        this.photos = photos;
      }
    });
  }

  public goToSpace(space: string): void {
    this.currentPage = space;
    this.loadFiles(this.currentPage);
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
    this.event.unsubscribe('tabs:spaces');
  }

}
