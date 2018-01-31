import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';

@NgModule({
  declarations: [
    EditProfilePage,
  ],
  imports: [
    //IonicModule.forChild(EditProfilePage),
  ],
  exports: [
    EditProfilePage
  ]
})
export class EditProfilePageModule {}
