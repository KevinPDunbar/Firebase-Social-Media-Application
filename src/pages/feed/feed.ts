import { Component } from '@angular/core';
import { AuthData } from '../../providers/auth-data';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

import { ViewProfilePage } from '../view-profile/view-profile';
import { MyProfilePage } from '../my-profile/my-profile';
import { ViewPostPage } from '../view-post/view-post';
import { SearchPage } from '../search/search';
import { NotificationsPage } from '../notifications/notifications';
import { Login } from '../login/login'

import { Media, MediaObject } from '@ionic-native/media';   
import { File } from '@ionic-native/file';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

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

    public unreadNotifications = [];

    public items = [];

    public users = [];

    nativepath: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthData, public alertCtrl: AlertController, private camera: Camera, private modal: ModalController, private mediaCapture: MediaCapture, private media: Media, private file: File, private streamingMedia: StreamingMedia, private videoEditor: VideoEditor, private fileChooser: FileChooser, public filePath: FilePath) {

        firebase.auth().onAuthStateChanged((user) => {

            if (!user) {
                console.log("not login");
                this.navCtrl.setRoot(Login)


            } 
        });
    }


    ionViewDidLoad() {

        console.log('ionViewDidLoad FeedPage');
        this.getFollowing();
        this.getUnreadCount();

    }

    Refresh(refresher) {
        console.log('Begin async operation');
        this.items = [];
        this.users = [];
        this.unreadNotifications = [];
        this.getFollowing();
        this.getUnreadCount();

        console.log("REFRESHER: " + refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
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

    startVideo(url) {
        let options: StreamingVideoOptions = {
            successCallback: () => { console.log('Finished Video') },
            errorCallback: (e) => { console.log('Error: ', e) },
            orientation: 'portrait'
        };

        
        this.streamingMedia.playVideo(url, options);
    }

    getId(i) {
        console.log("GET ID");
        console.log(i);
    }

    goToNotificationsPage() {
        this.navCtrl.push(NotificationsPage);
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

    viewMyProfile() {
        this.navCtrl.push(MyProfilePage);
    }


    viewProfile(userId) {
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
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    console.log("CHILDSNAP : " + childSnapshot.val().firstName);

                    let firstName = childSnapshot.val().firstName;
                    let lastName = childSnapshot.val().lastName;
                    let photoURL = childSnapshot.val().profilePicture;
                    let userId = childSnapshot.key;


                    console.log("LENGTH: " + q.length);


                    if (firstName.startsWith(q)) {
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
        let myId = firebase.auth().currentUser.uid;

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
                    let query2 = firebase.database().ref("/Posts/" + following[i] + "/").orderByChild("Date");
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
                                    let postVideoURL = snapshot.val().videoURL || '';
                                    let postVideoThumbURL = snapshot.val().videoThumbURL || '';
                                    let likes = snapshot.val().likes || [];
                                    let haveIliked = false;

                                    for (let i = 0; i < likes.length; i++) {
                                        if (likes[i] === myId) {
                                            haveIliked = true;
                                        }
                                    }

                                    let comments = (snapshot.val() && snapshot.val().comments) || [];
                                    let commentLength;
                                    if (comments.length > 0) {
                                        commentLength = comments.length;
                                    }
                                    else {
                                        commentLength = 0;
                                    }
                                    console.log("Comment Length: " + commentLength);

                                    let wholeDate = new Date(timeStamp);

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
                                        bbb.push({ "firstName": firstName, "lastName": lastName, "photoURL": photoURL, "videoURL": postVideoURL, "thumbURL": postVideoThumbURL, "text": text, "score": score, "userId": userId, "postId": postId, "date": diff, "postPhotoURL": postPhotoURL, "timestamp": timeStamp, "commentLength": commentLength, "haveILiked": haveIliked });

                                        for (let i = 0; i < bbb.length; i++) {
                                            bbb.sort(function (a, b) {
                                                return -(a.timestamp - b.timestamp);
                                            });
                                        }

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



   /* uploadfn() {
        

        this.fileChooser.open().then((url) => {
            (<any>window).file.readAsArrayBuffer(url).then((file) => {

                var imgBlob = new Blob([file], { type: 'image/jpeg' });
                //do what you want to do with the file

                let userId = firebase.auth().currentUser.uid;
                const time = firebase.database.ServerValue.TIMESTAMP;


                let post = firebase.database().ref('/Posts').child(userId).push({
                    Text: "",
                    Score: 1,
                    Date: firebase.database.ServerValue.TIMESTAMP,
                    UserId: userId
                });

                const newPostKey = post.key;


                const pictures = firebase.storage().ref('/' + userId + '/' + 'picture' + newPostKey);
                // pictures.putString(image, `data_url`);



                pictures.put(imgBlob).then(function (snapshot) {
                    console.log('Uploaded a data_url string!');
                    var url = snapshot.downloadURL;
                    //add it to firestore
                    firebase.database().ref('Posts/' + userId + '/' + newPostKey).child('photoURL').set(url);
                });

            })

            })
            
        
    } */

    

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

    postVideo() {

        let userId = firebase.auth().currentUser.uid;
        const time = firebase.database.ServerValue.TIMESTAMP;

        this.mediaCapture.captureVideo({limit: 1, duration: 30, quality: 1 }).then((data: MediaFile[]) => {
            let index = data[0].fullPath.lastIndexOf('/'), finalPath = data[0].fullPath.substr(0, index);
            this.file.readAsArrayBuffer(finalPath, data[0].name).then((file) => {

                let post = firebase.database().ref('/Posts').child(userId).push({
                    Text: "",
                    Score: 1,
                    Date: firebase.database.ServerValue.TIMESTAMP,
                    UserId: userId
                });

                const newPostKey = post.key;
                console.log(newPostKey);

                const videoRef = firebase.storage().ref('/' + userId + '/' + 'video' + newPostKey);

                let blob = new Blob([file], { type: data[0].type });

                videoRef.put(blob).then(function (snapshot) {
                    console.log('Uploaded a video');
                    var url = snapshot.downloadURL;
                    //add it to firestore
                    firebase.database().ref('Posts/' + userId + '/' + newPostKey).child('videoURL').set(url);
                });
                //let task = videoRef.child(data[0].name).put(blob);

                

                //
                let numstr = 1;
                let filedir = this.file.dataDirectory;

                var path = data[0].fullPath.replace('/private', 'file://');
                var ind = (path.lastIndexOf('/') + 1);
                var orgFilename = path.substring(ind);
                var orgFilePath = path.substring(0, ind);

                console.log("videopath", path);
                //SAVE FILE

                var option: CreateThumbnailOptions = { fileUri: path, width: 500, height: 500, atTime: 1, outputFileName: 'sample' + numstr, quality: 100 };
                    this.videoEditor.createThumbnail(option).then(result => {
                        //result-path of thumbnail
                        //localStorage.setItem('videoNum', numstr.toString());
                        console.log("result: " + result);

                        let path2 = 'file://' + result;

                        const videoRef2 = firebase.storage().ref('/' + userId + '/' + 'thumb' + newPostKey);

                        let index = path2.lastIndexOf('/'), finalPath = path2.substr(0, index);
                        this.file.readAsArrayBuffer(finalPath, 'sample1.jpg').then((file) => {

                            let thumbBlob = new Blob([file], { type: 'image/jpeg' });
                            videoRef2.put(thumbBlob).then(function (snapshot) {
                                console.log('Uploaded a thumbnail');
                                var url = snapshot.downloadURL;
                                console.log("thumb url: " + url);
                                //add it to firestore
                                firebase.database().ref('Posts/' + userId + '/' + newPostKey).child('videoThumbURL').set(url);
                            });

                        }).catch(err => { console.log(err); });
                        
                        //


                        
                       /* videoRef.put(blob2).then(function (snapshot) {
                            console.log('Uploaded a video');
                            var url = snapshot.downloadURL;
                            //add it to firestore
                            firebase.database().ref('Posts/' + userId + '/' + newPostKey).child('videoURL').set(url);
                        }); */
                    }).catch(e => {
                        // alert('fail video editor');
                    });
               

                //


                /*videoRef.put().then(function (snapshot) {
                    console.log('Uploaded a video');
                    var url = snapshot.downloadURL;
                    //add it to firestore
                    firebase.database().ref('Posts/' + userId + '/' + newPostKey).child('videoURL').set(url);
                }); */


                
            }).catch(err => { console.log(err); });
        })

       
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

    goToSearch()
    {
        this.navCtrl.push(SearchPage);
    }

    

    likePost(post, userId, postId) {

        let ownerId = userId;
        let myId = firebase.auth().currentUser.uid;
        let score;
        let likes = [];

        console.log("post: " + post.postId);
        for (let i = 0; i < this.items.length; i++)
            if (this.items[i].postId === postId) {
                console.log("POST FOUND and liked");
                this.items[i].haveILiked = true;
                this.items[i].score++;
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
        for (let i = 0; i < this.items.length; i++)
            if (this.items[i].postId === postId) {
                console.log("POST FOUND and unliked");
                this.items[i].haveILiked = false;
                this.items[i].score--;
                break;
            }

        let Query = firebase.database().ref('/Posts/' + userId + '/' + postId).once('value').then(function (snapshot) {
            likes = (snapshot.val() && snapshot.val().likes) || [];
            score = (snapshot.val() && snapshot.val().Score);
            likes.push(myId);


            for (let i = 0; i < likes.length; i++)
            {
                if (likes[i] != myId)
                {
                    updatedLikes.push(likes[i]);
                }
            }

            score = score - 1;

            firebase.database().ref('/Posts/' + userId + '/' + postId).child('likes').set(updatedLikes);
            firebase.database().ref('/Posts/' + userId + '/' + postId).child('Score').set(score);

        });


    }


}
