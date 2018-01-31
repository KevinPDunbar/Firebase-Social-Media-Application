import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ViewProfilePage } from './view-profile';

@NgModule({
  declarations: [
    ViewProfilePage,
  ],
  imports: [
    //IonicModule.forChild(ViewProfilePage),
  ],
  exports: [
    ViewProfilePage
  ]
})
export class ViewProfilePageModule {}
