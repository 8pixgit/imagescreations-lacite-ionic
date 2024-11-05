import { AfsService } from '../../providers';
import { Component } from '@angular/core';
import { Entry, File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { IonicPage, Platform, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { NextObserver, Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})

export class SyncModal {

  public currentFile: number;
  public deletedFiles: number;
  public newFiles: number;

  constructor(
    private file: File,
    private platform: Platform,
    private toastCtrl: ToastController,
    private transfer: FileTransfer,
    public afsService: AfsService,
    public network: Network,
  ) {
    this.currentFile = 0;
    this.deletedFiles = 0;
    this.newFiles = 0;
  }

  ionViewDidEnter() {

    this.deleteFiles().subscribe(() => {

      if (this.platform.is('mobile')) {

        this.afsService.files.forEach((file: any, i: number) => {

          setTimeout(() => {

            const folder = file.path.slice(0, file.path.indexOf('/'));
            const path = file.path.slice(file.path.indexOf('/') + 1);

            this.file.checkFile(`${this.file.dataDirectory}${folder}/`, `${path}`).then(
              () => {
                this.currentFile = Math.min(this.currentFile + 1, this.afsService.totalFiles);
              },
              () => {
                const fileTransfer: FileTransferObject = this.transfer.create();
                const localPath = `${this.file.dataDirectory}${file.path}`;
                fileTransfer.download(file.downloadUrl, localPath).then(() => {
                  this.currentFile = Math.min(this.currentFile + 1, this.afsService.totalFiles);
                  this.newFiles++;
                },                                                      (error) => {
                  const toast = this.toastCtrl.create({
                    cssClass: 'error',
                    message: error.message,
                    duration: 3000,
                    position: 'top',
                  });
                  toast.present();
                });
              });

          },         i * 100);

        });

      }

    });

  }

  private deleteFiles(): Observable<boolean> {

    return Observable.create((observer: NextObserver<boolean>) => {

      if (this.platform.is('mobile')) {

        this.file.listDir(this.file.dataDirectory, '').then((dirs: Entry[]) => {
          dirs.forEach((dir: Entry, i: number) => {
            this.file.listDir(this.file.dataDirectory, dir.name).then((dirFiles: Entry[]) => {

              setTimeout(() => {

                if (dirFiles.length === 0) {
                  observer.next(true);
                  observer.complete();
                } else {
                  dirFiles.forEach((dirFile: Entry, j: number) => {

                    let exist = false;
                    this.afsService.files.forEach((file: any, k: number) => {
                      const path = file.path.slice(file.path.indexOf('/') + 1);
                      if (path === dirFile.name) exist = true;

                      if ((i >= dirs.length - 2) && (j >= dirFiles.length - 2) && (k >= this.afsService.files.length - 2)) {
                        observer.next(true);
                        observer.complete();
                      }

                    });
                    if (!exist) {
                      dirFile.remove(
                        () => {
                          this.deletedFiles++;
                        },
                        (error) => {
                          const toast = this.toastCtrl.create({
                            cssClass: 'error',
                            message: error.message,
                            duration: 3000,
                            position: 'top',
                          });
                          toast.present();
                        });
                    }
                  });
                }

              },         i * 100);

            });
          });
        });

      } else {
        observer.next(false);
        observer.complete();
      }

    });

  }

}
