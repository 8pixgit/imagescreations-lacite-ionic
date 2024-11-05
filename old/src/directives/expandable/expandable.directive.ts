import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileI } from '../../interfaces';
import { FileOpener } from '@ionic-native/file-opener';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { UserService } from '../../providers';

@Component({
  selector: 'app-expandable',
  templateUrl: 'expandable.directive.html',
})

export class ExpandableDirective {

  @Input('date') public date;
  @Input('expanded') public expanded;
  @Input('files') public files;
  @Input('lock') public lock;
  @Input('note') public note;
  @Input('title') public title;
  @Output() carrierDeleted = new EventEmitter<File>();
  @Output() carrierEdited = new EventEmitter();
  @Output() carrierLocked = new EventEmitter();
  @Output() carrierSended = new EventEmitter();
  @Output() fileDeleted = new EventEmitter<File>();

  constructor(
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform,
    public network: Network,
    public user: UserService,
  ) {
    this.files = this.files || [];
    setTimeout(() => this.expanded = !this.lock);
  }

  public deleteFile(file: File): void {
    this.fileDeleted.emit(file);
  }

  public deleteCarrier(): void {
    this.carrierDeleted.emit();
  }

  public editCarrier(): void {
    this.carrierEdited.emit();
  }

  public lockCarrier(): void {
    this.carrierLocked.emit();
  }

  public onClick(): void {
    this.expanded = !this.expanded;
  }

  public openDocument(event: Event, document: FileI): void {
    if (this.platform.is('mobile')) {
      event.preventDefault();
      this.fileOpener.open(`${this.file.dataDirectory}${document.path}/`, document.type);
    }
  }

  public sendCarrier(): void {
    this.carrierSended.emit();
  }

}
