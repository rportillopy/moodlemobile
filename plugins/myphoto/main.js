define(function() {
    var plugin = {
        settings: {
            name:"myphoto",
            type:"general",
            menuURL:"#myphoto",
            lang:{
                component:"local_myphoto",
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
