'use strict';

angular.module('picsilyApp')
        .constant("baseURL","http://localhost:3000/")
        .factory('userFactory', ["$resource", 'baseURL', function($resource, baseURL) {
    
            var oFactory = {};
            oFactory.getUser = function(){
                return picsilyAppUtil.serviceUtil.getDataFromService("/users/loggedInUser");
            };

            oFactory.login = function(username, password){
              return picsilyAppUtil.serviceUtil.loginUser(username, password);
            };

            oFactory.register = function(firstname, lastname, username, password){
                return picsilyAppUtil.serviceUtil.registerUser(firstname, lastname, username, password);
            };
            
            return oFactory;
            
        }])
        .factory('photoFactory', ["$resource", 'baseURL', function($resource, baseURL) {
    
            var oFactory = {};
            oFactory.photos = [];
            oFactory.feedPhotos = [];
            oFactory.myPhotos = [];
            oFactory.observers = [];

            oFactory.updateObservers = function(){
                for (var i = oFactory.observers.length - 1; i >= 0; i--) {
                     oFactory.observers[i].call();
                 } 
            };

            oFactory.observe = function(oCallback){
                oFactory.observers.push(oCallback);
            }

            oFactory.addPhoto = function(oPhoto){
                var aTempPhotos = oFactory.photos.slice();
                aTempPhotos.push(oPhoto);
                angular.copy(aTempPhotos, oFactory.photos);
                oFactory.updateObservers();
            }

            oFactory.reloadPhotos = function(){
                picsilyAppUtil.serviceUtil.getDataFromService("/photos/")
                .then(function(response){
                    return response.json()
                })
                .then(function(aPhotos){
                    angular.copy(aPhotos, oFactory.photos);
                    oFactory.updateObservers();
                });
            }

            oFactory.loadMyPhotos = function(){
                picsilyAppUtil.serviceUtil.getDataFromService("/photos/my/")
                .then(function(response){
                    return response.json()
                })
                .then(function(aPhotos){
                    angular.copy(aPhotos, oFactory.myPhotos);
                    oFactory.updateObservers();
                });
            };

            oFactory.getMyPhotos = function(){
                return oFactory.myPhotos;
            };

            oFactory.getPhotos = function(){
                return oFactory.photos;
            };

            oFactory.upload = function(file){
                return picsilyAppUtil.serviceUtil.uploadPhoto(file);
            };

            oFactory.reloadPhotos();
            oFactory.loadMyPhotos();
            
            return oFactory;
            
        }]);