(function ()
{
    'use strict';

    angular.module('contextmenu')
//directive to prevent multiple context menus showing
               .directive('contextMenuListener', function (MongoService)
        {
            return {
                restrict: "A",
                link: function (scope, element, attrs)
                {
                    //hide a contextmenu when it loses focus
                    $('body').on('click', function (event)
                    {
                        if(MongoService.getCmShowing() > -1)
                        {
                           // console.log('clicked on:',event.target.id);
                            if(event.target.id.match(/myWord/) !== null)
                            {
                            }
                            else if( event.target.id.match(/contextMenu/) !== null)
                            {
                            }
                            else
                            {
                            var element = document.getElementById('contextMenu' + MongoService.getCmShowing());
                            element.style.visibility = "hidden";
                            MongoService.setCmShowing(-1);
                            }
                            
                        }
                    });
                    $('editor-text').on('dblclick', function(event)
                    {
                        console.log('doubleclicked an editor text...');
                    });
                }
            };
        })

        


        .directive('editorText', function (MongoService)
        {
            return {
                restrict: 'E',
                templateUrl: 'views/wordItem.html',
                link: function (scope, ele, attrs)
                {
                  var CMWIDTH = 250;
                  var CMHEIGHT = 300; 
                        
                        ele.bind('dblclick', function(event)
                       {
                            var element0 = document.getElementById('contextMenu'+MongoService.getCmShowing());
                            element0.style.visibility='hidden';
                            var element1 = document.getElementById('myWord' + scope.$index);
                            element1.setAttribute('contenteditable',true);
                            element1.focus();
                            element1.addEventListener('blur',function(event)
                            {
                                console.log('blurred...');
                                element1.setAttribute('contenteditable',false);
                            });
                       });


                       ele.bind('click',function(event)
                       {
                        //remove contentEditable attribute if nec

                        //if there is already a context menu showing
                        if(MongoService.getCmShowing() !== -1)
                        {
                            var element2 = document.getElementById('contextMenu'+MongoService.getCmShowing());
                            element2.style.visibility='hidden';
                        }

                       var element4 = document.getElementById('myWord' + scope.$index);

                       var currentHeight = element4.offsetHeight;
                       var currentPosLeft = element4.offsetLeft;
                       var itemwidth = CMWIDTH;
                       var midword = currentPosLeft + element4.offsetWidth/2;
                       
                       var posleft;
                       var postop;
                       var scrollfromtop = document.getElementById('myEditorwindow').scrollTop;
                       var pointer = document.getElementById('contextMenuBefore'+scope.$index);
                       var pointer2 = document.getElementById('contextMenuAfter'+scope.$index);

                       console.log("spaceright,spaceleft,spacebelos",hasSpaceOnRightSide(element4),hasSpaceOnLeftSide(element4),hasSpaceBelow(element4));

                       if (hasSpaceOnRightSide(element4) && hasSpaceBelow(element4))
                            {
                                console.log("1a");
                                posleft = currentPosLeft;
                                postop = element4.offsetTop -scrollfromtop + currentHeight -2;
                                pointer.style.left = element4.offsetWidth/2 -5 + 'px';
                                pointer2.style.display = "none";
                            }
                        if (!hasSpaceOnRightSide(element4)&&hasSpaceOnLeftSide(element4) && hasSpaceBelow(element4))
                            {
                                console.log("2a");
                                posleft = currentPosLeft + element4.offsetWidth - CMWIDTH;
                                postop = element4.offsetTop -scrollfromtop + currentHeight -2;
                                pointer.style.left = CMWIDTH - element4.offsetWidth/2 -5 + 'px';
                                pointer2.style.display = "none";
                            }   
                        if (!hasSpaceOnRightSide(element4)&&!hasSpaceOnLeftSide(element4) && hasSpaceBelow(element4))
                            {
                                console.log("3a");
                                posleft = (window.innerWidth - CMWIDTH)/2;
                                postop = element4.offsetTop -scrollfromtop + currentHeight -2;
                                pointer.style.left = midword - (window.innerWidth - CMWIDTH)/2 + 'px';
                                pointer2.style.display = "none";
                            }       
                        



                        if (hasSpaceOnRightSide(element4) && !hasSpaceBelow(element4))
                            {
                                console.log("1");
                                posleft = currentPosLeft;
                                postop = element4.offsetTop - scrollfromtop - CMHEIGHT;
                                pointer2.style.left = element4.offsetWidth/2 -5 + 'px';
                                pointer2.style.top = CMHEIGHT-5;
                                pointer.style.display = "none";
                            }
                        if (!hasSpaceOnRightSide(element4)&&hasSpaceOnLeftSide(element4) && !hasSpaceBelow(element4))
                            {
                                console.log("2");
                                posleft = currentPosLeft + element4.offsetWidth - CMWIDTH;
                                postop = element4.offsetTop - scrollfromtop - CMHEIGHT;
                                pointer2.style.left = (element4.offsetLeft + element4.offsetWidth/2) - posleft + 'px';
                                pointer2.style.top = CMHEIGHT-5;
                                pointer.style.display = "none";
                            }    
                        if (!hasSpaceOnRightSide(element4)&&!hasSpaceOnLeftSide(element4) && !hasSpaceBelow(element4))
                        {
                                console.log("3");
                                posleft = (window.innerWidth - CMWIDTH)/2;
                                postop = element4.offsetTop - scrollfromtop - CMHEIGHT;
                                pointer2.style.top = CMHEIGHT-5;
                                pointer2.style.left = midword - (window.innerWidth - CMWIDTH)/2 + 'px';
                                pointer.style.display = "none";
                        }

                        //calculating for a window 100px width and 300px high
                        function hasSpaceOnRightSide(elem)
                        {
                            return window.innerWidth - elem.offsetLeft > CMWIDTH;
                        }

                        function hasSpaceOnLeftSide(elem)
                        {
                            return  elem.offsetLeft + elem.offsetWidth/2 > CMWIDTH;
                        }

                        function hasSpaceBelow(elem)
                        {
                            return screen.height - elem.offsetTop  - elem.offsetHeight > CMHEIGHT;
                        }

                    


                        
                        var menu = document.getElementById('contextMenu'+scope.$index);
                        menu.style.left =posleft+'px';
                        menu.style.top =postop+'px';
                        menu.style.width = CMWIDTH + 'px';
                        menu.style.height = CMHEIGHT+ 'px';
                        menu.style.visibility = "visible";
                        menu.style.opacity = 1;
                        // console.log(element.offsetLeft,element.offsetWidth,midword);
                        
                        MongoService.setCmShowing(scope.$index);
                       });
                }

            };
        })

         .directive('conMenu',function()
        {
            return{
                restrict:"E",
                templateUrl: 'views/contextMenu.html',
                link: function (scope, element, attrs)
                {
                    element.bind('click', function(event)
                    {
                        
                    });
                }
            };
        })

        .directive('originalText', function ()
        {
            return {
                restrict: 'E',
                templateUrl: 'views/wordItem_static.html',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel)
                {
                    element.bind('click', function (event)
                    {
                       //Needed for responsive screen adjustment which is otherwise done via a media query 
                       if(window.innerWidth < 768)
                       {
                           var btn = document.getElementById('btn_toggle');
                           btn.click();
                       }
                       var digit = event.target.id.match(/\d+/g);
                       var editorelem = document.getElementById('myWord' + digit);
                       editorelem.focus();
                    });
                }
            };
        })
        /*
         This map remembers which keys are pressed at a certain moment; this map is used in the 'navigate' directive
         */
        .directive('registerKeystrokes', function (KeystrokeService)
        {
            return {
                restrict: "A",
                link: function (scope, element, attrs)
                {
                    $('body').on('keyup  keydown', function (event)
                    {
                        var code = event.which || event.keyCode || eventt.charCode ;
                        KeystrokeService.setMap(code , event.type === 'keydown');
                    });
                    $('body').on('copy cut', function (evt)
                    {
                        console.log("copied something");
                    });

                }
            };
        })

/*
 Makes the selection of a content editable possible by changing this attribute temporary to 'false';
 When we perceive a drag movement over an item that is interpreted as an attempt to select. At that
 moment the contentEditable attribute becomes false. Only when we perceive a new mousedown event
 we will convert again to contentEditable = "true" ; this certainly is a hack but unfortunately the
 browser does not allow to select more then one contentEditable html-element.
 */
        .directive('dragSelection', function (KeystrokeService)
        {
            return {
                restrict: "A",
                link: function (scope, element, attrs)
                {
                    element.bind(" mousedown mousemove mouseup", function (event)
                    {
                        switch (event.type)
                        {
                            case('mousedown'):
                            {
                                var digit = event.target.id.match(/\d+/g);
                                var elem = document.getElementById('myWord' + digit);
                                if(KeystrokeService.getSelectionCoords()['y']=== 0)
                                {
                                    var length = scope.vm.wordModel.length;
                                    for(var i=0; i<length; i++)
                                    {
                                        var el = document.getElementById("myWord" + i);
                                        var el2 = document.getElementById("mySuffix" + i);
                                        el.setAttribute('contentEditable',true);
                                        el2.setAttribute('contentEditable',true);
                                    }

                                    var range = document.createRange();
                                    var sel = window.getSelection();
                                    var node = elem.firstChild;
                                    range.setStart(node, elem.innerHTML.length);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }
                                KeystrokeService.setSelectionX(0);
                                break;
                            }
                            case('mousemove'):
                            {
                                if(KeystrokeService.getSelectionCoords()['x']===0)
                                {

                                    for(var j=0; j<scope.vm.wordModel.length; j++)
                                    {
                                        var ela = document.getElementById("myWord" + j);
                                        var el2a = document.getElementById("mySuffix" + j);
                                        ela.setAttribute('contentEditable',false);
                                        el2a.setAttribute('contentEditable',false);
                                    }
                                    KeystrokeService.clearSelectionCoords();
                                    break;
                                }
                                else
                                {
                                  break;
                                }
                                break;
                            }
                            case('mouseup'):
                            {
                                KeystrokeService.setSelectionY(0);
                                break;
                            }
                        }

                    });
                }
            };
        })


       


        /*
         Regulates cursor behaviour and keyboard events like shift in combination with arrow keys.
         */
      .directive('navigate', function (KeystrokeService)
        {
            return {
                restrict: "A",
                link: function (scope, element, attrs)
                {
                    element.bind("keydown keyup", function (event)
                    {
                        
                        //We need to know which keys are pressed and that is handled via the registerKeystrokes directive
                        
                        var map = KeystrokeService.getMap();
                        //console.info("event type",event.type, event.keyCode);
                        var digit = event.target.id.match(/\d+/g);
                        var myword = document.getElementById('myWord' + digit);
                        //prevent a cursor move down                        
                        if(event.type == 'keydown' && event.keyCode == 40 || event.type == 'keydown' && event.keyCode == 38)
                        {
                            event.preventDefault();
                            //console.info("isolated arrow %s event", event.keyCode == 38?"down":"up");
                        }

                        //Arrow right move
                        if (!map[16] && map[39])
                        {
                            // console.info("RIGHT");
                            var myWord = document.getElementById('myWord' + digit);
                            var currentWord = scope.$parent.vm.wordModel[digit].currentword;
                            var sel = window.getSelection();
                            if (!KeystrokeService.getClosed() && sel.anchorOffset === currentWord.length)
                            {
                                KeystrokeService.setClosed(true);
                                digit++;
                                var nextWord = document.getElementById('myWord' + digit);
                                if (nextWord === null)
                                {
                                    nextWord = document.getElementById('myWord0');
                                }
                                nextWord.focus();
                            }
                            if (sel.anchorOffset === currentWord.length)
                            {
                                KeystrokeService.setClosed(false);
                            }
                        }
                        //if Right key is pressed in combination with SHIFT
                        if (map[16] && map[39])
                        {
                            digit++;
                            var nextWord1 = document.getElementById('myWord' + digit);
                            nextWord1.focus();
                        }

                        // If Left key is pressed TODO: prevent cursor to jump to the previous word when moving to the first letter
                        if (!map[16] && map[37])
                        {
                            if (!KeystrokeService.getClosed() && window.getSelection().anchorOffset === 0)
                            {
                                KeystrokeService.setClosed(true);
                                digit--;
                                var formerWord = document.getElementById('myWord' + digit);
                                if (formerWord === null)
                                {
                                    formerWord = document.getElementById('myWord' + (scope.vm.wordModel.length - 1));
                                }
                                var range = document.createRange();
                                var sel2 = window.getSelection();
                                var node = formerWord.firstChild;
                                range.setStart(node, formerWord.innerHTML.length);
                                range.collapse(true);
                                sel2.removeAllRanges();
                                sel2.addRange(range);
                                formerWord.focus();
                            }
                            if (window.getSelection().anchorOffset === 0)
                            {
                                KeystrokeService.setClosed(false);
                            }
                        }
                        // if Left key is pressed in combination with SHIFT
                        if (map[37] && map[16])
                        {
                            event.preventDefault();
                            digit--;
                            var formerWord1 = document.getElementById('myWord' + digit);
                            formerWord1.focus();
                        }

                        //if only Arrow Up is pressed
                        if (!map[16] && map[38])
                        {
                           
                            //var el = document.getElementById('myWord' + digit);
                            // event.stopPropagation();
                            if(scope.vm.wordModel[digit].synonyms.length > 0)
                            {
                                myword.click();
                            }
                            else
                            {
                                moveVertical(digit, 'arrowUp');
                            }

                            
                        }

                        //if only Arrow Down is pressed
                        if (!map[16] && map[40])
                        {
                            if(scope.vm.wordModel[digit].synonyms.length > 0)
                            {
                                myword.click();
                            }
                            else
                            {
                                moveVertical(digit, 'arrowDown');
                            }
                        }

                        //if Arrow Up is pressed in combination with SHIFT
                        if (map[16] && map[38])
                        {
                            //event.preventDefault();
                            moveVertical(digit, "arrowUp");
                        }

                        //if Arrow Down is pressed in combination with SHIFT
                        if (map[16] && map[40])
                        {
                            //event.preventDefault();
                            moveVertical(digit, "arrowDown");
                        }

                        function moveVertical(digit, keystring)
                        {
                            var currentword = document.getElementById("myWord" + digit);
                            var linewidth = document.getElementById("editorWindow").offsetWidth;
                            var text = [];
                            var line = {};
                            var sum = 0;
                            for (var i = 0; i < scope.vm.wordModel.length; i++)
                            {
                                var wo = document.getElementById("myWord" + i);
                                var suf = document.getElementById("mySuffix" + i);
                                sum += wo.offsetWidth + suf.offsetWidth;
                                if (sum <= linewidth)
                                {
                                    line[i] = wo.offsetLeft + (wo.offsetWidth / 2);
                                }
                                else
                                {
                                    i--;
                                    sum = 0;
                                    text.push(line);
                                    line = {};
                                }
                                if (i === scope.vm.wordModel.length - 1)
                                {
                                    text.push(line);
                                }
                            }


                            switch (keystring)
                            {
                                case "arrowUp":
                                {
                                    var currentline = 0;
                                    for (var j = 0; j < text.length; j++)
                                    {

                                        if (text[j][digit])
                                        {
                                            currentline = j;
                                            break;
                                        }
                                    }
                                    var offset = text[currentline][digit];
                                    currentline--;
                                    if (currentline < 0)
                                    {
                                        currentline = text.length - 1;
                                    }
                                    var keys = Object.keys(text[currentline]);
                                    var newindex = -1;
                                    for (var k = 0; k < keys.length; k++)
                                    {
                                        if (text[currentline][keys[k]] <= offset)
                                        {
                                            newindex = keys[k];
                                        }
                                    }
                                    if (newindex === -1)
                                    {
                                        newindex = keys[0];
                                    }
                                    document.getElementById('myWord' + newindex).focus();
                                    break;
                                }
                                case "arrowDown":
                                {

                                    var currentline1 = 0;
                                    for (var i1 = 0; i1 < text.length; i1++)
                                        if (text[i1][digit])
                                        {
                                            currentline1 = i1;
                                            break;
                                        }
                                    var offset = text[currentline1][digit];
                                    currentline1++;
                                    if (currentline1 > text.length - 1)
                                    {
                                        currentline1 = 0;
                                    }
                                    var keys = Object.keys(text[currentline1]);
                                    var newindex = -1;
                                    for (var k1 = 0; k1 < keys.length; k1++)
                                    {
                                        if (text[currentline1][keys[k1]] <= offset)
                                        {
                                            newindex = keys[k1];
                                        }
                                    }
                                    if (newindex === -1)
                                    {
                                        newindex = keys[0];
                                    }
                                    document.getElementById('myWord' + newindex).focus();
                                    break;
                                }
                            }
                        }


                    });
                }
            };
        })

        .directive('contenteditable', ['$sniffer', '$browser', 'KeystrokeService', function ($sniffer, $browser, KeystrokeService)
        {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attr, ctrl)
                {
                    if (!$sniffer.android)
                    {
                        var composing = false;

                        element.on('compositionstart', function ()
                        {
                            composing = true;
                        });

                        element.on('compositionend', function ()
                        {
                            composing = false;
                            listener();
                        });
                    }

                    var timeout;

                    var listener = function (ev)
                    {

                        if (timeout)
                        {
                            $browser.defer.cancel(timeout);
                            timeout = null;
                        }
                        if (composing) return;
                        var value = element.html(),
                            event = ev && ev.type;
                        // By default we will trim the value
                        // If the attribute ng-trim exists we will avoid trimming
                        // If input type is 'password', the value is never trimmed
                        if (!attr.ngTrim || attr.ngTrim !== 'false')
                        {
                            value = value.trim ? value.trim() : value;
                        }


                        // If a control is suffering from bad input (due to native validators), browsers discard its
                        // value, so it may be necessary to revalidate (by calling $setViewValue again) even if the
                        // control's value is the same empty value twice in a row.
                        if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators))
                        {
                            ctrl.$setViewValue(value, event);
                        }

                        var digit = ev.target.id.match(/\d+/g);
                        KeystrokeService.changeLength(value);
                        var length = KeystrokeService.getWords();
                        scope.$emit('lengthChange', length);


                    };

                    // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
                    // input event on backspace, delete or cut
                    if ($sniffer.hasEvent('input'))
                    {
                        element.on('input', listener);
                    }
                    else
                    {
                        var deferListener = function (ev, input, origValue)
                        {
                            if (!timeout)
                            {
                                timeout = $browser.defer(function ()
                                {
                                    timeout = null;
                                    if (!input || input.value !== origValue)
                                    {
                                        listener(ev);
                                    }
                                });
                            }
                        };

                        element.on('keydown', function (event)
                        {
                            var key = event.keyCode;

                            // ignore
                            //    command            modifiers                   arrows
                            if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                            deferListener(event, this, this.value);
                        });

                        // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
                        if ($sniffer.hasEvent('paste'))
                        {
                            element.on('paste cut', deferListener);
                        }
                    }

                    ctrl.$render = function ()
                    {
                        // Workaround for Firefox validation #12102.
                        var value = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                        if (element.html() !== value)
                        {
                            element.html(value);
                        }
                    };

                    ctrl.$formatters.push(function (value)
                    {
                        return ctrl.$isEmpty(value) ? value : value.toString();
                    });
                }
            };
        }]);



})();