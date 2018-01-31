import { Component } from '@angular/core';
import { AuthData } from '../../providers/auth-data';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPage');
  }

  getUser() {
      console.log(this.authData.getUser());
  }

}
