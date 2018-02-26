import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { NotificationsPage } from '../notifications/notifications';
import { Login } from '../login/login';
/**
 * Generated class for the EditProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

    public users = [];
    public unreadNotifications = [];
    public editProfileForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private camera: Camera, public authData: AuthData) {

        this.editProfileForm = formBuilder.group({
            firstName: ['', Validators.compose([Validators.required])],
            lastName: ['', Validators.compose([Validators.required])],
            aboutMe: ['', Validators.compose([Validators.required])]
        });

  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad EditProfilePage');
      this.getMyProfile();
      this.getUnreadCount();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.users = [];
      this.getMyProfile();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
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

  async takeProfilePicture()
  {
      let userId = firebase.auth().currentUser.uid;
      const time = firebase.database.ServerValue.TIMESTAMP;

      try {
          const options: CameraOptions = {
              quality: 100,
              targetWidth: 600,
              targetHeight: 600,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
          }

          const result = await this.camera.getPicture(options);

          const image = 'data:image/jpeg;base64,' + result;

          const pictures = firebase.storage().ref('/' + userId + '/' + 'profilePicure');
          pictures.putString(image, `data_url`);

          //let downloadURL = firebase.storage().ref('pictures').getDownloadURL.toD;

          let returnVal;

          firebase.storage().ref(userId + '/' + 'profilePicure').getDownloadURL().then(function (url) {
              // Execute (unknown)
              returnVal = url;
              firebase.database().ref('/userProfile/' + userId).child('profilePicture').set(returnVal);
          })




      }
      catch (e) {
          console.log(e);
      }

  }


  getMyProfile() {

      let userId = firebase.auth().currentUser.uid;

      let userClone = this.users;

      let firstName;
      let lastName;
      let photoUrl;
      let aboutMe;

      let userPostKeys = [];

      let textArea = document.getElementById("aboutMe");


      let userQuery = firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
          firstName =snapshot.val().firstName;
          lastName = snapshot.val().lastName;
          photoUrl = snapshot.val().profilePicture;
          aboutMe = snapshot.val().aboutMe;

   


          userClone.push({ "firstName": firstName, "lastName": lastName, "photoURL": photoUrl, "aboutMe": aboutMe });


      });


  }

  updateProfile() {

      let userId = firebase.auth().currentUser.uid;

      let firstName = this.editProfileForm.value.firstName || this.users[0].firstName;
      let lastName = this.editProfileForm.value.lastName || this.users[0].lastName;
      let aboutMe = this.editProfileForm.value.aboutMe || this.users[0].aboutMe;

     

      console.log("First Name :" + firstName + " Last Name :" + lastName + " About Me: " + aboutMe);



      firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {


          firebase.database().ref('/userProfile/' + userId).child('firstName').set(firstName);
          firebase.database().ref('/userProfile/' + userId).child('lastName').set(lastName);
          firebase.database().ref('/userProfile/' + userId).child('aboutMe').set(aboutMe);
          
   
      }); 
     
    

      
  }

  logOut() {
      this.authData.logoutUser().then(() => {
          this.navCtrl.setRoot(Login);
      });
  }

}
