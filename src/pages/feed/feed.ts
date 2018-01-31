import { Component } from '@angular/core';
import { AuthData } from '../../providers/auth-data';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ViewProfilePage } from '../view-profile/view-profile';
import { MyProfilePage } from '../my-profile/my-profile';
import { ViewPostPage } from '../view-post/view-post';

/**
 * Generated class for the FeedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-feed',
    templateUrl: 'feed.html',
})

export class FeedPage {
    public items = [];

    public users = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthData, public alertCtrl: AlertController, private camera: Camera) {

 
    }


    ionViewDidLoad() {

        console.log('ionViewDidLoad FeedPage');
        this.getFollowing();

    }

    Refresh(refresher) {
        console.log('Begin async operation');
        this.items = [];
        this.users = [];
        this.getFollowing();

        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }

    getId(i) {
        console.log("GET ID");
        console.log(i);
    }

    viewMyProfile()
    {
        this.navCtrl.push(MyProfilePage);
    }


    viewProfile(userId)
    {
        console.log("THE PASSED IN ID :" + userId);
       // this.navCtrl.push(ViewProfilePage);

        this.navCtrl.push(ViewProfilePage, {
            userId: userId
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

    search($event) {

        

        this.users = [];

        let results = this.users;

        let q = $event.target.value
        console.log("Q IS: " + q);

        let userRef = firebase.database().ref('userProfile/')
        .once("value")
            .then(function (snapshot){
                snapshot.forEach(function (childSnapshot) {
                    console.log("CHILDSNAP : " + childSnapshot.val().firstName);

                    let firstName = childSnapshot.val().firstName;
                    let lastName = childSnapshot.val().lastName;
                    let photoURL = childSnapshot.val().profilePicture;
                    let userId = childSnapshot.key;
                    

                    console.log("LENGTH: " + q.length);


                    if (firstName.startsWith(q))
                    {
                        results.push({ "firstName": firstName, "lastName": lastName, "userId": userId, "photoURL": photoURL });
                    }

                    /*if (firstName === q)
                    {
                        results.push({ "firstName": firstName, "lastName": lastName });
                    }*/

                    


                })

            })

       

        
        

            
        

    }

    getPostsFrom() {
        this.authData.getPosts();
    }

    getFollowing() {
        let user = firebase.auth().currentUser;
        let userId = user.uid;

        let following = [];
        let followingPostKey = [];

        let bbb = this.items;

        let postList = document.getElementById("posts");

        let query = firebase.database().ref('userProfile/' + userId + "/following/");
        query.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {

                    following.push(childSnapshot.val());
                    console.log(following);

                    firebase.database().ref('userProfile/' + childSnapshot.val()).once("value").then(function (snapshot) {

                        console.log("name " + (snapshot.val() && snapshot.val().firstName));
                    })

                });


                //next step
                for (let i = 0; i <= following.length; i++) {
                    let query2 = firebase.database().ref("/Posts/" + following[i] + "/").orderByKey();
                    query2.once("value")
                        .then(function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {

                                //This is now returning every key belonging to the user ID

                                console.log("getting the keys for this user:" + following[i]);

                                console.log("key: " + childSnapshot.key);
                                console.log("value: " + childSnapshot.val());
                                followingPostKey.push(childSnapshot.key);

                                //console.log("child data: " + childSnapshot.val());
                                //let result = childSnapshot.val();
                                //console.log("child snapshot:" + childSnapshot.val());
                                console.log("follwing keys" + followingPostKey);




             





                                //next step

                                firebase.database().ref('/Posts/' + following[i] + '/' + childSnapshot.key + '/').once('value').then(function (snapshot) {
                                    let text = (snapshot.val() && snapshot.val().Text);
                                    let score = (snapshot.val() && snapshot.val().Score);
                                    let userId = (snapshot.val() && snapshot.val().UserId);
                                    let postId = childSnapshot.key;
                                    let timeStamp = (snapshot.val() && snapshot.val().Date) || 'There is no date';
                                    let postPhotoURL = snapshot.val().photoURL;

                                    let wholeDate = new Date(timeStamp);

                                    let month = wholeDate.getUTCMonth() + 1; //months from 1-12
                                    let day = wholeDate.getUTCDate();
                                    let year = wholeDate.getUTCFullYear();

                                    let date = day + "/" + month + "/" + year;


                                    console.log("USER IDD: " + userId);
                                    console.log("FETCHED POST ID: " + postId);

                                    firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
                                        let firstName = (snapshot.val() && snapshot.val().firstName) || 'There is no name';
                                        let lastName = (snapshot.val() && snapshot.val().lastName) || 'There is no name';
                                        let photoURL = snapshot.val().profilePicture;
                                        

                                        console.log("NAME TEST: " + name);
                                        bbb.push({ "firstName": firstName, "lastName": lastName, "photoURL": photoURL, "text": text, "score": score, "userId": userId, "postId": postId, "date": date, "postPhotoURL": postPhotoURL });
                                        

                                    })

                                    

                                    //hard coded for now
                                    let picture = "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a";

                                    

                                    
                                });

                                



                            });
                        });
                }
            });





    }



    getPosts() {

        


        let bbb = this.items;


        let user = firebase.auth().currentUser;
        let userId = user.uid;

        let Posts = firebase.database().ref('Posts/' + userId);

        console.log(Posts);

        let email;
        let firstName;
        let lastName;

        let userPostKeys = [];


        let userQuery = firebase.database().ref('/userProfile/' + userId).once('value').then(function (snapshot) {
            email = (snapshot.val() && snapshot.val().email) || 'email';
            firstName = (snapshot.val() && snapshot.val().firstName) || 'first name';
            lastName = (snapshot.val() && snapshot.val().lastName) || 'last name';


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
                        let text = (snapshot.val() && snapshot.val().Text) || 'There is no post text';
                        let score = (snapshot.val() && snapshot.val().Score) || 'There is no post score';

                        //hard coded for now
                        let picture = "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a";

                        console.log("Printing post " + i + " " + text);
                        //console.log(score);

                        let name = firstName + " " + lastName;
                        
                        bbb.push({ "name": name, "text": text, "score": score });
                    });                 
                }
            });

    }

    async postPhoto() {

        let userId = firebase.auth().currentUser.uid;
        const time = firebase.database.ServerValue.TIMESTAMP;

     try {
            const options: CameraOptions = {
                quality: 100,
                targetWidth: 600,
                targetHeight: 600,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                correctOrientation: true
            }

            const result = await this.camera.getPicture(options);


            let post = firebase.database().ref('/Posts').child(userId).push({
                Text: "",
                Score: 1,
                Date: firebase.database.ServerValue.TIMESTAMP,
                UserId: userId
            });

            const newPostKey = post.key;
            console.log(newPostKey);


            const image = 'data:image/jpeg;base64,' + result;
           

            

            const pictures = firebase.storage().ref('/' + userId + '/' + 'picture' + newPostKey);
           // pictures.putString(image, `data_url`);



            pictures.putString(image, `data_url`).then(function (snapshot) {
                console.log('Uploaded a data_url string!');
                var url = snapshot.downloadURL;
                //add it to firestore
                firebase.database().ref('Posts/' + userId + '/' + newPostKey).child('photoURL').set(url);
            });

            
           

        }
        catch (e) {
            console.log(e);
     }


     }

    showPrompt() {
        let prompt = this.alertCtrl.create({
            title: 'New Post',
            message: "Enter your next post here",
            inputs: [
                {
                    name: 'text',
                    placeholder: 'Post'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Create',
                    handler: data => {
                        console.log('Saved clicked');
                        console.log(data.text);
                        let newPostText = data.text;
                        this.submitPost(newPostText);


                    }
                }
            ]
        });
        prompt.present();

    }

    submitPost(post: string) {
        console.log("getting the user");

        //console.log(firebase.auth().currentUser); FOR WHOLE USER OBJECT

        let user = firebase.auth().currentUser;
        let userId = user.uid;

        let date = new Date();
        console.log("DATE IS: " + date);

        /*firebase.database().ref('/Posts').child(userId).set({
            Text: "THis is a texttt",
            Score: 0
        });*/

        firebase.database().ref('/Posts').child(userId).push({
            Text: post,
            Score: 1,
            Date: firebase.database.ServerValue.TIMESTAMP,
            UserId: userId
        });

        var newPostKey = firebase.database().ref().child('/Posts').push().key;
        console.log(newPostKey);

    }


}
