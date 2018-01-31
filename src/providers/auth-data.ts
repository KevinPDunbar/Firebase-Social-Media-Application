import { Injectable } from '@angular/core';
import firebase from 'firebase';

let keys = [];

@Injectable()
export class AuthData {
    constructor() {  }


  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): firebase.Promise<any> {

      return firebase.auth().signInWithEmailAndPassword(email, password);

  }

  getUser()
  {
      console.log("getting the user");

         //console.log(firebase.auth().currentUser); FOR WHOLE USER OBJECT

      let user = firebase.auth().currentUser;
      /*console.log(user);
   
      console.log("user email:" + user.email);
      console.log("user display name: " + user.displayName);

      user.updateProfile({
          displayName: "Jane Q. User",
          photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function () {
          // Profile updated successfully!
          // "Jane Q. User"
          var displayName = user.displayName;

          // "https://example.com/jane-q-user/profile.jpg"
          var photoURL = user.photoURL;
      }, function (error) {
          // An error happened.
          });

      console.log("user display name: " + user.displayName); */

      let userId = user.uid;

      return firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
          var email = (snapshot.val() && snapshot.val().email) || 'Anonymous';
          var name = (snapshot.val() && snapshot.val().firstName) || 'Anonymous';

          console.log(email + ' ' + name);
          // ...
      });
  }

  submitPost(post: string) {
      console.log("getting the user");

      //console.log(firebase.auth().currentUser); FOR WHOLE USER OBJECT

      let user = firebase.auth().currentUser;
      let userId = user.uid;

      /*firebase.database().ref('/Posts').child(userId).set({
          Text: "THis is a texttt",
          Score: 0
      });*/

      firebase.database().ref('/Posts').child(userId).push({
          Text: post,
          Score: 0,
          UserId: userId
      });

      var newPostKey = firebase.database().ref().child('/Posts').push().key;
      console.log(newPostKey);

  }

  getPosts()
  {
      let user = firebase.auth().currentUser;
      let userId = user.uid;

      let Posts = firebase.database().ref('Posts/' + userId);
  
      console.log(Posts);

          let userPostKeys = [];

          var query = firebase.database().ref("Posts/" + userId).orderByKey();
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

                  for (let i = 0; i < userPostKeys.length; i = i + 1)
                  {
                         firebase.database().ref('/Posts/' + userId + '/' + userPostKeys[i] + '/').once('value').then(function (snapshot) {
                          let text = (snapshot.val() && snapshot.val().Text) || 'There is no post text';
                          let score = (snapshot.val() && snapshot.val().Score).toString || 'There is no post score';

                          console.log("Printing post " + i + " " + text);
                          //console.log(score);


                    });
                  }
              });

      
      
  }

 


  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(email: string, password: string, firstName: string, lastName: string): firebase.Promise<any> {
      return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
         // firebase.database().ref('/users').child(email).set({
          //    firstName: "anonymous",
           //   id:newUser.uid,
         // });

          //let friends = ["ibngin", "fivngvin", "fbnbbkgnk"];

          firebase.database().ref('/userProfile').child(newUser.uid).set({
              firstName: firstName,
              lastName: lastName,
              email: email,
              profilePicture: "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a",
              following: ["g", "g"]
          });


    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

  setPushId(newKey: String)
  {
      console.log(newKey);
      keys.push(newKey);
      console.log(keys);
  }

  getPushId()
  {
      return keys;
  }

}
