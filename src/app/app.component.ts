import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ViewProfilePage } from '../pages/view_profile/view_profile';
import { FeedPage } from '../pages/feed/feed';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

      // Initialize Firebase
      var config = {
          apiKey: "AIzaSyCA7oNGZfG62iEMi7aFbKlTX2XOfW0G8Ng",
          authDomain: "login-2aa53.firebaseapp.com",
          databaseURL: "https://login-2aa53.firebaseio.com",
          projectId: "login-2aa53",
          storageBucket: "login-2aa53.appspot.com",
          messagingSenderId: "664593179188"
      };
      firebase.initializeApp(config);
      firebase.auth().onAuthStateChanged((user) => {

          if (!user) {
              console.log("not login");
              this.rootPage = Login;


          } else {
              console.log("login");
              this.rootPage = FeedPage;

          }

      });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
