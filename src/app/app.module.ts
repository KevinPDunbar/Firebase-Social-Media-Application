import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { FeedPage } from '../pages/feed/feed';
import { NewPostPage } from '../pages/new-post/new-post';
import { ViewProfilePage } from '../pages/view-profile/view-profile';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ViewPostPage } from '../pages/view-post/view-post';
import { SearchPage } from '../pages/search/search';
import { NotificationsPage } from '../pages/notifications/notifications';

import { Login } from '../pages/login/login';

import {ResetPassword}from '../pages/reset-password/reset-password';
import {Signup} from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthData } from '../providers/auth-data';

import { Camera } from '@ionic-native/camera';

import { Config } from 'ionic-angular';
import { ModalScaleUpEnterTransition } from '../scale-up-enter.transition';
import { ModalScaleUpLeaveTransition } from '../scale-up-leave.transition';




@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
      TabsPage,
      Login,
      ResetPassword,
      Signup,
      EditUserPage,
      FeedPage,
      NewPostPage,
      ViewProfilePage,
      MyProfilePage,
      EditProfilePage,
      ViewPostPage,
      SearchPage,
      NotificationsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
      TabsPage,
      Login,
      ResetPassword,
      Signup,
      EditUserPage,
      FeedPage,
      NewPostPage,
      ViewProfilePage,
      MyProfilePage,
      EditProfilePage,
      ViewPostPage,
      SearchPage,
      NotificationsPage
  ],
  providers: [
      AuthData,
    StatusBar,
      SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
    constructor(public config: Config) {
        this.setCustomTransitions();
    }

    private setCustomTransitions() {
        this.config.setTransition('modal-scale-up-leave', ModalScaleUpLeaveTransition);
        this.config.setTransition('modal-scale-up-enter', ModalScaleUpEnterTransition);
    }
}
