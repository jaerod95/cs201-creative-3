angular.module('Quest', [])
    .controller('MainCtrl', [
        '$scope',
        function($scope) {
            $scope.text = 'Hello World'
        }
    ]);
