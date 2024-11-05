import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UserService } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-fullscreen-second',
  templateUrl: 'fullscreenSecond.html',
})

export class FullscreenSecondPage {

  @ViewChild('videoSecond') private video: ElementRef;
  private videoElement: HTMLVideoElement;
  public showVideo: boolean;

  constructor(
    private navCtrl: NavController,
    public user: UserService,
  ) { }

  public closePage(): void {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.videoElement = this.video.nativeElement;
    this.videoElement.play().then(() => {
      this.showVideo = true;
    });
  }

}
