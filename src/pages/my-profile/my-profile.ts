import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';

import { EditProfilePage } from '../edit-profile/edit-profile';
import { ViewPostPage } from '../view-post/view-post';
import { NotificationsPage } from '../notifications/notifications';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

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
    public unreadNotifications = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController, private streamingMedia: StreamingMedia) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MyProfilePage');
      this.getUserPosts();
      this.getUnreadCount();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.unreadNotifications = [];

      this.getUserPosts();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

openModal(userId, postId) {

    const options: ModalOptions = {
        showBackdrop: true,
        enableBackdropDismiss: true,
        enterAnimation: 'modal-scale-up-enter',
        leaveAnimation: 'modal-scale-up-leave',

    }

    const myModal = this.modal.create(ViewPostPage, { userId, postId }, options);

    myModal.present();
}

startVideo(url) {
    let options: StreamingVideoOptions = {
        successCallback: () => { console.log('Finished Video') },
        errorCallback: (e) => { console.log('Error: ', e) },
        orientation: 'portrait'
    };


    this.streamingMedia.playVideo(url, options);
}

  goToNotificationsPage() {
      this.navCtrl.push(NotificationsPage);
  }

  getUnreadCount() {

      let myId = firebase.auth().currentUser.uid;
      let unreadClone = this.unreadNotifications;

      let ref = firebase.database().ref("Notifications");
      ref.orderByChild("read").equalTo(false).once("value")
          .then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                  //console.log("CHILDSNAP : " + childSnapshot.val().firstName);


                  console.log("UNREAD: " + childSnapshot.val().recieveId);
                  if (childSnapshot.val().recieveId === myId) {
                      unreadClone.push(1);
                  }

              })

          })
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
                      let postVideoURL = snapshot.val().videoURL || '';
                      let postVideoThumbURL = snapshot.val().videoThumbURL || '';
                      let likes = snapshot.val().likes || [];
                      let comments = snapshot.val().comments || [];
                      let haveILiked = false;
                      let myId = firebase.auth().currentUser.uid;
                      let postId = userPostKeys[i];

                      for (let i = 0; i < likes.length; i++) {
                          if (likes[i] === myId) {
                              haveILiked = true;
                          }
                      }

                      let commentLength;
                      if (comments.length > 0) {
                          commentLength = comments.length;
                      }
                      else {
                          commentLength = 0;
                      }

                      let wholeDate = new Date(timeStamp);

                      let month = wholeDate.getUTCMonth() + 1; //months from 1-12
                      let day = wholeDate.getUTCDate();
                      let year = wholeDate.getUTCFullYear();

                      let date = day + "/" + month + "/" + year;

                      //
                      let now = new Date().getTime()

                      let diff = msToTime(now - timeStamp);

                      console.log(diff.toString());

                      function msToTime(s) {
                          var ms = s % 1000;
                          s = (s - ms) / 1000;
                          var secs = s % 60;
                          s = (s - secs) / 60;
                          var mins = s % 60;
                          var hrs = (s - mins) / 60;
                          if (hrs == 0 && mins == 0)
                              return 'just now';
                          else if (hrs == 0)
                              return mins + ' mins ago';
                          else if (hrs < 24)
                              return hrs + ' hours ago';
                          else
                              return Math.floor(hrs / 24) + ' days ago';
                      }
                                    //


                      console.log("Printing post " + i + " " + text);
                      //console.log(score);

                      let name = firstName + " " + lastName;

                      postsClone.unshift({ "name": name, "text": text, "score": score, "date": diff, "photoURL": photoURL, "videoURL": postVideoURL, "thumbURL": postVideoThumbURL, "postPhotoURL": postPhotoURL, "postId": userPostKeys[i], "userId": userId, "likes": likes, "haveILiked": haveILiked, "commentLength": commentLength });
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

  likePost(post, userId, postId) {

      let ownerId = firebase.auth().currentUser.uid;;
      let myId = firebase.auth().currentUser.uid;
      let score;
      let likes = [];

      for (let i = 0; i < this.posts.length; i++)
          if (this.posts[i].postId === postId) {
              console.log("POST FOUND and liked");
              this.posts[i].haveILiked = true;
              this.posts[i].score++;
              break;
          }


      let Query = firebase.database().ref('/Posts/' + ownerId + '/' + postId).once('value').then(function (snapshot) {
          likes = (snapshot.val() && snapshot.val().likes) || [];
          score = (snapshot.val() && snapshot.val().Score);
          likes.push(myId);
          score = score + 1;

          firebase.database().ref('/Posts/' + ownerId + '/' + postId).child('likes').set(likes);
          firebase.database().ref('/Posts/' + ownerId + '/' + postId).child('Score').set(score);

          firebase.database().ref('Notifications/').push({
              recieveId: ownerId,
              pusherId: myId,
              subject: "like",
              read: false,
              commentOwnerId: ownerId,
              postId: postId,
              date: firebase.database.ServerValue.TIMESTAMP

          });

      });


  }

  unlikePost(post, userId, postId) {

      let ownerId = firebase.auth().currentUser.uid;
      let myId = firebase.auth().currentUser.uid;
      let score;
      let likes = [];
      let updatedLikes = [];

      for (let i = 0; i < this.posts.length; i++)
          if (this.posts[i].postId === postId) {
              console.log("POST FOUND and unliked");
              this.posts[i].haveILiked = false;
              this.posts[i].score--;
              break;
          }

      let Query = firebase.database().ref('/Posts/' + ownerId + '/' + postId).once('value').then(function (snapshot) {
          likes = (snapshot.val() && snapshot.val().likes) || [];
          score = (snapshot.val() && snapshot.val().Score);
          likes.push(myId);


          for (let i = 0; i < likes.length; i++) {
              if (likes[i] != myId) {
                  updatedLikes.push(likes[i]);
              }
          }

          score = score - 1;

          firebase.database().ref('/Posts/' + ownerId + '/' + postId).child('likes').set(updatedLikes);
          firebase.database().ref('/Posts/' + ownerId + '/' + postId).child('Score').set(score);

      });


  }

}
