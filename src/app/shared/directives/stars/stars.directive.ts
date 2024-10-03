import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ion-stars',
  templateUrl: './stars.directive.html',
  styleUrls: ['stars.directive.scss'],
})

export class StarsDirective {

  @Input() public stars: number;

  constructor() {
  }

  ngOnInit() {
  }

}
