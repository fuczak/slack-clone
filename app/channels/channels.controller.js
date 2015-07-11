'use strict';
angular.module('angularfireSlackApp')
  .controller('ChannelsCtrl', function ($state, Auth, Users, profile, channels) {
    var channelsCtrl = this;

    channelsCtrl.profile = profile;
    channelsCtrl.channels = channels;
    channelsCtrl.getDisplayName = Users.getDisplayName;
    channelsCtrl.getGravatar = Users.getGravatar;
    channelsCtrl.users = Users.all;

    channelsCtrl.newChannel = {
      name: ''
    };

    channelsCtrl.createChannel = function () {
      channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function (ref) {
        $state.go('channels.messages', {channelId: ref.key()});
      });
    };

    channelsCtrl.logout = function () {
      Auth.$unauth();
      $state.go('home');
    };

  });
