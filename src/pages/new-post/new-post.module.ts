import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NewPostPage } from './new-post';

@NgModule({
  declarations: [
    NewPostPage,
  ],
  imports: [
    //IonicModule.forChild(NewPostPage),
  ],
  exports: [
    NewPostPage
  ]
})
export class NewPostPageModule {}
