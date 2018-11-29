import {Component, OnInit} from '@angular/core';

import {AlertController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppService} from './app.service';
import {environment} from '../environments/environment';
import {Store} from '@ngrx/store';
import {Index, Login} from './actions/app.actions';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private store$: Store<any>
    ) {
        this.initializeApp();
    }
    ngOnInit(): void {
        this.store$.dispatch(new Login());
        this.store$.dispatch(new Index());
    }

    initializeApp() {
        // console.log(device.uuid);

        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
