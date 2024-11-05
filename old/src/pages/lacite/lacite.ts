import * as _ from 'lodash';
import { AfsService, CarrierService, KeysService, UserService } from '../../providers';
import { Component } from '@angular/core';
import { Events, IonicPage, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileI, Image, Key } from '../../interfaces';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-lacite',
  templateUrl: 'lacite.html',
})

export class LacitePage {

  private win: any = window;
  public documents: FileI[];
  public documentsNb: { en: number, fr: number };
  public documentsOpen: boolean;
  public englishKeys: { string }[];
  public keys: { string }[];
  public photos: Image[];

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

    this.documents = [];
    this.documentsNb = { en: 0, fr: 0 };
    this.documentsOpen = false;
    this.photos = [];

    this.event.subscribe('lang:changed', () => setTimeout(() => this.loadFiles()));

    this.loadFiles();

  }

  private loadFiles(): void {

    const documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === 'lacite'; }), ['order', 'path'], ['asc', 'desc']);

    if (documents) {

      this.documents = _.filter(documents, (document: FileI) => {
        return document.type === 'application/pdf';
      });
      this.documents.forEach((document: FileI) => {
        if (document.language === 'fr') this.documentsNb.fr++;
        else this.documentsNb.en++;
        if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
      });

      this.photos = _.filter(documents, (document: FileI) => {
        return document.type !== 'application/pdf' && ((document.lang && document.lang === this.user.lang) || !document.lang);
      });
      if (this.platform.is('mobile')) {
        this.photos.forEach((document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
        });
      }

      const filterKeys = _.filter(this.afsService.keys, (key: Key) => { return key.id === 'lacite'; });
      if (filterKeys[0]) [this.keys, this.englishKeys] = this.keysService.formatKeys(filterKeys[0]);

    }

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
  }

}
