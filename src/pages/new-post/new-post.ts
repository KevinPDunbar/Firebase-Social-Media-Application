import { Component } from '@angular/core';
import { AuthData } from '../../providers/auth-data';
import { FormBuilder, Validators } from '@angular/forms';
import {
    IonicPage, NavController, NavParams, LoadingController,
    AlertController
} from 'ionic-angular';
import firebase from 'firebase';


/**
 * Generated class for the NewPostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
})
export class NewPostPage {

    public newPostForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams
        , public formBuilder: FormBuilder,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController,
        public authData: AuthData, public nav: NavController) {

        this.newPostForm = formBuilder.group({
            post: ['', Validators.compose([Validators.required])]
        });

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPostPage');
  }

  submitPost() {
      let post = this.newPostForm.value.post;
      console.log("post is: " + post);
        //this.authData.getUser();
        console.log("submittttt");
        this.authData.submitPost(post);
  }

  submitPost2() {
      console.log("getting the user");

      //console.log(firebase.auth().currentUser); FOR WHOLE USER OBJECT

      let user = firebase.auth().currentUser;
      let userId = user.uid;

      let post = this.newPostForm.value.post;

      /*firebase.database().ref('/Posts').child(userId).set({
          Text: "THis is a texttt",
          Score: 0
      });*/

      firebase.database().ref('/Posts').child(userId).push({
          Text: post,
          Score: 1,
          UserId: userId
      });

      var newPostKey = firebase.database().ref().child('/Posts').push().key;
      console.log(newPostKey);
      this.authData.setPushId(newPostKey);

  }
    

}
