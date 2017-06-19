(function ()
{
    'use strict';

    angular.module('contextmenu')
     .controller('modalController', function($scope, $modalInstance, itemnumber, MongoService)
    {
        var vm2 = this;
        vm2.showSynonyms=true;
        vm2.showRhyme=false;
        vm2.showDescription=false;
        vm2.itemnumber = itemnumber;
        var el = document.getElementById('myWord' + vm2.itemnumber);
        var items  = MongoService.getItems();
        vm2.showCmContent = showCmContent;
        vm2.editWord = editWord;
        vm2.theword = items[itemnumber];
        vm2.itemnumber = itemnumber;
        vm2.contentItems = ['contextMenuMenuSyn', 'contextMenuMenuDes', 'contextMenuMenuRhy'];

        //a click on the pencil icon in the modal in contextMenu.html;
        function editWord() 
        {
          console.log("editword");
           el.setAttribute('contenteditable', true);
           el.addEventListener('blur', function(event)
           {
            console.log("blurred...");
            el.setAttribute('contenteditable' , false);
           });
           placeCaretAtEnd(el);
        }
//does what it says, no arrow keys on a mobile keyboard only a backspace button so therefore a cursor at the end and not at the beginning.
        function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") 
    {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") 
    {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

        function showCmContent(item, index)
        {
            console.log("iterating");
           if(item == 'restore')
           {
             vm2.theword.currentword = vm2.theword.originalword;
             return;   
           }
           vm2.contentItems.forEach( function(element, index) 
           {
            var el = document.getElementById(element);
             if(element == item)
             {
              console.log("added class");
              el.classList.add( "menuselected");
             }
             else
             {
              console.log("removed class");
              el.classList.remove('menuselected');
             }
             console.log("classlist",el.classList,el);
           });
        }

        vm2.close = function ()
        {
            console.log("closing modal...");
            $modalInstance.close('cancel');
        };

    })




    .controller('IndexController', function ($scope,$modal, $interval, $timeout, MongoService, UserFactory,AuthTokenFactory, KeystrokeService)
    {
       
        console.log("indexcontroller...");
        var vm = this;
       vm.showContextMenu = showContextMenu;
       vm.showSynonym = showSynonym;
       vm.showRhymeWord = showRhymeWord;
       vm.showDescription = showDescription;
       vm.showOriginalText = false;
       vm.openModal = openModal;
       vm.user = null;
       
       

       //invoked from the editorText directive
       function openModal(index)
      {
      console.log("open modal...");
          var modalInstance = $modal.open({
          template: '<con-menu></con-menu>',
          controller:'modalController as vm2',
          windowClass: 'mymodal',
          animation:false,
          resolve:{itemnumber: function() {return index;}}
          });
      }


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

        vm.wordModel= MongoService.getItems();
        

        function showContextMenu(index)
        {
            var elem = document.getElementById('contextMenu'+index);
        }

        
       
        

    });   
})();


