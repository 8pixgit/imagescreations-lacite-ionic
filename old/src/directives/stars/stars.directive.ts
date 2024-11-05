import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ion-stars',
  templateUrl: './stars.directive.html',
})

export class StarsDirective {

  @Input() public stars: number;

  constructor() { }

  ngOnInit() { }

}
