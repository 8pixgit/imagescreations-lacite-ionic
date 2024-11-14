import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import * as _ from 'lodash';
import { SERVICES_CATEGORIES } from '../../../shared/constants';
import { FileI, Image, Key, Service } from '../../../shared/interfaces';
import {
  AfsService,
  CarrierService,
  EventService,
  KeysService,
  UserService,
} from '../../../shared/services';

@Component({
  selector: 'app-page-destination',
  templateUrl: 'spaces.page.html',
  styleUrls: ['spaces.page.scss'],
})
export class SpacesPage implements OnInit, OnDestroy {
  currentPage: string;
  documents: FileI[];
  documentsNb: { en: number; fr: number };
  documentsOpen: boolean;
  englishKeys: any[];
  keys: any[];
  photos: any[];
  serviceActivated: string;
  services: Service[];
  private slides: any;
  private allDocuments: FileI[];
  private win: any = window;

  constructor(
    private afsService: AfsService,
    private event: EventService,
    private fileOpener: FileOpener,
    private keysService: KeysService,
    public carrier: CarrierService,
    public user: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.event.langChangedObserve().subscribe((lang) => {
      setTimeout(() => {
        this.serviceActivated = null;
        this.loadFiles(this.currentPage);
      }, 100);
    });
  }
  ionViewWillEnter() {
    this.photos = [];
    this.services = [];

    this.serviceActivated = null;
    this.services = [];

    this.photos = [];

    const key = this.activeRoute.snapshot.paramMap.get('key');
    if (key) {
      this.currentPage = key;
      this.loadFiles(this.currentPage);
    } else {
      this.currentPage = '';
      this.goToSpace('');
    }
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  public activeService(id: string): void {
    if (this.slides) {
      this.slides.slideTo(0, 500);
    }
    setTimeout(() => {
      if (this.serviceActivated === id) {
        this.serviceActivated = null;
        this.loadFiles(this.currentPage);
      } else {
        this.serviceActivated = id;
        this.loadAllPhotos();
        const photos: any = _.filter(
          this.photos,
          (document: FileI) => document.serviceCategory === id
        );
        this.photos = photos;
      }
    });
  }

  public goToSpace(space: string): void {
    this.currentPage = space;
    this.router.navigate(['/spaces', space]);
    // this.loadFiles(this.currentPage);
  }

  public async openDocument(event: Event, document: FileI) {
    if (Capacitor.isNativePlatform()) {
      event.preventDefault();
      const getUriResult = await Filesystem.getUri({
        directory: Directory.Data,
        path: document.path,
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

  ngOnDestroy() {}

  private loadAllPhotos(): void {
    // eslint-disable-next-line max-len
    this.photos = _.filter(
      this.allDocuments,
      (document: FileI) =>
        document.type !== 'application/pdf' &&
        ((document.lang !== 'null' && document.lang === this.user.lang) ||
          !document.lang ||
          document.lang === 'null')
    );
  }

  private loadFiles(category: string): void {
    // eslint-disable-next-line max-len
    this.allDocuments = _.orderBy(
      _.filter(
        this.afsService.files,
        (file: FileI) => file.category === category
      ),
      ['order', 'path'],
      ['asc', 'desc']
    );

    if (this.allDocuments) {
      this.documentsNb = { en: 0, fr: 0 };

      this.documents = _.filter(
        this.allDocuments,
        (document: FileI) => document.type === 'application/pdf'
      );
      this.documents.forEach((document: FileI) => {
        if (document.language === 'fr') {
          this.documentsNb.fr++;
        } else {
          this.documentsNb.en++;
        }
        if (document.name) {
          document.name = document.name
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace('.pdf', '');
        }
      });

      this.loadAllPhotos();

      this.services = [];
      this.photos.forEach((document: FileI) => {
        if (document.serviceCategory) {
          SERVICES_CATEGORIES.forEach((service: Service) => {
            if (service.id === document.serviceCategory) {
              const isAlreadyPresent = _.findIndex(
                this.services,
                (o: Service) => o.id === service.id
              );
              if (isAlreadyPresent === -1) {
                this.services.push(service);
              }
            }
          });
        }
      });

      this.photos = _.filter(
        this.photos,
        (document: Image) => !document.serviceCategory
      );

      this.photos.forEach(async (document: FileI) => {
        const folder = document.path.slice(0, document.path.indexOf('/'));
        const path = document.path.slice(document.path.indexOf('/') + 1);
        // @ts-ignore
        document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
      });

      const filterKeys = _.filter(
        this.afsService.keys,
        (key: Key) => key.id === category
      );
      if (filterKeys[0]) {
        [this.keys, this.englishKeys] = this.keysService.formatKeys(
          filterKeys[0]
        );
      }
    }
  }
}
