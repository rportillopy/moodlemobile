var templates = [
    "root/externallib/text!root/plugins/myprofile/myprofile.html",
];

define(templates, function (myprofileTpl) {
    var plugin = {
        settings: {
            name: "myprofile",
            type: "setting",
            menuURL: "myprofile",
            lang: {
                component: "core",
                strings: {
                 "clicmyprofile": "string in the plugin",
                 "howtoeditprofile": "string in the plugin",
                },
            },
            toogler: true
        },
        routes: [
                  ["settings/myprofile", "myprofile_show", "showMyProfile"],
                  ["clicmainphoto", "myprofile_alert", "clicMainPhoto"],
                  ["settings/myprofile/take", "myprofile_take", "takeMedia"],
                  ["settings/myprofile/browse", "myprofile_browse", "browseAlbums"],
                ],
/*
        lastUploadStamp: "",
        urlPicture: "",
*/
        /**
         * Determines is the plugin is visible.
         * It may check Moodle remote site version, device OS, device type, etc...
         * This function is called when a alink to a plugin functinality is going to be rendered.
         *
         * @return {bool} True if the plugin is visible for the site and device
         */
        isPluginVisible: function() {
            var visible =   MM.util.wsAvailable('core_user_get_users_by_field');
            return visible;
        },


        clicMainPhoto: function() {
            MM.popMessage(MM.lang.s("howtoeditprofile"),{autoclose: 0});
            //MM.displaySettings();
        }, 
        showMyProfile: function() {
            MM.panels.showLoading('right');
/*
            var data = {
                "field": "username",
                "values[0]": MM.config.current_site.username 
            }
*/
            var data = {
                "userlist[0][userid]": MM.config.current_site.userid,
                "userlist[0][courseid]": 1 
            }
 
            //MM.moodleWSCall('core_user_get_users_by_field', data, function(users){
            MM.moodleWSCall('moodle_user_get_course_participants_by_id', data, function(users){
               var myuser = users.shift();
               var pageTitle = MM.lang.s("myprofile");  
               var tpl = {"user": myuser};
               var html = MM.tpl.render(MM.plugins.myprofile.templates.myprofile.html, tpl);
               MM.panels.show('right', html, {title: pageTitle});
               //MM.log(JSON.stringify(user),"profile");
/*
               MM.plugins.myprofile.urlPicture = MM.util.getMoodleFilePath(myuser.profileimageurl);
               $("img[src='"+MM.plugins.myprofile.urlPicture+"']").attr("src",MM.plugins.myprofile.urlPicture+MM.plugins.myprofile.lastUploadStamp);
*/

               //MM.popMessage(MM.plugins.myprofile.urlPicture);
               //MM.log(MM.plugins.myprofile.urlPicture, 'myprofile userpicture calculated');
               MM.log("We have an OBJECT with the user profile","profile");
               console.log(myuser);
            });

            //$(".img").hide();
            //MM.popMessage(MM.lang.s("clicmyprofile")+ MM.config.current_site.username);
            //$(".img").click(function() {alert("hola")});

        },

        takeMedia: function() {
            MM.log('Trying to get a image from camera', 'myprofile');
            MM.Router.navigate("");

            navigator.camera.getPicture(MM.plugins.myprofile.photoSuccess, MM.plugins.myprofile.photoFails, {
                quality: 50,
                direction: 1,
                correctOrientation: true,
                destinationType: navigator.camera.DestinationType.FILE_URI
            });
        },

        photoSuccess: function(imageURI) {
            var options = new FileUploadOptions();
            options.fileKey="nombre_archivo_cliente";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            //If problems errorCode = 3 you can try chukedMode false
            options.chunkedMode = false;
            options.headers = {
              Connection: "close"
            };

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(imageURI,
                      encodeURI('http://192.168.1.33/moodle26/local/mypicturews/prueba.php'),
                     // encodeURI(MM.config.current_site.siteurl + '/local/myprofilews/prueba.php'),
                      MM.plugins.myprofile.success_upload,
                      MM.plugins.myprofile.fail_upload,
                      options,
                      true);
            //window.location.reload(true);
            //window.location.assign(MM.util.getMoodleFilePath(user.profileimageurl));
            //MM.popMessage(MM.site.get('userpictureurl')+"hola");
        },

        success_upload: function() {
/*
            if (MM.plugins.myprofile.lastUploadStamp == "") {
                MM.plugins.myprofile.lastUploadStamp='&time='+new Date().getTime();
                $("img[src='"+MM.plugins.myprofile.urlPicture+"']").attr("src",MM.plugins.myprofile.urlPicture+MM.plugins.myprofile.lastUploadStamp);
            } else {
                newStamp = '&time='+new Date().getTime();
                $("img[src='"+MM.plugins.myprofile.urlPicture+MM.plugins.myprofile.lastUploadStamp+"']").attr("src",MM.plugins.myprofile.urlPicture+newStamp);
                MM.plugins.myprofile.lastUploadStamp=newStamp;
            }
*/
//MM.refresh();
MM.loadSite(MM.config.current_site.id);
            MM.popMessage(MM.lang.s("exittorefresh"));
        },


        fail_upload: function (error) {
            MM.popErrorMessage(MM.lang.s("erroruploading"))
            //alert("An error has occurred: Code = " + error.code);
            //alert("upload error source " + error.source);
            //alert("upload error target " + error.target);
        },

        photoSuccess_bak: function(uri) {

            MM.log('Uploading an image to Moodle', 'Upload');
            var d = new Date();

            var options = {};
            options.fileKey="file";

            // Check if is a URI or a file system path.
            if (uri.indexOf('data:') > -1) {
                options.fileName = "image_" + d.getTime() + ".jpg";
            } else {
                options.fileName = uri.lastIndexOf("/") + 1;
            }

            options.mimeType="image/jpeg";

            MM.plugins.myprofile.PictureProfileUpload(uri, options,
                                function(){ MM.popMessage(MM.lang.s("imagestored")); },
                                function(){ MM.popErrorMessage(MM.lang.s("erroruploading")) }
            );

        },

        photoFails: function(message) {
            MM.log('Error trying getting a photo', 'Upload');
            if (message.toLowerCase().indexOf("error") > -1 || message.toLowerCase().indexOf("unable") > -1) {
                MM.popErrorMessage(message);
            }
        },

        templates: {
            "myprofile": {
                html: myprofileTpl
            },
        },

    /**
     * Uploads a file to Moodle using Cordova File API
     *
     * @param {Object} data Arguments to pass to the method.
     * @param {Object} fileOptions File settings.
     * @param {Object} successCallBack Function to be called on success.
     * @param {Object} errorCallBack Function to be called on error.
     * @param {Object} preSets Extra settings.
     */
    PictureProfileUpload: function(data, fileOptions, successCallBack, errorCallBack, presets) {
        MM.log('Trying to upload file ('+ data.length + ' chars)', 'Sync');
        if (!MM.deviceConnected()) MM.handleDisconnectedFileUpload(data, fileOptions);

        MM.log('Initializing uploader');
        var options = MM._wsGetFileUploadOptions();
        options.fileKey = fileOptions.fileKey;
        options.fileName = fileOptions.fileName;
        options.mimeType = fileOptions.mimeType;
        options.params = {
            token:MM.config.current_token
        };

        MM.log('Uploading');
        MM.showModalLoading(MM.lang.s("uploading"), MM.lang.s('uploadingtoprivatefiles'));
        var ft = MM._wsGetFileTransfer();
        ft.upload(
            data,
            MM.config.current_site.siteurl + '/local/myprofilews/uploadpicture.php',
            function() {
                MM.closeModalLoading();
                successCallBack();
            },
            function() {
                MM.closeModalLoading();
                errorCallBack();
            },
            options
        );
    },

        
    }

    MM.registerPlugin(plugin);
    //$(".img").click(function(){MM.plugins.myprofile.clicMainPhoto();}); 
});
