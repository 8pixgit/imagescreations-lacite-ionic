import {Component} from '@angular/core';
import {Platform, ToastController} from '@ionic/angular';
import {AfsService} from '../../../../shared/services';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Network} from '@capacitor/network';


@Component({
  selector: 'app-modal-sync',
  templateUrl: 'sync.html',
  styleUrls: ['sync.scss'],
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SyncModal {

  public totalFiles: number;
  public deletedFiles: number;
  public newFiles: number;
  public statusNetwork = true;
  public deletedFolders: number;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    public afsService: AfsService,
  ) {
    this.totalFiles = 0;
    this.deletedFiles = 0;
    this.newFiles = 0;
    this.deletedFolders = 0;
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.statusNetwork = status.connected;
    });
  }

  async ionViewDidEnter() {

    await this.deleteFiles();
    await this.addFiles();
    const status = await Network.getStatus();
    this.statusNetwork = status.connected;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }

  private async addFiles() {
    this.totalFiles = this.afsService.files.length;
    for (const file of this.afsService.files) {
      console.log(file.path);
      const download = await this.afsService.download(file.path, file.path);
      if (download.result) {
        this.newFiles++;
      } else {
        await this.showToast(download.message + ' ' + file.path);
      }


    }
  }

  private async deleteFiles() {
    try {
      const dirs = await Filesystem.readdir({
        directory: Directory.Data,
        path: '',
      });
      for (const dir of dirs.files) {
        const files = await Filesystem.readdir({
          directory: Directory.Data,
          path: dir.name + '/',
        });
        for (const file of files.files) {
          await Filesystem.deleteFile({
            directory: Directory.Data,
            path: dir.name + '/' + file.name
          });
          this.deletedFiles++;
        }
        await Filesystem.rmdir({
          directory: Directory.Data,
          path: dir.name + '/',
          recursive: true
        });
        this.deletedFolders++;
      }
    } catch (e) {
      await this.showToast(e.message);
    }
  }
}
