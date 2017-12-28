'use strict';

angular.module('picsilyApp')
     
        .controller('IndexController', ['$scope', '$stateParams','userFactory', function($scope,$stateParams, userFactory) {
            $scope.loggedIn = false;

            $scope.user = userFactory.getUser().then(function(response){
                $scope.user = response;
                $scope.loggedIn = true;
            },
            function(errorResponse){
                $scope.userError = "Error: "+errorResponse.status + " " + errorResponse.statusText;
            });
    
        }])
        .controller('LoginController', ['$scope', '$rootScope', 'userFactory', function($scope, $rootScope, userFactory) {
            $scope.showLogin = false;
            $scope.messages = {loginMessage:  "", registerMessage: ""};
            $scope.user = {username: "",password: ""};
            $scope.loggedIn = false;

            $scope.showToggle = function(){
                $scope.showLogin = !$scope.showLogin;
            }

            $scope.login = function(){
                $scope.messages.loginMessage = "Logging you in...";
                userFactory.login($scope.user.username, $scope.user.password)
                    .then(
                        function(response){
                            $scope.messages.loginMessage = "Logged in! :)";
                            $scope.loggedIn = true;
                            $rootScope.isUserLoggedIn = true;
                            window.location.reload();
                            //$scope.$apply();
                        },
                        function(response) {
                            $scope.messages.loginMessage = "Error: "+response.status + " " + response.statusText;
                    });   
            };

            $scope.register = function(){
                $scope.messages.registerMessage = "Signing up...";
                userFactory.register($scope.user.firstname, $scope.user.lastname, $scope.user.username, $scope.user.password).then(function(response){
                    return response.json();
                }).then(function(oData){
                    $scope.messages.registerMessage = "Welcome to Picsily";
                });
            }

        }])

        .controller('CardsController', ['$scope', 'photoFactory', function($scope, photoFactory) {

        }])

        .controller('CollectionsController', ['$scope', 'photoFactory', function($scope, photoFactory) {
            $scope.photos = [];
            $scope.photos = photoFactory.getPhotos();
            photoFactory.observe(function(){
                $scope.photos = photoFactory.getPhotos();
            });
            /*photoFactory.getPhotos().then(function(response){
                return response.json();
            }).then(function(oPhotos){
                $scope.photos = oPhotos;
                $scope.$apply();
            });*/

        }])

        .controller('UploadController', ['$scope','$rootScope', 'userFactory',  'photoFactory', function($scope, $rootScope, userFactory, photoFactory) {

            $scope.fileExists = false;

            $scope.handleFile = function(scope){
                var oFileInput = jQuery(".fab-input")[0];
                var oFile = oFileInput.files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                  jQuery('#preview').attr('src', e.target.result);
                  scope.fileExists = true;
                  scope.$apply();
                };
                reader.readAsDataURL(oFile);
            };

            $scope.cancelFile = function(){
                $scope.fileExists = false;
                var oFileInput = jQuery(".fab-input");
                oFileInput.val('');
            };

            $scope.startUpload = function(){
                $rootScope.isLoading = true;
                var oFileInput = jQuery(".fab-input")[0];
                var oFile = oFileInput.files[0];
                photoFactory.upload(oFile).then(function(oPhoto){
                    $scope.cancelFile();
                    $scope.$apply();
                    $rootScope.isLoading = false;
                    oPhoto.json().then(function(oPhoto){
                        photoFactory.addPhoto(oPhoto);    
                        alert("Uploaded");
                    })
                });
                
            };

            $scope.handleFileInput = function(){
                jQuery(".fab-input").trigger('click');
            };

        }])
        .controller('MenuController', ['$scope', '$rootScope', 'userFactory', 'photoFactory', function($scope, $rootScope, userFactory, photoFactory) {
            $scope.isLoggedIn = false;
            userFactory.getUser().then(function(response){
                return response.json();
            }).then(function(response){
                if(response.username){
                    $scope.isLoggedIn = true;
                    $scope.$apply();
                }
            });

            $scope.logout = function(){
                picsilyAppUtil.serviceUtil.logoutUser();
                window.location.reload();
            };

        }])
        .controller('HomeController', ['$scope', '$rootScope', 'userFactory', 'photoFactory', function($scope, $rootScope, userFactory, photoFactory) {
            $scope.photos = [];
            $scope.isLoggedIn = false;
            $rootScope.isUserLoggedIn = false;
            $rootScope.user = {username: '', firstname: '', lastname: ''};
            userFactory.getUser().then(function(response){
                return response.json()
            }).then(function(response){
                if(response.username){
                    $scope.isLoggedIn = true;
                    $rootScope.isUserLoggedIn = true;
                    $rootScope.user = response;
                    $scope.$apply();
                }
            });

            photoFactory.observe(function(){
                $scope.photos = photoFactory.getMyPhotos();
                $scope.$apply();
            });

            photoFactory.loadMyPhotos();

        }]);
