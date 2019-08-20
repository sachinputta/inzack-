import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

declare var window: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
@Input() phone: string;
  public options: CameraOptions = {
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    destinationType: this.camera.DestinationType.FILE_URI,
    mediaType: this.camera.MediaType.VIDEO
  };
  public Fbref: any;
  userDoc: any;
  data: any;
  isUserLoggedIn: any = false;
  // filePath: any;
  task: any;
  progress: any;
  videosrc: any;
  newprog: any;
  filePath = `${ new Date().getTime() }.mp4`;

  constructor(private file: File, private camera: Camera, public sanitizer: DomSanitizer, private afs: AngularFirestore  ) {
    this.Fbref = firebase.storage().ref();
  }
  ngOnInit() { }

getmedia() {
 this.camera.getPicture(this.options).then(fileuri => {
 window.resolveLocalFileSystemURL('file://' + fileuri, (FE: { file: (arg0: (file: any) => void) => void; }) => {
 FE.file((file: Blob) => {
 const FR = new FileReader();
 FR.onloadend = (res: any) => {
const AF = res.target.result;
const blob = new Blob([new Uint8Array(AF)], {type: 'video/mp4'});
this.upload(blob);

 };
 FR.readAsArrayBuffer(file);
 });
 });
 });
 }


 upload(blob: Blob) {
 // this.filePath = `${ new Date().getTime() }.mp4`;
  console.log(this.filePath);
  this.task = this.Fbref.child(this.filePath).put(blob);


  // tslint:disable-next-line: only-arrow-functions
  this.task.on('state_changed', function(snapshot: { bytesTransferred: number; totalBytes: number; state: any; }) {
    // tslint:disable-next-line: prefer-const
    // console.log(snapshot);
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    // console.log('Upload is ' + progress + '% done');
    console.log(progress);
    // tslint:disable-next-line: no-shadowed-variable
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  // tslint:disable-next-line: only-arrow-functions
  }, function(error: any) {
    // console.log(error);
    // Handle unsuccessful uploads
  },  setTimeout(() => {
    // tslint:disable-next-line: max-line-length
    console.log(this.filePath);
    this.videosrc = 'https://firebasestorage.googleapis.com/v0/b/fir-storage-ionic-4bbb2.appspot.com/o/'  + this.filePath +  '?alt=media&';
    console.log(this.videosrc);
    console.log(this.phone);
    this.afs.doc('Registered Number/' + this.phone ).update({
      multimedia: firebase.firestore.FieldValue.arrayUnion(
        {
         src: this.videosrc,
         type: 'video'
        })
      } );
  }, 5000)


  );




 }

}
