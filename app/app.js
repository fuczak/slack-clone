'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireAuth().then(function () {
              $state.go('channels');
            }, function () {
              return;
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'auth/login.html',
        controller: 'AuthCtrl as authCtrl',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireAuth()
              .then(function () {
                $state.go('home');
              })
              .catch(function () {
                return;
              });
          }
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'auth/register.html',
        controller: 'AuthCtrl as authCtrl',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireAuth()
              .then(function () {
                $state.go('home');
              })
              .catch(function () {
                return;
              });
          }
        }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'users/profile.html',
        controller: 'ProfileCtrl as profileCtrl',
        resolve: {
          auth: function ($state, Users, Auth) {
            return Auth.$requireAuth()
              .catch(function () {
                $state.go('home');
              });
          },
          profile: function (Users, Auth) {
            return Auth.$requireAuth().then(function (authData) {
              return Users.getProfile(authData.uid).$loaded();
            });
          }
        }
      })
      .state('channels', {
        url: '/channels',
        templateUrl: 'channels/index.html',
        controller: 'ChannelsCtrl as channelsCtrl',
        resolve: {
          channels: function (Channels) {
            return Channels.$loaded();
          },
          profile: function($state, Auth, Users) {
            return Auth.$requireAuth().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                if (profile.displayName) {
                  return profile;
                } else {
                  $state.go('profile');
                }
              });
            }, function () {
              $state.go('home');
            });
          }
        }
      })
      .state('channels.create', {
        url: '/create',
        templateUrl: 'channels/create.html',
        controller: 'ChannelsCtrl as channelsCtrl'
      })
      .state('channels.messages', {
        url: '/{channelId}/messages',
        templateUrl: 'channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function ($stateParams, Messages) {
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function ($stateParams, channels) {
            return '#' + channels.$getRecord($stateParams.channelId).name;
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://fuczak-slack-clone.firebaseio.com/');
