import * as _ from 'lodash';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, FileI} from '../../../shared/interfaces';
import {AfsService, CarrierService, EventService, UserService} from '../../../shared/services';
import {DESTINATION_CATEGORIES, SERVICES_CATEGORIES, SPACES_CATEGORIES} from '../../../shared/constants';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {Capacitor} from '@capacitor/core';


@Component({
  selector: 'app-page-toolbox',
  templateUrl: 'toolbox.page.html',
  styleUrls: ['toolbox.page.scss'],
})

export class ToolboxPage implements OnInit, OnDestroy {

  win: any = window;
  category: string;
  documents: FileI[];
  id: string;
  urls: any[];

  constructor(
    private event: EventService,
    public afsService: AfsService,
    public carrier: CarrierService,
    public user: UserService,
    private fileOpener: FileOpener
  ) {
    this.category = 'destination';
    this.event.langChangedObserve().subscribe(() => setTimeout(() => this.loadFiles()));
    this.loadFiles();
  }

  public activeCategory(category: string, id?: string): void {
    this.category = category;
    this.id = id || null;
    this.urls = [];
    this.loadFiles();
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

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  private loadFiles(): void {

    this.documents = [];

    if (this.category === 'destination') {

      DESTINATION_CATEGORIES.forEach((destination) => {
        // eslint-disable-next-line max-len
        let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === destination.id), ['order', 'path'], ['asc', 'desc']);

        documents.forEach(async (document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          // @ts-ignore
          document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
        });

        // eslint-disable-next-line max-len
        documents = _.filter(documents, (document: FileI) => document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang);
        this.documents.push(...documents);
        this.documents.forEach((document: FileI) => {
          if (document.name) {
            document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
          }
        });
      });

    } else if (this.category === 'city') {
      // eslint-disable-next-line max-len
      let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === 'lacite'), ['order', 'path'], ['asc', 'desc']);

      documents.forEach(async (document: FileI) => {
        const folder = document.path.slice(0, document.path.indexOf('/'));
        const path = document.path.slice(document.path.indexOf('/') + 1);
        // @ts-ignore
        document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
      });

      // eslint-disable-next-line max-len
      documents = _.filter(documents, (document: FileI) => document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang);
      this.documents.push(...documents);
      this.documents.forEach((document: FileI) => {
        if (document.name) {
          document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
        }
      });

    } else if (this.category === 'spaces') {

      SPACES_CATEGORIES.forEach((space) => {
        // eslint-disable-next-line max-len
        let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === space.id), ['order', 'path'], ['asc', 'desc']);

        documents.forEach(async (document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          // @ts-ignore
          document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
        });

        documents = _.filter(documents, (document: FileI) => {
          if (document.language) {
            return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
          }
        });
        this.documents.push(...documents);
        this.documents.forEach((document: FileI) => {
          if (document.name) {
            document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
          }
        });
      });

    } else if (this.category === 'services') {

      SERVICES_CATEGORIES.forEach((service) => {
        // eslint-disable-next-line max-len
        let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === service.id), ['order', 'path'], ['asc', 'desc']);

        documents.forEach(async (document: FileI) => {
          const folder = document.path.slice(0, document.path.indexOf('/'));
          const path = document.path.slice(document.path.indexOf('/') + 1);
          // @ts-ignore
          document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
        });

        documents = _.filter(documents, (document: FileI) => {
          if (document.language) {
            return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
          }
        });
        this.documents.push(...documents);
        this.documents.forEach((document: FileI) => {
          if (document.name) {
            document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
          }
        });
      });

    } else if (this.category === 'other') {
      // eslint-disable-next-line max-len
      let documents = _.orderBy(_.filter(this.afsService.files, (file: FileI) => file.category === this.id), ['order', 'path'], ['asc', 'desc']);
      documents.forEach(async (document: FileI) => {
        const folder = document.path.slice(0, document.path.indexOf('/'));
        const path = document.path.slice(document.path.indexOf('/') + 1);
        // @ts-ignore
        document.localUrl = await this.afsService.getUri(`${folder}/${path}`);
      });

      documents = _.filter(documents, (document: FileI) => {
        if (document.language) {
          return document.type === 'application/pdf' && document.language.toLowerCase() === this.user.lang;
        }
      });
      this.documents.push(...documents);
      this.documents.forEach((document: FileI) => {
        if (document.name) {
          document.name = document.name.replace(/_/g, ' ').replace(/-/g, ' ').replace('.pdf', '');
        }
      });

      this.urls = _.filter(this.afsService.toolboxCategories, (category: Category) => category.id === this.id)[0].urls || [];

    }

  }

}
