'use strict';

angular.module('picsilyApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.showMenu = true;
            $scope.message = "Loading ...";
            $scope.dishes= {};
            

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = true;

            $scope.dishes = menuFactory.getDishes().query( function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
            $scope.feedback = {};
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    // Store to server
                    feedbackFactory.getFeedback()
                                   .save($scope.feedback);
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.dish = {};
            $scope.showDish = true;
            $scope.message="Loading ...";
            /*$scope.dish = menuFactory.getDishes()
                .get({id:parseInt($stateParams.id,10)})
                .$promise.then(
                    function(response){
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    });*/

            
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                
                $scope.dish.comments.push($scope.mycomment);
                
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);

                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        .controller('IndexController', ['$scope', '$stateParams','corporateFactory', 'menuFactory','userFactory', function($scope,$stateParams,corporateFactory, menuFactory, userFactory) {
            // Chef section (fourth leader)
            $scope.showPromotion = false;
            $scope.promotionMessage = "Loading ...";            
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.leaderMessage = "Loading ...";
            $scope.showLeader = false;
            $scope.loggedIn = false;

            $scope.user = userFactory.getUser().then(function(response){
                $scope.user = response;
                $scope.loggedIn = true;
            },
            function(errorResponse){
                $scope.userError = "Error: "+errorResponse.status + " " + errorResponse.statusText;
            });

            // Promotion (first promotion)
            /*$scope.promotion = menuFactory.getPromotions()
                                        .get({id: 0})
                                        .$promise.then(
                                            function(response){
                                                $scope.promotion = response;
                                                $scope.showPromotion = true;
                                            },
                                            function(response) {
                                                $scope.promotionMessage = "Error: "+response.status + " " + response.statusText;
                                        });


            $scope.dish = {};
            // Dish to display on homepage (first dish)
            $scope.dish = menuFactory.getDishes()
                                    .get({id:0})
                                    .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            $scope.showDish = true;
                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                    });
            
            corporateFactory.getLeaders()
                            .get({id: 3})
                            .$promise.then(
                                        function(response){
                                            $scope.leader = response;
                                            $scope.showLeader = true;
                                        },
                                        function(response) {
                                            $scope.leaderMessage = "Error: "+response.status + " " + response.statusText;
                                    });
                                    */
    
        }])
        .controller('LoginController', ['$scope', '$rootScope', 'userFactory', function($scope, $rootScope, userFactory) {
            $scope.showLogin = false;
            $scope.messages = {loginMessage:  ""};
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
                            $scope.$apply();
                        },
                        function(response) {
                            $scope.messages.loginMessage = "Error: "+response.status + " " + response.statusText;
                    });   
            };

        }])

        .controller('CardsController', ['$scope', 'photoFactory', function($scope, photoFactory) {

        }])

        .controller('HomeController', ['$scope', '$rootScope', 'userFactory', function($scope, $rootScope, userFactory) {
            $scope.isLoggedIn = false;
            $rootScope.isUserLoggedIn = false;
            userFactory.getUser(function(response){
                if(response.username){
                    $scope.isLoggedIn = true;
                    $rootScope.isUserLoggedIn = true;
                    $scope.apply();
                }
            });
        }]);
