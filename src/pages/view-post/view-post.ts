import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';

import { ViewProfilePage } from '../view-profile/view-profile';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

/**
 * Generated class for the ViewPostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {

    public users = [];
    public posts = [];
    public comments = [];
    public unreadNotifications = [];

    public passedUserId;
    public passedPostId;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private view: ViewController, private streamingMedia: StreamingMedia) {

        this.passedUserId = navParams.get("userId");
        console.log("PASSED USER ID : " + this.passedUserId);
        this.passedPostId = navParams.get("postId");
        console.log("PASSED POST ID :" + this.passedPostId);
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ViewPostPage');
      this.getPost();
      //this.addComment();
      this.getComments();
      this.getUnreadCount();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.comments = [];
      this.unreadNotifications = [];

      this.getPost();
      this.getComments();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  closeModal() {
      this.view.dismiss();
  }

startVideo(url) {
    let options: StreamingVideoOptions = {
        successCallback: () => { console.log('Finished Video') },
        errorCallback: (e) => { console.log('Error: ', e) },
        orientation: 'portrait'
    };


    this.streamingMedia.playVideo(url, options);
}

    viewProfile(userId) {
        this.navCtrl.push(ViewProfilePage, {
            userId: userId
        })
    }

  showPrompt() {
      let prompt = this.alertCtrl.create({
          title: 'New Comment',
          message: "Enter your next post here",
          inputs: [
              {
                  name: 'text',
                  placeholder: 'Post'
              },
          ],
          buttons: [
              {
                  text: 'Cancel',
                  handler: data => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Create',
                  handler: data => {
                      console.log('Saved clicked');
                      console.log(data.text);
                      let newCommentText = data.text;
                      this.addComment(newCommentText);


                  }
              }
          ]
      });
      prompt.present();

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


  addComment(newCommentText)
  {

      let userId = this.passedUserId;
      let myId = firebase.auth().currentUser.uid;

      let postId = this.passedPostId;

      let commentsClone = [];
      let existingComments = this.comments;

      let commentUserId;
      let commentText;
      let firstName;
      let lastName;

      for (let i = 0; i < this.users.length; i++)
        {  
            this.users[i].commentLength++;
        }

      let comment = { "userId": myId, "comment": newCommentText };

      //

      firebase.database().ref('userProfile/' + myId)
        .once("value")
        .then(function (snapshot) {

            let firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
            let lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';
            let photoURL = (snapshot.val() && snapshot.val().profilePicture) || 'last name';

            console.log("COMMENTER: " + firstName + lastName);

            existingComments.unshift({ "text": newCommentText, "firstName": firstName, "lastName": lastName, "userId": commentUserId, "photoURL": photoURL });
        });         
      //

      

      firebase.database().ref('Posts/' + userId + '/' + postId + '/comments/')
          .once("value")
          .then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {

                  console.log("key: " + childSnapshot.key);

                  commentText = (childSnapshot.val() && childSnapshot.val().comment) || 'Comment';
                  commentUserId = (childSnapshot.val() && childSnapshot.val().userId) || 'user id';

                  commentsClone.push({ "comment": commentText, "userId": commentUserId });

              });

              commentsClone.push(comment);
              firebase.database().ref('Posts/' + userId + '/' + postId).child('comments').set(commentsClone);

             
              

              firebase.database().ref('Notifications/').push({
                  recieveId: userId,
                  pusherId: myId,
                  subject: "comment",
                  read: false,
                  commentOwnerId: userId,
                  postId: postId,
                  date: firebase.database.ServerValue.TIMESTAMP

              });


          });



      
     
  }

  getPost()
  {
      let userId = this.passedUserId;
      let postId = this.passedPostId;
      let myId = firebase.auth().currentUser.uid;


      let postsClone = this.posts;
      let userClone = this.users;


      let postText;
      let postScore;
      let postTimestamp;
      let date;
      let postPhotoURL; 
      let postVideoURL;
      let postVideoThumbURL;
      let score;
      let likes = [];
      let haveILiked;
      let diff;
      let commentLength;

      firebase.database().ref('Posts/' + userId + '/' + postId).once('value').then(function (snapshot) {
          postText = (snapshot.val() && snapshot.val().Text) || '';
          postScore = (snapshot.val() && snapshot.val().Score) || 'first name';
          postTimestamp = (snapshot.val() && snapshot.val().Date) || 'no date found';
          postPhotoURL = snapshot.val().photoURL;
          postVideoURL = snapshot.val().videoURL || '';
          postVideoThumbURL = snapshot.val().videoThumbURL || '';
          score = snapshot.val().score;
          likes = snapshot.val().likes || [];

          let comments = (snapshot.val() && snapshot.val().comments) || [];
          commentLength;
          if (comments.length > 0) {
              commentLength = comments.length;
          }
          else {
              commentLength = 0;
          }
          
          haveILiked = false;

          for (let i = 0; i < likes.length; i++) {
              if (likes[i] === myId) {
                  haveILiked = true;
              }
          }

          let wholeDate = new Date(postTimestamp);

          let month = wholeDate.getUTCMonth() + 1; //months from 1-12
          let day = wholeDate.getUTCDate();
          let year = wholeDate.getUTCFullYear();

          date = day + "/" + month + "/" + year; 

          //
          let now = new Date().getTime()

          diff = msToTime(now - postTimestamp);
          
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

          console.log("Post Text: " + postText + " Post Score " + postScore);
      })


      let email;
      let firstName;
      let lastName;
      let photoURL;

      firebase.database().ref('userProfile/' + userId).once('value').then(function (snapshot) {
          firstName = (snapshot.val() && snapshot.val().firstName) || '';
          lastName = (snapshot.val() && snapshot.val().lastName) || 'first name';
          photoURL = snapshot.val().profilePicture;

          console.log("First Name: " + firstName + " Last Name " + lastName);
          userClone.push({ "userId": userId, "firstName": firstName, "lastName": lastName, "text": postText, "date": diff, "score": postScore, "photoURL": photoURL, "postPhotoURL": postPhotoURL, "videoURL": postVideoURL, "thumbURL": postVideoThumbURL, "likes": likes, "haveILiked": haveILiked, "postId": postId, "commentLength": commentLength });
      })

      


      let userPostKeys = [];

      







      let userQuery = firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
          email = (snapshot.val() && snapshot.val().email) || 'email';
          firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
          lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';


      });


      


  }

  getComments()
  {
      let userId = this.passedUserId;
      let postId = this.passedPostId;
      let commentsClone = this.comments;

      

      firebase.database().ref('Posts/' + userId + '/' + postId + '/comments/')
          .once("value")
          .then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {

                  let firstName;
                  let lastName;
                  let commentText;
                  let commentUserId;
                  let photoURL;

                  console.log("key: " + childSnapshot.key);

                  commentText = (childSnapshot.val() && childSnapshot.val().comment) || 'Comment';
                  commentUserId = (childSnapshot.val() && childSnapshot.val().userId) || 'user id';

                  console.log("COMMENT TEXT: " + commentText)


                  firebase.database().ref('userProfile/' + commentUserId)
                      .once("value")
                      .then(function (snapshot) {
                          

                              console.log("key: " + childSnapshot.key);

                              firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
                              lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';
                              photoURL = (snapshot.val() && snapshot.val().profilePicture) || 'last name';

                              console.log("COMMENTER: " + firstName + lastName); 

                              commentsClone.push({ "text": commentText, "firstName": firstName, "lastName": lastName, "userId": commentUserId, "photoURL": photoURL });
                          });

                  
                  console.log("COMMENT TO PUSH TEST: " + commentText + " fff " + firstName);
                             

              });

          });
  }

  likePost() {

      let ownerId = this.passedUserId;
      let postId = this.passedPostId;
      let myId = firebase.auth().currentUser.uid;
      let score;
      let likes = [];

      for (let i = 0; i < this.users.length; i++)
          if (this.users[i].postId === postId) {
              console.log("POST FOUND and liked");
              this.users[i].haveILiked = true;
              this.users[i].score++;
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

  unlikePost() {

      let ownerId = this.passedUserId;
      let postId = this.passedPostId;
      let myId = firebase.auth().currentUser.uid;
      let score;
      let likes = [];
      let updatedLikes = [];

      for (let i = 0; i < this.users.length; i++)
          if (this.users[i].postId === postId) {
              console.log("POST FOUND and unliked");
              this.users[i].haveILiked = false;
              this.users[i].score--;
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
