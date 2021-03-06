import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions } from 'ionic-angular';
import firebase from 'firebase';
import { AuthData } from '../../providers/auth-data';
import { ViewPostPage } from '../view-post/view-post';
import { NotificationsPage } from '../notifications/notifications';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

/**
 * Generated class for the ViewProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

    public passedUserId;
    public posts = [];
    public users = [];


    public follows = [];
    public unreadNotifications = [];

    


    public isFollowing = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController, private streamingMedia: StreamingMedia) {

        this.passedUserId = navParams.get("userId");
        console.log("PASSED USER ID : " + this.passedUserId);
        let userId = this.passedUserId;
        
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ViewProfilePage');
      this.getUserPosts();
      this.amIFollowing();
      this.getUnreadCount();

  }


  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.unreadNotifications = [];
      this.getUserPosts();
      this.amIFollowing();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

    startVideo(url) {
        let options: StreamingVideoOptions = {
            successCallback: () => { console.log('Finished Video') },
            errorCallback: (e) => { console.log('Error: ', e) },
            orientation: 'portrait'
        };


        this.streamingMedia.playVideo(url, options);
    }

  goToNotificationsPage() {
      this.navCtrl.push(NotificationsPage);
  }

openModal(userId, postId) {

    const options: ModalOptions = {
        showBackdrop: true,
        enableBackdropDismiss: true,
        enterAnimation: 'modal-scale-up-enter',
        leaveAnimation: 'modal-scale-up-leave',

    }

    const myModal = this.modal.create(ViewPostPage, { userId, postId }, options);

    myModal.present();
}

  getUnreadCount() {

      let myId = firebase.auth().currentUser.uid;
      let unreadClone = this.unreadNotifications;

      let ref = firebase.database().ref("Notifications");
      ref.orderByChild("read").equalTo(false).once("value")
          .then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                  //console.log("CHILDSNAP : " + childSnapshot.val().firstName);


                  console.log("UNREAD: " + childSnapshot.val().recieveId);
                  if (childSnapshot.val().recieveId === myId) {
                      unreadClone.push(1);
                  }

              })

          })
  }


  viewPost(userId, postId) {
      console.log("THE PASSED IN ID :" + userId);
      console.log("THE PASSED IN POST ID : " + userId);
      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewPostPage, {
          userId: userId,
          postId: postId
      })
  }
 

  getUserPosts()
  {


      let userId = this.passedUserId;


      let postsClone = this.posts;
      let userClone = this.users;

      let user = firebase.auth().currentUser;

      let Posts = firebase.database().ref('Posts/' + userId);

      let email;
      let firstName;
      let lastName;
      let aboutMe;
      let photoURL;

      let userPostKeys = [];


      let userQuery = firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
          email = (snapshot.val() && snapshot.val().email) || 'email';
          firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
          lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';
          aboutMe = (snapshot.val() && snapshot.val().aboutMe) || 'User has no bio';
          photoURL = snapshot.val().profilePicture;

          userClone.push({ "firstName": firstName, "lastName": lastName, "aboutMe": aboutMe, "photoURL": photoURL });
      });


      let query = firebase.database().ref("Posts/" + userId).orderByKey();
      query.once("value")
          .then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {

                  //This is now returning every key belonging to the user ID
                  console.log("key: " + childSnapshot.key);
                  userPostKeys.push(childSnapshot.key);

                  console.log("child data: " + childSnapshot.val());
                  let result = childSnapshot.val();
                  console.log("child snapshot:" + childSnapshot.val());

              });

              //Now I have an array of all the push ids belonging to the current user
              console.log("Printing the keys array: " + userPostKeys);
              console.log("array length " + userPostKeys.length);

              let postList = document.getElementById("posts");


              for (let i = 0; i < userPostKeys.length; i = i + 1) {
                  firebase.database().ref('/Posts/' + userId + '/' + userPostKeys[i] + '/').once('value').then(function (snapshot) {
                      let text = (snapshot.val() && snapshot.val().Text);
                      let score = (snapshot.val() && snapshot.val().Score);
                      let timeStamp = (snapshot.val() && snapshot.val().Date);
                      let postPhotoURL = snapshot.val().photoURL;
                      let postVideoURL = snapshot.val().videoURL || '';
                      let postVideoThumbURL = snapshot.val().videoThumbURL || '';
                      let likes = snapshot.val().likes || [];
                      let comments = snapshot.val().comments || [];
                      let haveIliked = false;
                      let myId = firebase.auth().currentUser.uid;

                      let commentLength;
                      if (comments.length > 0) {
                          commentLength = comments.length;
                      }
                      else {
                          commentLength = 0;
                      }


                      for (let i = 0; i < likes.length; i++) {
                          if (likes[i] === myId) {
                              haveIliked = true;
                          }
                      }

                      let wholeDate = new Date(timeStamp);

                      let month = wholeDate.getUTCMonth() + 1; //months from 1-12
                      let day = wholeDate.getUTCDate();
                      let year = wholeDate.getUTCFullYear();

                      let date = day + "/" + month + "/" + year; 

                      //
                      let now = new Date().getTime()

                      let diff = msToTime(now - timeStamp);

                      console.log(diff.toString());

                      function msToTime(s) {
                          var ms = s % 1000;
                          s = (s - ms) / 1000;
                          var secs = s % 60;
                          s = (s - secs) / 60;
                          var mins = s % 60;
                          var hrs = (s - mins) / 60;
                          if (hrs == 0 && mins == 0)
                              return 'just now';
                          else if (hrs == 0)
                              return mins + ' mins ago';
                          else if (hrs < 24)
                              return hrs + ' hours ago';
                          else
                              return Math.floor(hrs / 24) + ' days ago';
                      }
                                    //

                      

                      console.log("Printing post " + i + " " + text);
                      //console.log(score);

                      let name = firstName + " " + lastName;
                      

                      postsClone.unshift({ "name": name, "text": text, "score": score, "date": diff, "photoURL": photoURL, "postPhotoURL": postPhotoURL, "videoURL": postVideoURL, "thumbURL": postVideoThumbURL, "userId": userId, "postId": userPostKeys[i], "likes": likes, "haveILiked": haveIliked, "commentLength": commentLength });
                  });
          
              }
          });


  }

  amIFollowing()
  {
      let idToFollow = this.passedUserId;
      let userId = firebase.auth().currentUser.uid;

      let followButton = document.getElementById("followButton");
      let unfollowButton = document.getElementById("unfollowButton");

      let amIFollowing = this.isFollowing;
      let following;
      let name;

      this.follows = [];
      let followsClone = this.follows;
      //followsClone = [];

      

      firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {

          //name = (snapshot.val() && snapshot.val().firstName) || 'no following found';
          following = (snapshot.val() && snapshot.val().following) || 'no following found';

          for (let i = 0; i < following.length; i++)
          {
              if (following[i] == idToFollow)
              {
                  console.log("You are following this user already");
                  amIFollowing = true;
                  //followButton.innerHTML = "Unfollow";
                  //followButton.style.display = "none";
                    
                                    
                  
              }
              
          }

          if (amIFollowing === true)
          {
              console.log("You are following this user already");
              //followButton.innerHTML = "Unfollow";
              followsClone.push({ "following": true });
          }
          else
          {
              console.log("You are NOT following this user already");
              //followButton.innerHTML = "Follow";
              followsClone.push({ "following": false });
          }

      });
  }

  

  unFollowUser()
  {
      let idToUnFollow = this.passedUserId;
      let userId = firebase.auth().currentUser.uid;

      let following;

      this.follows[0].following = false;

      firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {

          following = (snapshot.val() && snapshot.val().following) || 'no following found';

          console.log("FOLLOWING BEFORE: " + following);

          let updatedFollowing = following.filter(function (id) {
              return id != idToUnFollow;
          });


          console.log("Following AFTER" + updatedFollowing);

          firebase.database().ref('/userProfile/' + userId).child('following').set(updatedFollowing);
          
      });
    

  }

  followUser()
  {
      let idToFollow = this.passedUserId;
      let userId = firebase.auth().currentUser.uid;

      let following = [];
      let name;

      this.follows[0].following = true;

      firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
          
          //name = (snapshot.val() && snapshot.val().firstName) || 'no following found';
          following = (snapshot.val() && snapshot.val().following) || 'no following found';

          //userClone.push({ "firstName": firstName, "lastName": lastName });
          console.log("FOLLOWING BEFORE: " + following);

          following.push(idToFollow);
          console.log("Following AFTER" + following);

          firebase.database().ref('/userProfile/' + userId).child('following').set(following);



          firebase.database().ref('Notifications/').push({
              recieveId: idToFollow,
              pusherId: userId,
              subject: "follow",
              read: false,
              commentOwnerId: "",
              postId: "",
              date: firebase.database.ServerValue.TIMESTAMP

          });
          
      });

      
  }

  likePost(post, userId, postId) {

      let ownerId = userId;
      let myId = firebase.auth().currentUser.uid;
      let score;
      let likes = [];

      console.log("post: " + post.postId);
      for (let i = 0; i < this.posts.length; i++)
          if (this.posts[i].postId === postId) {
              console.log("POST FOUND and liked");
              this.posts[i].haveILiked = true;
              this.posts[i].score++;
              break;
          }


      let Query = firebase.database().ref('/Posts/' + userId + '/' + postId).once('value').then(function (snapshot) {
          likes = (snapshot.val() && snapshot.val().likes) || [];
          score = (snapshot.val() && snapshot.val().Score);
          likes.push(myId);
          score = score + 1;

          firebase.database().ref('/Posts/' + userId + '/' + postId).child('likes').set(likes);
          firebase.database().ref('/Posts/' + userId + '/' + postId).child('Score').set(score);

          firebase.database().ref('Notifications/').push({
              recieveId: ownerId,
              pusherId: myId,
              subject: "like",
              read: false,
              commentOwnerId: ownerId,
              postId: postId,
              date: firebase.database.ServerValue.TIMESTAMP

          });

      });


  }

  unlikePost(post, userId, postId) {

      let ownerId = userId;
      let myId = firebase.auth().currentUser.uid;
      let score;
      let likes = [];
      let updatedLikes = [];

      console.log("post: " + post.postId);
      for (let i = 0; i < this.posts.length; i++)
          if (this.posts[i].postId === postId) {
              console.log("POST FOUND and unliked");
              this.posts[i].haveILiked = false;
              this.posts[i].score--;
              break;
          }

      let Query = firebase.database().ref('/Posts/' + userId + '/' + postId).once('value').then(function (snapshot) {
          likes = (snapshot.val() && snapshot.val().likes) || [];
          score = (snapshot.val() && snapshot.val().Score);
          likes.push(myId);


          for (let i = 0; i < likes.length; i++) {
              if (likes[i] != myId) {
                  updatedLikes.push(likes[i]);
              }
          }

          score = score - 1;

          firebase.database().ref('/Posts/' + userId + '/' + postId).child('likes').set(updatedLikes);
          firebase.database().ref('/Posts/' + userId + '/' + postId).child('Score').set(score);

      });


  }

}
