import * as _ from 'lodash';
import { AfsService, CarrierService, KeysService, UserService } from '../../providers';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Events, IonicPage, Platform, Slides } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileI, Image, Key } from '../../interfaces';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-destination',
  templateUrl: 'destination.html',
})

export class DestinationPage {

  @ViewChild('video1') private video1: ElementRef;
  @ViewChild('video2') private video2: ElementRef;
  @ViewChild(Slides) private slides: Slides;
  private videoElement2: HTMLVideoElement;
  private win: any = window;
  public currentPage: string;
  public documents: FileI[];
  public documentsNb: { en: number, fr: number };
  public documentsOpen: boolean;
  public englishKeys: { string }[];
  public keys: { string }[];
  public mapOption: string;
  public photos: Image[];
  public showVideo: boolean;

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

    this.currentPage = 'destination_gallery';
    this.documents = [];
    this.documentsNb = { en: 0, fr: 0 };
    this.documentsOpen = false;
    this.mapOption = '';
    this.photos = [];

    this.event.subscribe('lang:changed', () => setTimeout(() => this.loadFiles(this.currentPage)));

    this.loadFiles('destination_gallery');

  }

  ionViewDidEnter() {
    this.showVideo = false;
    if (this.currentPage === 'accessibility') {
      this.videoElement2 = this.video2.nativeElement;
      this.videoElement2.play().then(() => {
        this.showVideo = true;
      });
    }
  }

  private loadFiles(category: string): void {

    const documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === category; }), ['order', 'path'], ['asc', 'desc']);

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

  public goToMap(page: string): void {
    this.mapOption = page;
    this.goToOtherPage('Map');
  }

  public goToOtherPage(page: string): void {
    this.showVideo = false;
    if (this.slides) this.slides.slideTo(0);
    setTimeout(() => {
      this.currentPage = this.currentPage === page ? 'destination_gallery' : page;
      if (page !== 'Map') this.loadFiles(this.currentPage);
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
    if (this.platform.is('mobile')) {
      event.preventDefault();
      this.fileOpener.open(`${this.file.dataDirectory}${document.path}/`, 'application/pdf');
    }
  }

  public photoPressed(file: FileI): void {
    if (file.unlock) this.carrier.addToCarrier(file);
  }

  public slideChanged(): void {
    const currentIndex = this.slides.getActiveIndex();
    const length = this.slides.length() - 1;
    if (this.video1) {
      const videoElement1 = this.video1.nativeElement;
      if (currentIndex === length && this.currentPage === 'charter') videoElement1.play();
      else videoElement1.pause();
    }
  }

  ngOnDestroy() {
    this.event.unsubscribe('lang:changed');
  }

}
