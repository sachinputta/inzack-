import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClientModule } from '@angular/common/http';

const config = {
  // your firebase web config
  apiKey: 'AIzaSyDmWQtluVuUU7WRFnYAIxn87CGRHBygHgc',
    authDomain: 'fir-storage-ionic-4bbb2.firebaseapp.com',
    databaseURL: 'https://fir-storage-ionic-4bbb2.firebaseio.com',
    projectId: 'fir-storage-ionic-4bbb2',
    storageBucket: 'fir-storage-ionic-4bbb2.appspot.com',
    messagingSenderId: '368773082934',
    appId: '1:368773082934:web:82e465f21190c58d'
 };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // tslint:disable-next-line: max-line-length
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(config), AngularFireStorageModule, AngularFireDatabaseModule,
  AngularFirestoreModule, HttpClientModule, ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
