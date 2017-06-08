(function ()
{
    'use strict';

    angular.module('contextmenu')
    .controller('IndexController', function ($scope,$modal, $interval, $timeout, MongoService, UserFactory,AuthTokenFactory, KeystrokeService)
    {
       
        console.log("indexcontroller...");
        var vm = this;
       vm.showContextMenu = showContextMenu;
       vm.showCmContent = showCmContent;
       vm.showSynonym = showSynonym;
       vm.showRhymeWord = showRhymeWord;
       vm.showDescription = showDescription;
       vm.showOriginalText = false;
       vm.user = null;


       function showRhymeWord(index, parentindex)
       {
        console.log("indexes",index, parentindex, vm.wordModel[parentindex].synonyms[index]);
       }
       function showDescription(index, parentindex)
       {
        console.log("indexes",index, parentindex, vm.wordModel[parentindex].description[index]);
       }

       function showSynonym(index, parentindex)
       {
        console.log("indexes",index, parentindex, vm.wordModel[parentindex].rhymewords[index]);
       }
       vm.contentItems = {synonyms:true, rhymewords:false, description:false};

        vm.wordModel= MongoService.getItems();
        

        function showContextMenu(index)
        {
            var elem = document.getElementById('contextMenu'+index);
        }

        

        function showCmContent(item, index)
        {
           if(item == 'restore')
           {
             vm.wordModel[index].currentword = vm.wordModel[index].originalword;
             return;   
           }

            for (var property in vm.contentItems) 
            {
                if (vm.contentItems.hasOwnProperty(property)) 
                {
                     vm.contentItems[property] = false;
                }
            }
            vm.contentItems[item] = true;
            console.log('clicked a menu item', vm.contentItems);
        }
        
    });   

})();


