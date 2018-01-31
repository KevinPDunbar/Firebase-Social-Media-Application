import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { Login } from '../login/login';
import { EditUserPage } from '../edit-user/edit-user';
import { FeedPage } from '../feed/feed';
import { NewPostPage } from '../new-post/new-post';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    editUserPage: EditUserPage;

    constructor(public navCtrl: NavController, public authData: AuthData) {

    }
    getUser() {

        


    }

    goToEditUser()
    {
        this.navCtrl.push(EditUserPage);
    }

    goToFeed()
    {
        this.navCtrl.push(FeedPage);
    }

    goToNewPost()
    {
        this.navCtrl.push(NewPostPage);
    }

  logOut() {
      this.authData.logoutUser().then(() => {
          this.navCtrl.setRoot(Login);
      });
  }
}
