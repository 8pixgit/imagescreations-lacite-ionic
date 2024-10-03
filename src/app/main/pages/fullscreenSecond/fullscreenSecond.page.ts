import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/services';
import {Location} from '@angular/common';


@Component({
  selector: 'app-page-fullscreen-second',
  templateUrl: 'fullscreenSecond.page.html',
  styleUrls: ['fullscreenSecond.page.scss']
})

export class FullscreenSecondPage {

  videoElement: HTMLVideoElement;
  showVideo: boolean;
  @ViewChild('videoSecond') private video: ElementRef;

  constructor(
    private location: Location,
    public user: UserService,
  ) {
  }

  public closePage(): void {
    this.location.back();
  }

  ionViewDidLoad() {
    this.videoElement = this.video.nativeElement;
    this.videoElement.play().then(() => {
      this.showVideo = true;
    });
  }

}
