import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileI} from '../../interfaces';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {UserService} from '../../services/user.service';
import {Capacitor} from '@capacitor/core';
import {Directory} from '@capacitor/filesystem';

@Component({
  selector: 'app-expandable',
  templateUrl: 'expandable.directive.html',
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ExpandableDirective {

  @Input() public date;
  @Input() public expanded;
  @Input() public files;
  @Input() public lock;
  @Input() public note;
  @Input() public title;
  @Output() carrierDeleted = new EventEmitter<File>();
  @Output() carrierEdited = new EventEmitter();
  @Output() carrierLocked = new EventEmitter();
  @Output() carrierSended = new EventEmitter();
  @Output() fileDeleted = new EventEmitter<File>();

  constructor(
    private fileOpener: FileOpener,
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
    if (Capacitor.isNativePlatform()) {
      event.preventDefault();
      this.fileOpener.open(`${Directory.Data}${document.path}/`, document.type);
    }
  }

  public sendCarrier(): void {
    this.carrierSended.emit();
  }

}
