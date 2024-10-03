import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class EventService {


  private usersLoadedSubject = new Subject();
  private gestureDblclickSubject = new Subject();
  private langChangedSubject = new Subject();
  private tabsServicesSubject = new Subject();
  private tabsSpacesSubject = new Subject();
  private tabOpenSubject = new Subject();

  constructor() {

  }

  usersLoaded(data) {
    this.usersLoadedSubject.next(data);
  }

  gestureDblclick(data) {
    this.gestureDblclickSubject.next(data);
  }

  langChanged(data) {
    this.langChangedSubject.next(data);
  }

  tabsServices(data) {
    this.tabsServicesSubject.next(data);
  }

  tabsSpaces(data) {
    this.tabsSpacesSubject.next(data);
  }

  tabOpen(data) {
    this.tabOpenSubject.next(data);
  }

  usersLoadedObserve(): Subject<any> {
    return this.usersLoadedSubject;
  }

  gestureDblclickObserve(): Subject<any> {
    return this.gestureDblclickSubject;
  }

  langChangedObserve(): Subject<any> {
    return this.langChangedSubject;
  }

  tabsServicesObserve(): Subject<any> {
    return this.tabsServicesSubject;
  }

  tabsSpacesObserve(): Subject<any> {
    return this.tabsSpacesSubject;
  }

  tabOpenObserve(): Subject<any> {
    return this.tabOpenSubject;
  }
}
