import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { EditUserPage } from './edit-user';

@NgModule({
  declarations: [
    EditUserPage,
  ],
  imports: [
    //IonicModule.forChild(EditUserPage),
  ],
  exports: [
    EditUserPage
  ]
})
export class EditUserPageModule {}
