import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MyProfilePage } from './my-profile';

@NgModule({
  declarations: [
    MyProfilePage,
  ],
  imports: [
    //IonicModule.forChild(MyProfilePage),
  ],
  exports: [
    MyProfilePage
  ]
})
export class MyProfilePageModule {}
