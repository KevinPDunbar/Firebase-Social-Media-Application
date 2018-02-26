import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';

import { ViewProfilePage } from '../view-profile/view-profile';
import { NotificationsPage } from '../notifications/notifications';
import { MyProfilePage } from '../my-profile/my-profile';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

    public users = [];
    public unreadNotifications = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad SearchPage');
      this.getUnreadCount();
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

    search($event) {



        this.users = [];

        let results = this.users;

        let q = $event.target.value || '';
        console.log("Q IS: " + q);

        let userRef = firebase.database().ref('userProfile/')
            .once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    console.log("CHILDSNAP : " + childSnapshot.val().firstName);

                    let firstName = childSnapshot.val().firstName;
                    let lastName = childSnapshot.val().lastName;
                    let photoURL = childSnapshot.val().profilePicture;
                    let userId = childSnapshot.key;

                    let fullName = (firstName + " " + lastName).toUpperCase();
                    fullName.toUpperCase();

                    console.log("LENGTH: " + q.length);
                    let query = q.toUpperCase();
                    

                    if (fullName.startsWith(query)) {
                        results.push({ "firstName": firstName, "lastName": lastName, "userId": userId, "photoURL": photoURL });
                    }



                })

            })


    }

    viewProfile(userId) {
        console.log("THE PASSED IN ID :" + userId);
        // this.navCtrl.push(ViewProfilePage);
        let myUserId = firebase.auth().currentUser.uid;
        if (userId === myUserId)
        {
            this.viewMyProfile();
        }
        else
        {
            this.navCtrl.push(ViewProfilePage, {
                userId: userId
            })
        }

        
    }

    viewMyProfile() {
        this.navCtrl.push(MyProfilePage);
    }

}
