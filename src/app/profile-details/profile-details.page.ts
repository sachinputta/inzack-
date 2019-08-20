import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
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


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(public activeRoute: ActivatedRoute , private fdb: AngularFireDatabase, public storage: AngularFireStorage, private camera: Camera, private afs: AngularFirestore, private file: File, public sanitizer: DomSanitizer, ) { }
  userDoc: any;
  data: any;
  isUserLoggedIn: any = false;
  userInfo: any = {};
  filePath: any;
  imgsrc: any;
  task: AngularFireUploadTask;
check: any;
  public downloadUrl: Observable<string>;
  username: any;

  progress: any;  // Observable 0 to 100

  image: string; // base64
  storageRef: any;


  ngOnInit() {

    console.log(this.activeRoute.snapshot.paramMap.get('phone'));
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
          const userphonenumber = this.activeRoute.snapshot.paramMap.get('phone');
          this.userDoc = this.afs.doc<any>('Profile Details/' + userphonenumber);
          this.userDoc.update(
       {
         name: this.username,
         image: this.imgsrc
      });

        }, 8000);
         }
    });
  console.log('https://firebasestorage.googleapis.com/v0/b/fir-storage-ionic-4bbb2.appspot.com/o/'  + this.filePath +  '?alt=media&');


}

async uploadHandler() {
 const base64 = await this.captureImage();
 this.createUploadTask(base64);
}


}
