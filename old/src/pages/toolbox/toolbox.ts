import * as _ from 'lodash';
import { AfsService, CarrierService, UserService } from '../../providers';
import { Category, FileI } from '../../interfaces';
import { Component } from '@angular/core';
import { DESTINATION_CATEGORIES, SERVICES_CATEGORIES, SPACES_CATEGORIES } from '../../app/constants';
import { Events, IonicPage, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-toolbox',
  templateUrl: 'toolbox.html',
})

export class ToolboxPage {

  private win: any = window;
  public category: string;
  public documents: FileI[];
  public id: string;
  public urls: string[];

  constructor(
    private event: Events,
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform,
    public afsService: AfsService,
    public carrier: CarrierService,
    public user: UserService,
  ) {
    this.category = 'destination';
    this.event.subscribe('lang:changed', () => setTimeout(() => this.loadFiles()));
    this.loadFiles();
  }

  private loadFiles(): void {

    this.documents = [];

    if (this.category === 'destination') {

      DESTINATION_CATEGORIES.forEach((destination) => {
        let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === destination.id; }), ['order', 'path'], ['asc', 'desc']);
        if (this.platform.is('mobile')) {
          documents.forEach((document: FileI) => {
            const folder = document.path.slice(0, document.path.indexOf('/'));
            const path = document.path.slice(document.path.indexOf('/') + 1);
            document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
          });
        }
        documents = _.filter(documents, (document: FileI) => {
          return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
        });
        this.documents.push(...documents);
        this.documents.forEach((document: FileI) => {
          if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
        });
      });

    } else if (this.category === 'city') {

      let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === 'lacite'; }), ['order', 'path'], ['asc', 'desc']);
      if (this.platform.is('mobile')) {
        documents.forEach((document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
        });
      }
      documents = _.filter(documents, (document: FileI) => {
        return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
      });
      this.documents.push(...documents);
      this.documents.forEach((document: FileI) => {
        if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
      });

    } else if (this.category === 'spaces') {

      SPACES_CATEGORIES.forEach((space) => {
        let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === space.id; }), ['order', 'path'], ['asc', 'desc']);
        if (this.platform.is('mobile')) {
          documents.forEach((document: FileI) => {
            const folder = document.path.slice(0, document.path.indexOf('/'));
            const path = document.path.slice(document.path.indexOf('/') + 1);
            document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
          });
        }
        documents = _.filter(documents, (document: FileI) => {
          if (document.language) return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
        });
        this.documents.push(...documents);
        this.documents.forEach((document: FileI) => {
          if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
        });
      });

    } else if (this.category === 'services') {

      SERVICES_CATEGORIES.forEach((service) => {
        let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === service.id; }), ['order', 'path'], ['asc', 'desc']);
        if (this.platform.is('mobile')) {
          documents.forEach((document: FileI) => {
            const folder = document.path.slice(0, document.path.indexOf('/'));
            const path = document.path.slice(document.path.indexOf('/') + 1);
            document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
          });
        }
        documents = _.filter(documents, (document: FileI) => {
          if (document.language) return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
        });
        this.documents.push(...documents);
        this.documents.forEach((document: FileI) => {
          if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
        });
      });

    } else if (this.category === 'other') {

      let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => { return file.category === this.id; }), ['order', 'path'], ['asc', 'desc']);
      if (this.platform.is('mobile')) {
        documents.forEach((document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          document.localUrl = this.win.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${folder}/${path}`);
        });
      }
      documents = _.filter(documents, (document: FileI) => {
        if (document.language) return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
      });
      this.documents.push(...documents);
      this.documents.forEach((document: FileI) => {
        if (document.name) document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
      });

      this.urls = _.filter(this.afsService.toolboxCategories, (category: Category) => { return category.id === this.id; })[0].urls || [];

    }

  }

  public activeCategory(category: string, id?: string): void {
    this.category = category;
    this.id = id || null;
    this.urls = [];
    this.loadFiles();
  }

  public openDocument(event: Event, document: FileI): void {
    if (this.platform.is('mobile')) {
      event.preventDefault();
      this.fileOpener.open(`${this.file.dataDirectory}${document.path}/`, 'application/pdf');
    }
  }

  ngOnDestroy() {
    this.event.unsubscribe('lang:changed');
  }

}
