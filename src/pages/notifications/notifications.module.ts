import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    //IonicModule.forChild(NotificationsPage),
  ],
  exports: [
    NotificationsPage
  ]
})
export class NotificationsPageModule {}
