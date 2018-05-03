var app = angular.module('SecSysApp', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'

        }).when('/online', {
            templateUrl: 'partials/online.html',
            controller: 'OnlineCtrl'
        
        }).when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        
        }).otherwise({
            redirectTo: '/'
        });
}]);

app.service("authentication", ["$window","$http", function($window,$http){
    var saveToken = function (token){
        $window.localStorage["jwt-token"] = token;
    };
    var getToken = function (){
        return $window.localStorage["jwt-token"];
    };
    var register = function(user){
        return $http.post("/users/register", user).success(function(data){
            saveToken(data.token);
        });
    };
    var login = function(user){
        return $http.post("/users/login", user).success(function(data){
            saveToken(data.token);
        });
    };
    var logout = function(){
        $window.localStorage.removeItem("jwt-token");
        console.log("token removed");

    };

    var isLoggedIn = function(){
        var token = getToken();

        if (token){
            var payload = JSON.parse($window.atob(token.split(".")[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    var currentUser = function(){
        if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split(".")[1]));
            console.log(payload);
            return{
                email: payload.email,
                name: payload.name,
                id: payload._id
            };
        }
    };

    return {
        saveToken: saveToken,
        getToken: getToken,
        register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
    };
}]);


app.controller("LoginCtrl", ["$scope","$location", "authentication",function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        openView = "login";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(https://sodio.tech/wp-content/uploads/2016/12/3-3157003-technology-network-loop-background.jpg)"
        });
    });
    $scope.userLogin = function(){
        console.log("login function");
        authentication.login($scope.user).then(function(){
            console.log('tuli reittiin');
            $location.path("/online");
        });
        
    };
}]);
app.controller("RegisterCtrl", ["$scope","$location", "authentication",function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        openView = "register";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(https://sodio.tech/wp-content/uploads/2016/12/3-3157003-technology-network-loop-background.jpg)"
        });
    });
    $scope.userRegister = function(){
        console.log("Register function");
        authentication.register($scope.user).then(function(){
            console.log('homma rokkaa');
            $location.path("/online");
        })
    };
}]);

app.controller("OnlineCtrl", ["$scope", "$location", "authentication",function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        openView = "online";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(https://sodio.tech/wp-content/uploads/2016/12/3-3157003-technology-network-loop-background.jpg)"
        });
    });
    $scope.user = authentication.currentUser();
    $scope.isLoggedIn = authentication.isLoggedIn();
    $scope.userLogOut = function(){
        console.log("yritit logata ulos");
        authentication.logout();
        console.log("toimi logout");
        $location.path("/home");   
    };

}]);

app.controller('HomeCtrl', ['$scope', '$resource',  function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
        openView = "home";

        $('body').css( {
        	"background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(https://sodio.tech/wp-content/uploads/2016/12/3-3157003-technology-network-loop-background.jpg)"
        });
    });
}]);
