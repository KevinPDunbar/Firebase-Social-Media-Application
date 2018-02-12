import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
    public editProfileForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private camera: Camera) {

        this.editProfileForm = formBuilder.group({
            firstName: ['', Validators.compose([Validators.required])],
            lastName: ['', Validators.compose([Validators.required])],
            aboutMe: ['', Validators.compose([Validators.required])]
        });

  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad EditProfilePage');
      this.getMyProfile();
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

  Refreshh() {
      console.log('Begin async operation');
      this.users = [];
      this.getMyProfile();

      setTimeout(() => {
          console.log('Async operation has ended');
          //refresher.complete();
      }, 2000);
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
          firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
          lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';
          photoUrl = (snapshot.val() && snapshot.val().profilePicture) || 'last name';
          aboutMe = (snapshot.val() && snapshot.val().aboutMe) || 'last name';
          


          userClone.push({ "firstName": firstName, "lastName": lastName, "photoURL": photoUrl });


      });


  }

  updateProfile() {

      let userId = firebase.auth().currentUser.uid;

      let firstName = this.editProfileForm.value.firstName;
      let lastName = this.editProfileForm.value.lastName;
      let aboutMe = this.editProfileForm.value.aboutMe;

      console.log("First Name :" + firstName + " Last Name :" + lastName + " About Me: " + aboutMe);



      firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {


          firebase.database().ref('/userProfile/' + userId).child('firstName').set(firstName);
          firebase.database().ref('/userProfile/' + userId).child('lastName').set(lastName);
          firebase.database().ref('/userProfile/' + userId).child('aboutMe').set(aboutMe);
          
   
      });
      this.Refreshh();
    

      
  }

}
