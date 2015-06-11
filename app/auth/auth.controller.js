'use strict';
angular.module('angularfireSlackApp')
  .controller('AuthCtrl', function (Auth, $state) {
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function () {
      Auth.$authWithPassword(authCtrl.user)
        .then(function() {
          $state.go('home');
        })
        .catch(function (error) {
          authCtrl.error = error;
        });
    };

    authCtrl.register = function () {
      Auth.$createUser(authCtrl.user)
        .then(function () {
          authCtrl.login();
        })
        .catch(function (error) {
          authCtrl.error = error;
        });
    };

  });
