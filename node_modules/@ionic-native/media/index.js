var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { CordovaInstance, Plugin, checkAvailability, IonicNativePlugin, InstanceProperty } from '@ionic-native/core';
import { Observable } from 'rxjs/Observable';
/**
 * @hidden
 */
var MediaObject = (function () {
    function MediaObject(_objectInstance) {
        var _this = this;
        this._objectInstance = _objectInstance;
        this.onSuccess = new Observable(function (observer) {
            _this.successCallback = observer.next.bind(observer);
            return function () { return _this.successCallback = function () { }; };
        });
        this.onError = new Observable(function (observer) {
            _this.errorCallback = observer.next.bind(observer);
            return function () { return _this.errorCallback = function () { }; };
        });
        this.onStatusUpdate = new Observable(function (observer) {
            _this.statusCallback = observer.next.bind(observer);
            return function () { return _this.statusCallback = function () { }; };
        });
    }
    /**
     * Get the current amplitude of the current recording.
     * @returns {Promise<any>} Returns a promise with the amplitude of the current recording
     */
    MediaObject.prototype.getCurrentAmplitude = function () { return; };
    /**
     * Get the current position within an audio file. Also updates the Media object's position parameter.
     * @returns {Promise<any>} Returns a promise with the position of the current recording
     */
    MediaObject.prototype.getCurrentPosition = function () { return; };
    /**
     * Get the duration of an audio file in seconds. If the duration is unknown, it returns a value of -1.
     * @returns {number} Returns a promise with the duration of the current recording
     */
    MediaObject.prototype.getDuration = function () { return; };
    /**
     * Starts or resumes playing an audio file.
     */
    MediaObject.prototype.play = function (iosOptions) { };
    /**
     * Pauses playing an audio file.
     */
    MediaObject.prototype.pause = function () { };
    /**
     * Releases the underlying operating system's audio resources. This is particularly important for Android, since there are a finite amount of OpenCore instances for media playback. Applications should call the release function for any Media resource that is no longer needed.
     */
    MediaObject.prototype.release = function () { };
    /**
     * Sets the current position within an audio file.
     * @param {number} milliseconds The time position you want to set for the current audio file
     */
    MediaObject.prototype.seekTo = function (milliseconds) { };
    /**
     * Set the volume for an audio file.
     * @param volume {number} The volume to set for playback. The value must be within the range of 0.0 to 1.0.
     */
    MediaObject.prototype.setVolume = function (volume) { };
    MediaObject.prototype.setRate = function (speedRate) { };
    /**
     * Starts recording an audio file.
     */
    MediaObject.prototype.startRecord = function () { };
    /**
     * Stops recording
     */
    MediaObject.prototype.stopRecord = function () { };
    /**
     * Pauses recording
     */
    MediaObject.prototype.pauseRecord = function () { };
    /**
     * Resumes recording
     */
    MediaObject.prototype.resumeRecord = function () { };
    /**
     * Stops playing an audio file.
     */
    MediaObject.prototype.stop = function () { };
    __decorate([
        InstanceProperty,
        __metadata("design:type", Function)
    ], MediaObject.prototype, "successCallback", void 0);
    __decorate([
        InstanceProperty,
        __metadata("design:type", Function)
    ], MediaObject.prototype, "errorCallback", void 0);
    __decorate([
        InstanceProperty,
        __metadata("design:type", Function)
    ], MediaObject.prototype, "statusCallback", void 0);
    __decorate([
        CordovaInstance(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], MediaObject.prototype, "getCurrentAmplitude", null);
    __decorate([
        CordovaInstance(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], MediaObject.prototype, "getCurrentPosition", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Number)
    ], MediaObject.prototype, "getDuration", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "play", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "pause", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "release", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "seekTo", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "setVolume", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "setRate", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "startRecord", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "stopRecord", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "pauseRecord", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "resumeRecord", null);
    __decorate([
        CordovaInstance({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MediaObject.prototype, "stop", null);
    return MediaObject;
}());
export { MediaObject };
export var MEDIA_STATUS;
(function (MEDIA_STATUS) {
    MEDIA_STATUS[MEDIA_STATUS["NONE"] = 0] = "NONE";
    MEDIA_STATUS[MEDIA_STATUS["STARTING"] = 1] = "STARTING";
    MEDIA_STATUS[MEDIA_STATUS["RUNNING"] = 2] = "RUNNING";
    MEDIA_STATUS[MEDIA_STATUS["PAUSED"] = 3] = "PAUSED";
    MEDIA_STATUS[MEDIA_STATUS["STOPPED"] = 4] = "STOPPED";
})(MEDIA_STATUS || (MEDIA_STATUS = {}));
export var MEDIA_ERROR;
(function (MEDIA_ERROR) {
    MEDIA_ERROR[MEDIA_ERROR["ABORTED"] = 1] = "ABORTED";
    MEDIA_ERROR[MEDIA_ERROR["NETWORK"] = 2] = "NETWORK";
    MEDIA_ERROR[MEDIA_ERROR["DECODE"] = 3] = "DECODE";
    MEDIA_ERROR[MEDIA_ERROR["SUPPORTED"] = 4] = "SUPPORTED";
})(MEDIA_ERROR || (MEDIA_ERROR = {}));
/**
 * @name Media
 * @description
 * This plugin provides the ability to record and play back audio files on a device.
 *
 * @usage
 * ```typescript
 * import { Media, MediaObject } from '@ionic-native/media';
 *
 *
 * constructor(private media: Media) { }
 *
 *
 * ...
 *
 *
 * // Create a Media instance.  Expects path to file or url as argument
 * // We can optionally pass a second argument to track the status of the media
 *
 * const file: MediaObject = this.media.create('file.mp3');
 *
 * // to listen to plugin events:
 *
 * file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
 *
 * file.onSuccess.subscribe(() => console.log('Action is successful'));
 *
 * file.onError.subscribe(error => console.log('Error!', error));
 *
 * // play the file
 * file.play();
 *
 * // pause the file
 * file.pause();
 *
 * // get current playback position
 * file.getCurrentPosition().then((position) => {
 *   console.log(position);
 * });
 *
 * // get file duration
 * let duration = file.getDuration();
 * console.log(duration);
 *
 * // skip to 10 seconds (expects int value in ms)
 * file.seekTo(10000);
 *
 * // stop playing the file
 * file.stop();
 *
 * // release the native audio resource
 * // Platform Quirks:
 * // iOS simply create a new instance and the old one will be overwritten
 * // Android you must call release() to destroy instances of media when you are done
 * file.release();
 *
 *
 *
 * // Recording to a file
 * const file: MediaObject = this.media.create('path/to/file.mp3');
 *
 * file.startRecord();
 *
 * file.stopRecord();
 *
 *
 * ```
 *
 * Some hints if you are using iOS and recording doesn't work:
 * 1.) Try to use a absolute file path but remove beginning "file://".
 * Then it looks like: `/var/mobile/Containers/Data/Application/AF438B8B-7724-4FBB-8E69-083463224FC4/tmp/my_file.m4a`
 * Example: `this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'my_file.m4a')`
 * 2.) If that's not working, too, create the file before using.
 * Example:
 * ```typescript
 * import { Media, MediaObject } from '@ionic-native/media';
 * import { File } from '@ionic-native/file';
 *
 * ...
 *
 * constructor(private media: Media, private file: File) { }
 *
 * ...
 *
 * this.file.createFile(this.file.tempDirectory, 'my_file.m4a', true).then(() => {
 *   let file = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'my_file.m4a');
 *   file.startRecord();
 *   window.setTimeout(() => file.stopRecord(), 10000);
 * });
 * ```
 *
 * You can find the reasons here: https://github.com/ionic-team/ionic-native/issues/1452#issuecomment-299605906
 * @classes
 * MediaObject
 * @interfaces
 * MediaError
 */
var Media = (function (_super) {
    __extends(Media, _super);
    function Media() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Constants
        /**
         * @hidden
         */
        _this.MEDIA_NONE = 0;
        /**
         * @hidden
         */
        _this.MEDIA_STARTING = 1;
        /**
         * @hidden
         */
        _this.MEDIA_RUNNING = 2;
        /**
         * @hidden
         */
        _this.MEDIA_PAUSED = 3;
        /**
         * @hidden
         */
        _this.MEDIA_STOPPED = 4;
        // error codes
        /**
         * @hidden
         */
        _this.MEDIA_ERR_ABORTED = 1;
        /**
         * @hidden
         */
        _this.MEDIA_ERR_NETWORK = 2;
        /**
         * @hidden
         */
        _this.MEDIA_ERR_DECODE = 3;
        /**
         * @hidden
         */
        _this.MEDIA_ERR_NONE_SUPPORTED = 4;
        return _this;
    }
    Media_1 = Media;
    /**
     * Open a media file
     * @param src {string} A URI containing the audio content.
     * @return {MediaObject}
     */
    Media.prototype.create = function (src) {
        var instance;
        if (checkAvailability(Media_1.getPluginRef(), null, Media_1.getPluginName()) === true) {
            // Creates a new media object
            instance = new (Media_1.getPlugin())(src);
        }
        return new MediaObject(instance);
    };
    Media.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Media.ctorParameters = function () { return []; };
    Media = Media_1 = __decorate([
        Plugin({
            pluginName: 'Media',
            repo: 'https://github.com/apache/cordova-plugin-media',
            plugin: 'cordova-plugin-media',
            pluginRef: 'Media',
            platforms: ['Android', 'Browser', 'iOS', 'Windows']
        })
    ], Media);
    return Media;
    var Media_1;
}(IonicNativePlugin));
export { Media };
//# sourceMappingURL=index.js.map