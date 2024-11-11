import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  public goToOtherPage(path: string): void {
    console.log('path', path);
    this.router.navigate(['/main/' + path]);
  }
}
