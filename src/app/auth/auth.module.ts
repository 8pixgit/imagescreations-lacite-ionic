import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AuthComponent} from './auth.component';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {LoginPage} from './pages/login/login.page';
import {AuthRoutingModule} from './auth-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [AuthComponent, LoginPage],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        AuthRoutingModule,
    ],
    providers: [],
    bootstrap: [AuthComponent]
})
export class AuthModule {
}
