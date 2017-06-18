(function ()
{
    'use strict';
    var app = angular.module('contextmenu');

    app.constant('API_URL', "https://backend-synomus.herokuapp.com");


    app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q)
    {

        return {
            login: login,
            logout: logout,
            getUser: getUser
        };

    //app.constant('API_URL', "https://localhost:3000");
        function getUser()
        {
            if (AuthTokenFactory.getToken())
            {
                return $http.get(API_URL + '/me');
            }
            else
            {
                return $q.reject({data: 'client has no auth token'});
            }
        }

        function login(useremail, password)
        {
            return $http.post(API_URL + '/login',
                {
                    useremail: useremail,
                    password: password
                }).then(function success(response)
            {
                AuthTokenFactory.setToken(response.data.token);
                return response;
            });
        }

        function logout(useremail)
        {
            return $http.post(API_URL + '/logout',{useremail: useremail
            }).then(function succes(response)
            {
                console.info("returning from backend",response);
                AuthTokenFactory.setToken();
                return response;
            }, function failure(response)
            {
                console.info("returning error from backend",response);
                return response;
            });

        }

    });


    app.factory('AuthTokenFactory', function AuthTokenFactory($window)
    {

        var store = $window.localStorage;
        var key = 'auth-token';

        return {
            getToken: getToken,
            setToken: setToken
        };

        function getToken()
        {
            return store.getItem(key);
        }

        function setToken(token)
        {
            if (token)
            {
                store.setItem(key, token);
            }
            else
            {
                store.removeItem(key);
            }
        }
    });


    app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory)
    {

        return {
            request: addToken
        };

        function addToken(config)
        {
            var token = AuthTokenFactory.getToken();
            if (token)
            {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    });


    /*
     Makes a http call to the backend and returns a document that represents some text
     findSynonyms makes a server call to retrieve synonyms for words
     the Lib functions store words that are already retrieved to prevent duplicates.
     */
    app.factory('MongoService', function ($http, API_URL)
    {

        var modaltexts={
            modal1:{modalheader:"Login of Registreer",modaltext:"Login met je e-mailadres en wachtwoord of registreer je gratis of de site."},
            modal2:{modalheader:"Gebruikersnaam of Wachtwoord incorrect",modaltext:"Login met je e-mailadres en wachtwoord of registreer je gratis of de site."},
            modal4:{modalheader:"Voer een tekst in",modaltext:"Synomus heeft een tekst nodig. Type of plak een tekst in het invulveld!"},
            modal3:{modalheader:"Tekst te lang ",modaltext:"Je text mag maximaal 1000 woorden zijn. Splits je tekst op en plak het later weer aan elkaar."}};

        var items = [
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"niettemin",currentword:"niettemin",originalsuffix:" ", suffix:" ",synonyms:['sdf','bsfbb','ccfgc'],rhymewords:['wdww','eede'],description:['des 13','des1a1']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"deze",currentword:"deze",originalsuffix:" ", suffix:" ",synonyms:['aaa','bbb','ccc'],rhymewords:['www','eee'],description:['des 1','des1a']},
        {originalword:"text",originalsuffix:" ", currentword:"text",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 2']},
        {originalword:"verbijstert",originalsuffix:" ", currentword:"verbijstert",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 3']},
        {originalword:"oplettende",originalsuffix:" ", currentword:"oplettende",suffix:" ",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 4']},
        {originalword:"lezertjes",originalsuffix:".", currentword:"lezertjes",suffix:".",synonyms:['gg','bbb','ccc'],rhymewords:['qq','ee'],description:['des 5']}
        ]

        var contexMenuShowing = -1;
        var blacklist = {kan:"verb-tti",bij:"other-preposition",dan:"other-conjunction",ogen:"noun-plural",van:"other-preposition",af:"other-indeterminate",hen:"other-pvnw",zijn:"ambiguous-verb-ttp-other-bvnw",was:"verb-vte" , is:"verb-tti", ben:"verb-tti", waren:"verb-vtp", hebt:"verb-tte", heeft:"verb-tte", hebben:"verb-ttp",had:"verb-vte" ,heb:"verb-tti", aan:"other-vz",op:"other-vz",voor:"other-vz",naar:"other-vz",uit:"other-vz"};
        var lib = {};
        var thedata = [];
        var thebuffer = [];
        var modal;
        return {
            testServer: testServer,
            findSynonyms: findSynonyms,
            getLib: getLib,
            setItemInLib: setItemInLib,
            clearLib: clearLib,
            deleteItemInLib: deleteItemInLib,
            getBlacklist: getBlacklist,
            getData: getData,
            setData: setData,
            clearData: clearData,
            dataLength: dataLength,
            getModalTexts: getModalTexts,
            getItems:getItems
        };





        function getItems()
        {
            return items;
        }

        function getCmShowing()
        {
            return contexMenuShowing
        }

        function setCmShowing(val)
        {
            contexMenuShowing = val;
        }


       function getModalTexts()
       {
         return modaltexts;
       }


        /*
        Functions that perform cache activities: when a user wants to return to the original text
        the original data are loaded again.
         */
        function dataLength()
        {
            return thedata.length;
        }

        function clearData()
        {
            thedata.splice(0);
            thebuffer.splice(0);
            // console.log("emptying array, length must be O: " + thedata.length);
        }

        function getData()
        {
            var helper = thedata.shift();
            thebuffer.push(helper);
            if (thedata.length === 0)
            {
                thedata = angular.copy(thebuffer);
                // console.log("restoring data in service: " + thedata.length);
                thebuffer.splice(0);
                // console.log(thedata);
            }
            // console.log("data length now: " + thedata.length);
            return helper;
        }

        function setData(data)
        {
            thedata.push(data);
        }

        /*
        The blacklist contains strings that are ruled out for surveying
         */
        function getBlacklist()
        {
            return blacklist;
        }

        /*
        The Lib is a cache for items that are already queried; whenever there is a duplicate value in the
        text a run to the backend is spared
         */
        function getLib()
        {
            return lib;
        }

        function setItemInLib(word, attachment)
        {
            lib[word] = attachment;
        }

        function deleteItemInLib(word)
        {
            delete lib[word];
        }


        function clearLib()
        {
            lib = {};
        }

/*
Main function of the MongoService : a limited string is submitted to the backend to query for synonyms ; the
retrieved data are stored in the 'attachment'part of the wordModel.
 */
        function findSynonyms(string, useremail)
        {
            var inputString = {inputstring: string, useremail:useremail};
            return $http.post(API_URL + '/synonyms', inputString).then(
                function succes(response)
                {
                    return response;
                },
                function failure(response)
                {
                    console.log('calling the server failed....') + angular.toJson(response);
                    return response;
                });
        }


        function testServer()
        {
            return $http.get(API_URL + '/').then(
                function succes(response)
                {
                    return response;
                },
                function failure(response)
                {
                    console.log('testing the server gave a failure....') + angular.toJson(response);
                    return response;
                });
        }
    });


    /*
     The Map function registers the keys pushed at the moment and stores them into a map; from the
     directive this map is consulted to see which navigational action has to be taken. The amount of
     words in a text and the total length are being kept track of.
     */
    app.factory("KeystrokeService", function ()
    {
        var map = {};
        var thewords = 0;
        var currentword = "";
        var amountOfWords = 0;
        var closed = true;
        var selectionCoords = {};

        return {
            currentword: currentword,
            getMap: getMap,//helpers to register current key combinations (arrows, alt keys etc)
            setMap: setMap,
            clearMap: clearMap,
            setWords: setWords,
            changeLength: changeLength,
            setCurrentWord: setCurrentWord,
            getTextLength: getTextLength,
            getCurrentWord: getCurrentWord,
            getWords: getWords,
            setAmountOfWords: setAmountOfWords,
            getAmountOfWords: getAmountOfWords,
            getClosed: getClosed,//helpers to fixate the cursor at the end or beginning of a word to prevent 'cursor jumping'
            setClosed: setClosed,
            getSelectionCoords: getSelectionCoords, //helper to keep track of drag start
            setSelectionX: setSelectionX,
            setSelectionY: setSelectionY,
            clearSelectionCoords:clearSelectionCoords
        };

        function getSelectionCoords()
        {
            return selectionCoords;
        }

        function setSelectionY(yCoord)
        {
            selectionCoords = { y:yCoord};
        }

        function setSelectionX(xCoord)
        {
            selectionCoords = { x:xCoord};
        }

        function clearSelectionCoords()
        {
            selectionCoords = {};
        }


        function getClosed()
        {
            return closed;
        }

        function setClosed(status)
        {
            closed = status;
        }


        function setAmountOfWords(digit)
        {
            amountOfWords = digit;
        }

        function getAmountOfWords()
        {
            return amountOfWords;
        }


        function changeLength(word)
        {
            //if we see a split in the current word or a split word being restored we adapt the amount of words. The
            // 'lengthChange' listener in the controller will update the view.
            amountOfWords += (word.split(/\s+/).length - currentword.split(/\s+/).length);

            //amount of characters is measured here.
            var difference = (word.length - currentword.length);
            thewords += difference;
            // console.log("change length, total words length " + thewords);
            currentword = word;
        }

        function setCurrentWord(word)
        {
            currentword = word;
        }

        function getCurrentWord()
        {
            return currentword;
        }

        function getTextLength()
        {
            return thewords;
        }


        function setWords(textlength)
        {
            // console.log("updating model...");
            thewords = textlength;
        }


        function getWords()
        {
            return thewords;
        }

        function clearMap()
        {
            map = {};
        }

        function setMap(key, value)
        {
            map[key] = value;
        }

        function getMap()
        {
            return map;
        }
    });

  


})();


















