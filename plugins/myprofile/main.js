var templates = [
    "root/externallib/text!root/plugins/myprofile/myprofile.html",
];

define(templates, function (myprofileTpl) {
    var plugin = {
        settings: {
            name: "myprofile",
            type: "setting",
            menuURL: "#settings/myprofile",
            lang: {
                component: "core",
                strings: {
                 "clicmyprofile": "string in the plugin",
                 "howtoeditprofile": "string in the plugin",
                },
            },
        },
        routes: [
                  ["settings/myprofile", "myprofile", "showMyProfile"],
                  ["clicmainphoto", "myprofile", "clicMainPhoto"],
                ],

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
            var data = {
                "field": "username",
                "values[0]": MM.config.current_site.username 
            }
            MM.moodleWSCall('core_user_get_users_by_field', data, function(users){
               var myuser = users.shift();
               var pageTitle = MM.lang.s("myprofile");  
               var tpl = {"user": myuser};
               var html = MM.tpl.render(MM.plugins.myprofile.templates.myprofile.html, tpl);
               MM.panels.show('right', html, {title: pageTitle});
               //MM.log(JSON.stringify(user),"profile");
               MM.log("We have an OBJECT with the user profile","profile");
               console.log(myuser);
            });

            //$(".img").hide();
            //MM.popMessage(MM.lang.s("clicmyprofile")+ MM.config.current_site.username);
            //$(".img").click(function() {alert("hola")});
        },

        templates: {
            "myprofile": {
                html: myprofileTpl
            },
        }
        
    }

    MM.registerPlugin(plugin);
    //$(".img").click(function(){MM.plugins.myprofile.clicMainPhoto();}); 
});
