import { Component, OnInit } from '@angular/core';
// import {Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
// tslint:disable-next-line: import-spacing
import  * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userDoc: any;
  data: any;
  isUserLoggedIn: any = false;
  userInfo: any = {};
  filePath: any;
  imgsrc: any;
  task: AngularFireUploadTask;
check: any;
  public downloadUrl: Observable<string>;

  progress: any;  // Observable 0 to 100
profileimage: any;
username: any;
  image: string; // base64
  storageRef: any;

  // tslint:disable-next-line: max-line-length
  constructor(private fdb: AngularFireDatabase, public storage: AngularFireStorage, private camera: Camera, private afs: AngularFirestore, private file: File, public sanitizer: DomSanitizer, private http: HttpClient, private nativeHttp: HTTP, private plt: Platform, private loadingCtrl: LoadingController ) {
  }

  ngOnInit() {
   }

   async register() {
    ( window as any).AccountKitPlugin.loginWithPhoneNumber({
      useAccessToken: true,
      defaultCountryCode: 'IN',
      facebookNotificationsEnabled: true,
    }, data => {
      this.isUserLoggedIn = true;
      ( window as any).AccountKitPlugin.getAccount( info => {
        this.userInfo = info;
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json' );


        const postData =  {
        usermobileno: this.userInfo.phoneNumber

        };

        // tslint:disable-next-line: no-shadowed-variable
        from(this.nativeHttp.post('http://52.66.235.49:7500/registeruser', postData, {observe: 'response'})).pipe().subscribe(data => {
            console.log(data);

           }, error => {
            console.log(error);
          });

        this.getuser();
        // this.router.navigate(['profile-details', this.userInfo.phoneNumber]);
        this.afs.doc('Registered Number/' + this.userInfo.phoneNumber).get().subscribe((response: any) => {
          // this.data = response.data();
          // console.log(this.data);

          console.log(response.exists);
          this.check = response.exists;
          if (this.check) {
            this.fun();
        } else {
          this.afs.doc('Registered Number/' + this.userInfo.phoneNumber).set({
            multimedia: [ ]
           });
          this.fun();
          }

        });
       }, error => console.log(error));
    },
    error => console.log(error)
    );

  }
  logout() {
    (window as any ).AccountKitPlugin.logout();
    setTimeout(() => {
      this.isUserLoggedIn = false;
      this.data = '';
    }, 100);
  }

  async captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };
    return await this.camera.getPicture(options);
}

createUploadTask(file: string): void {

  this.filePath = `${ new Date().getTime() }.jpg`;
  console.log(this.filePath);
  this.image = 'data:image/jpg;base64,' + file;
  this.task = this.storage.ref(this.filePath).putString(this.image, 'data_url');

  this.progress = this.task.percentageChanges();
  this.task.percentageChanges().subscribe(res => {
      if ( res === 100) {
        setTimeout(() => {
          // tslint:disable-next-line: max-line-length
          this.imgsrc = 'https://firebasestorage.googleapis.com/v0/b/fir-storage-ionic-4bbb2.appspot.com/o/'  + this.filePath +  '?alt=media&';
          this.userDoc = this.afs.doc<any>('Registered Number/' + this.userInfo.phoneNumber  );
          this.userDoc.update(
       {
        multimedia: firebase.firestore.FieldValue.arrayUnion(
          {
           src: this.imgsrc,
           type: 'image'
          })
      });

        }, 6000);
         }
    });
  console.log('https://firebasestorage.googleapis.com/v0/b/fir-storage-ionic-4bbb2.appspot.com/o/' + this.filePath + '?alt=media&');


}

async uploadHandler() {
  const base64 = await this.captureImage();
  this.createUploadTask(base64);
 }
fun() {
  this.afs.doc('Registered Number/' + this.userInfo.phoneNumber).valueChanges().subscribe((res: any) => {
   console.log(res) ;
   this.data = res.multimedia;
   console.log(res) ;
  });
 }

 getuser() {
  let user;
  this.afs.doc('Profile Details/' + this.userInfo.phoneNumber).get().subscribe(( res: any) => {
    if (res.exists) {
      console.log(res.data());
      user = res.data();
      this.username = user.name;
      this.profileimage = user.image;
    } else {
      this.afs.doc('Profile Details/' + this.userInfo.phoneNumber).set({
        name: 'Guest',
        image: 'null'
      });
    }

    this.update();

  });

}
update() {
  this.afs.doc('Profile Details/' + this.userInfo.phoneNumber).valueChanges().subscribe(( res: any) => {
    this.username = res.name;
    this.profileimage = res.image;
  });
}

}

