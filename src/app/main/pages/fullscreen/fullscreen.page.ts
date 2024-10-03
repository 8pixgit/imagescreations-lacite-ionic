import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {UserService} from '../../../shared/services';

@Component({
  selector: 'app-page-fullscreen',
  templateUrl: 'fullscreen.page.html',
  styleUrls: ['fullscreen.page.scss']
})

export class FullscreenPage implements OnInit, OnDestroy, AfterViewInit {

  videoElement: HTMLVideoElement;
  showVideo = false;
  @ViewChild('video') private video: ElementRef;

  constructor(private location: Location,
              private router: Router,
              public user: UserService,) {

    // @ts-ignore
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        // @ts-ignore
        if (this.router.url !== '/fullscreen') {
          this.showVideo = false;
          if (this.videoElement) {
            this.videoElement.pause();
          }
        } else {

          this.videoElement.load();
          this.showVideo = true;

        }
        console.log(event);
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
  }

  ngOnDestroy() {

  }

  closePage(): void {
    this.location.back();
  }

  ionViewDidLoad() {


  }

  ionViewdidLeave() {

  }

}
