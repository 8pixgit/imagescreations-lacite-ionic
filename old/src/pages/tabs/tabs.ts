import { Component, ViewChild } from '@angular/core';
import { HTMLInputEvent } from '../../interfaces';
import { Events, IonicPage, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})

export class TabsPage {

  @ViewChild('myTabs') private tabRef: Tabs;
  public tab1Root: string;
  public tab2Root: string;
  public tab3Root: string;
  public tab4Root: string;
  public uiHidden: boolean;

  constructor(
    private event: Events,
  ) {

    this.tab1Root = 'DestinationPage';
    this.tab2Root = 'LacitePage';
    this.tab3Root = 'SpacesPage';
    this.tab4Root = 'ServicesPage';

    this.event.subscribe('tab:open', (data: { index: number, page?: string, type?: string }) => {
      try {
        this.tabRef.select(data.index).then(() => {
          if (data.page) this.event.publish(`tabs:${data.type}`, data.page);
        });
      } catch (err) {
        const tabid = `tab-t1- ${data.index}`;
        if (document.getElementById(tabid)) {
          setTimeout(() => {
            document.getElementById(tabid).click();
            if (data.page) setTimeout(() => this.event.publish(`tabs:${data.type}`, data.page));
          });
        }
      }
    });

    this.event.subscribe('gesture:dblclick', (uiHidden: boolean) => {
      this.uiHidden = uiHidden;
    });

  }

  public serviceClicked(event: HTMLInputEvent): void {
    if (event.target.textContent === 'Services') this.event.publish('tabs:services');
    else if (event.target.textContent === 'Espaces' || event.target.textContent === 'Spaces') this.event.publish('tabs:spaces');
  }

  ngOnDestroy() {
    this.event.unsubscribe('gesture:dblclick');
    this.event.unsubscribe('tab:open');
  }

}
