import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ViewPostPage } from './view-post';

@NgModule({
  declarations: [
    ViewPostPage,
  ],
  imports: [
    //IonicModule.forChild(ViewPostPage),
  ],
  exports: [
    ViewPostPage
  ]
})
export class ViewPostPageModule {}
