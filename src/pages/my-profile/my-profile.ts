import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';

import { EditProfilePage } from '../edit-profile/edit-profile';
import { ViewPostPage } from '../view-post/view-post';



/**
 * Generated class for the MyProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

    public posts = [];
    public users = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MyProfilePage');
      this.getUserPosts();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.getUserPosts();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  viewPost(userId, postId) {
      console.log("THE PASSED IN ID :" + userId);
      console.log("THE PASSED IN POST ID : " + userId);
      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewPostPage, {
          userId: userId,
          postId: postId
      })
  }


  editProfile()
  {
      this.navCtrl.push(EditProfilePage);
  }

  getUserPosts() {

      let userId = firebase.auth().currentUser.uid;


      let postsClone = this.posts;
      let userClone = this.users;


      let user = firebase.auth().currentUser;

      let Posts = firebase.database().ref('Posts/' + userId);

      let email;
      let firstName;
      let lastName;
      let aboutMe;
      let photoURL;

      let userPostKeys = [];


      let userQuery = firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
          email = (snapshot.val() && snapshot.val().email) || 'email';
          firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
          lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';
          aboutMe = (snapshot.val() && snapshot.val().aboutMe) || 'User has no bio';
          photoURL = (snapshot.val() && snapshot.val().profilePicture) || "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a";

          userClone.push({ "firstName": firstName, "lastName": lastName, "aboutMe": aboutMe, "photoURL": photoURL });


      });


      let query = firebase.database().ref("Posts/" + userId).orderByKey();
      query.once("value")
          .then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {

                  //This is now returning every key belonging to the user ID
                  console.log("key: " + childSnapshot.key);
                  userPostKeys.push(childSnapshot.key);

                  console.log("child data: " + childSnapshot.val());
                  let result = childSnapshot.val();
                  console.log("child snapshot:" + childSnapshot.val());

              });

              //Now I have an array of all the push ids belonging to the current user
              console.log("Printing the keys array: " + userPostKeys);
              console.log("array length " + userPostKeys.length);

              let postList = document.getElementById("posts");


              for (let i = 0; i < userPostKeys.length; i = i + 1) {
                  firebase.database().ref('/Posts/' + userId + '/' + userPostKeys[i] + '/').once('value').then(function (snapshot) {
                      let text = (snapshot.val() && snapshot.val().Text);
                      let score = (snapshot.val() && snapshot.val().Score);
                      let timeStamp = (snapshot.val() && snapshot.val().Date) || 'There is no date';
                      let postPhotoURL = snapshot.val().photoURL;

                      let wholeDate = new Date(timeStamp);

                      let month = wholeDate.getUTCMonth() + 1; //months from 1-12
                      let day = wholeDate.getUTCDate();
                      let year = wholeDate.getUTCFullYear();

                      let date = day + "/" + month + "/" + year;

                      //hard coded for now
                      let picture = "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a";

                      console.log("Printing post " + i + " " + text);
                      //console.log(score);

                      let name = firstName + " " + lastName;

                      postsClone.push({ "name": name, "text": text, "score": score, "date": date, "photoURL": photoURL, "postPhotoURL": postPhotoURL, "postId": userPostKeys[i], "userId": userId });
                  });

              }
          });



  }

  deletePost(post) {

      let userId = firebase.auth().currentUser.uid;

      //Remove locally
      let index = this.posts.indexOf(post);

      if (index > -1) {
          this.posts.splice(index, 1);
      }

      console.log("Post is: " + post.postId);
      //remove from firebase
      //firebase.database().ref('/Posts/' + userId + '/' _+ post.postId);

      let postRef = firebase.database().ref('/Posts/' + userId);
      

      postRef.child(post.postId).remove().then(function () {
          
      });

  }

}
