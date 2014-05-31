define(function(langStrings) {
    var plugin = {
        settings: {
            name:"local_myphoto",
            type:"general",
            menuURL:"#myphoto",
            lang:{
                component:"core",
                strings:{"clicmyphoto":"string in the plugin",
                },
            },
        },
        routes: [
                  ["myphoto","myphoto","myClic"],
                ],

        myClic:function(){MM.popMessage(MM.lang.s("clicmyphoto"));}
    }

MM.registerPlugin(plugin);});
