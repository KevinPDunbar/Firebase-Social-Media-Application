import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';

import { ViewPostPage } from '../view-post/view-post';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
 * Generated class for the NotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

    public notifications = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthData) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad NotificationsPage');
      this.getNotifications();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.notifications = [];

      this.getNotifications();
      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  viewPost(commentOwnerId, postId, notificationId) {
      console.log("THE PASSED IN ID :" + commentOwnerId);
      console.log("THE PASSED IN POST ID : " + postId);

      firebase.database().ref('/Notifications/' + notificationId).child('read').set(true);

      for (let i = 0; i < this.notifications.length; i++)
      {
          if (this.notifications[i].notificationId === notificationId)
          {
              this.notifications[i].read = true;
              break;
          }
      }

      this.navCtrl.push(ViewPostPage, {
          userId: commentOwnerId,
          postId: postId
      })
  }

  viewProfile(pusherId, notificationId) {
      console.log("TPusher ID :" + pusherId);
      // this.navCtrl.push(ViewProfilePage);

      for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].notificationId === notificationId) {
              this.notifications[i].read = true;
              break;
          }
      }

      firebase.database().ref('/Notifications/' + notificationId).child('read').set(true);

      this.navCtrl.push(ViewProfilePage, {
          userId: pusherId
      })
  }

  getNotifications() {
      let userId = firebase.auth().currentUser.uid;
      let notificationsClone = this.notifications;

      let pusherId;
      let read;
      let subject;
      let pusherName;
      let pusherPhotoURL;
      let commentOwnerId;
      let postId;
      let date;

      let ref = firebase.database().ref("Notifications");
      ref.once("value")
          .then(function (snapshot) {

              
              snapshot.forEach(function (childSnapshot) {
                 
                  console.log("CHILDSNAP : " + childSnapshot.val().recieveId);
                  console.log("KEY: " + childSnapshot.key);

                  console.log("CHILDSNAP SUBJECT: " + childSnapshot.val().subject);
                  console.log("UNREAD: " + childSnapshot.val().recieveId);
                  if (childSnapshot.val().recieveId === userId) {

                      console.log("CHILD SNAPSHOT: " + childSnapshot);
                     // unreadClone.push(1);
                      pusherId = childSnapshot.val().pusherId;
                      read = childSnapshot.val().read;
                      subject = childSnapshot.val().subject;
                      commentOwnerId = childSnapshot.val().commentOwnerId;
                      postId = childSnapshot.val().postId;
                      date = childSnapshot.val().date;

                      console.log("read: " + read);

                      firebase.database().ref('userProfile/' + pusherId).once('value').then(function (snapshot) {
                          pusherName = (snapshot.val() && snapshot.val().firstName) + " " + (snapshot.val() && snapshot.val().lastName);
                          pusherPhotoURL = snapshot.val().profilePicture;

                          notificationsClone.push({ "pusherName": pusherName, "pusherPhotoURL": pusherPhotoURL, "read": childSnapshot.val().read, "subject": childSnapshot.val().subject, "commentOwnerId": childSnapshot.val().commentOwnerId, "postId": childSnapshot.val().postId, "pusherId": childSnapshot.val().pusherId, "notificationId": childSnapshot.key, "date": childSnapshot.val().date });

                          for (let i = 0; i < notificationsClone.length; i++) {
                              notificationsClone.sort(function (a, b) {
                                  return -(a.date - b.date);
                              });
                          }

                          
                      })

                      
                  }

                  

              })

             

          })

      
  }

}
