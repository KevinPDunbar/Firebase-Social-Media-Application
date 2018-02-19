import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

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

      let commentUserId;
      let commentText;
      let firstName;
      let lastName;


      let comment = { "userId": myId, "comment": newCommentText };

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



      let postsClone = this.posts;
      let userClone = this.users;


      let postText;
      let postScore;
      let postTimestamp;
      let date;
      let comments;
      let postPhotoURL;

      firebase.database().ref('Posts/' + userId + '/' + postId).once('value').then(function (snapshot) {
          postText = (snapshot.val() && snapshot.val().Text) || '';
          postScore = (snapshot.val() && snapshot.val().Score) || 'first name';
          postTimestamp = (snapshot.val() && snapshot.val().Date) || 'no date found';
          postPhotoURL = snapshot.val().photoURL;

          let wholeDate = new Date(postTimestamp);

          let month = wholeDate.getUTCMonth() + 1; //months from 1-12
          let day = wholeDate.getUTCDate();
          let year = wholeDate.getUTCFullYear();

          date = day + "/" + month + "/" + year; 

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
          userClone.push({ "userId": userId, "firstName": firstName, "lastName": lastName, "text": postText, "date": date, "score": postScore, "photoURL": photoURL, "postPhotoURL": postPhotoURL });
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

}
