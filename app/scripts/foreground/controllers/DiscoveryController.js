(function() {

    angular.module('soundCloudify')
            .controller('DiscoveryController', DiscoveryController)

    function DiscoveryController($scope, $mdSidenav, $state, $timeout) {
        var vm = this;
        
        var states = ['nowPlaying', 'search', 'playlist.list', 'charts.list'];

        var activeTab;

        chrome.storage.local.get('activeTab', function (result) {
            activeTab = result.activeTab;
            vm.selectedIndex = isNaN(activeTab) ? 3 : activeTab;
        });

        vm.onTabSelect = function() {
            $timeout(function() {
                chrome.storage.local.set({'activeTab': vm.selectedIndex});
                $state.go(states[vm.selectedIndex]);
            });
        };
    }
}());