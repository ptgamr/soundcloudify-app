(function() {

    angular.module('soundCloudify')
            .controller('ChartsController', ChartsController)

    function ChartsController(Category, $state, $timeout) {
        var vm = this;

        $timeout(function() {
            Category.getList().then(function(categories) {
                vm.categories = categories;
            });
        }, 100);


        vm.selectCategory = function(category) {
            $state.go('charts.detail', {category: category});
        };

        vm.sanitizeCategory = function(category) {
            return unescape(category).replace(/\+/g, " ");
        };
    }
}());