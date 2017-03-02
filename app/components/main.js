var app = angular.module('Quest', ['ui.router', 'ngAnimate'])
    .service('sharedProperties', function () {
        var randomText = 'Hello World';
        var knight = "assets/img/stand.gif";
        var level = 1;
        var textNum = 5;
        return {
            getRandomText: function () {
                return randomText;
            },
            setRandomText: function (value) {
                randomText = value;
            },

            getKnight: function () {
                return knight;
            },
            setKnight: function (value) {
                knight = value;
            },
            getLevel: function () {
                return level;
            },
            setLevel: function (value) {
                level = value;
            },
            getTextNum: function () {
                return textNum;
            },
            setTextNum: function (value) {
                textNum = value;
            }
        };
    })
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/begin.html',
                    controller: 'MainCtrl'
                })
                .state('fight', {
                    url: '/fight',
                    templateUrl: '/fight.html',
                    controller: 'FightCtrl'
                })
                .state('win', {
                    url: '/win',
                    templateUrl: '/win.html',
                    controller: 'FinishCtrl'
                })
                .state('lose', {
                    url: '/lose',
                    templateUrl: '/lose.html',
                    controller: 'FinishCtrl'
                })
            $urlRouterProvider.otherwise('home');
        }
    ])
app.controller('MainCtrl',
    function ($scope, $document, $state, $sce, $timeout, sharedProperties) {
        $timeout(function () {
            $document[0].getElementById('storytext1').style.opacity = 1;
            $timeout(function () {
                $document[0].getElementById('storytext2').style.opacity = 1;
                $timeout(function () {
                    $document[0].getElementById('storytext3').style.opacity = 1;
                    $timeout(function () {
                        $document[0].getElementById('startbtn').style.opacity = 1;
                    }, 1500)
                }, 1500);
            }, 1500);
        }, 1500);

        $scope.fadeToFight = function () {
            $scope.getText();
            $document[0].body.style.background = "white";
            $document[0].body.style.transition = '2s all';
            $document[0].body.style.opacity = 0;

            setTimeout(function () {
                $document[0].body.style.opacity = 1;
                $state.go('fight');
            }, 2000);
        }

        $scope.getText = function () {
            var text = "";
            $scope.sendRequest(
                "http://www.randomtext.me/api/lorem/p-" + sharedProperties.getTextNum() + "/5-10",
                "GET",
                null,
                function (data) {
                    sharedProperties.setRandomText(JSON.parse(data.target.responseText).text_out);
                })
        }

        $scope.sendRequest = function (url, type, data, callback) {
            //console.log([url, type, data, callback]);
            var request = new XMLHttpRequest();
            request.open(type, url);
            request.onload = callback;
            request.send(JSON.stringify(data));
        }
    }
);

app.controller('FightCtrl',
    function ($scope, $document, $state, $sce, $timeout, $interval, sharedProperties) {
        $scope.randomText = $sce.trustAsHtml(sharedProperties.getRandomText());
        $scope.knight_img = sharedProperties.getKnight();
        $scope.monsterHit = false;
        $scope.monsterHitDone = false;
        $scope.HERO = {
            health: "100",
            healthbar: {
                "width": this.health + '%'
            }
        };
        $scope.MONSTER = {
            health: "100",
            healthbar: {
                "width": [this] + '%'
            }
        };

        $timeout(function () {
            $scope.heroHurt();
        }, 3000);

        $scope.heroHurt = function () {
            $interval(function () {
                $scope.HERO.health -= 1.3;
                $scope.HERO.health = $scope.HERO.health.toFixed(2);
                $scope.HERO.healthbar.width = $scope.HERO.health + '%';
                if ($scope.HERO.health <= 0)
                    $scope.end('lose');
            }, 1000)
        }

        $scope.attack = function ($event) {
            if ($event.keyCode == 32 || $event.keyCode == 13)
                $scope.hit();
        }

        $scope.hit = function () {
            this.MONSTER.health -= 10 / sharedProperties.getLevel();
            $scope.showHit();
            this.MONSTER.health = this.MONSTER.health.toFixed(2);
            if (this.MONSTER.health <= 0)
                $scope.end('win');
            else {
                this.MONSTER.healthbar.width = this.MONSTER.health + '%';
                sharedProperties.setKnight("assets/img/attack.gif");
                $scope.knight_img = sharedProperties.getKnight();
                sharedProperties.setKnight('assets/img/stand.gif');
                $timeout(function () {
                    $scope.knight_img = sharedProperties.getKnight()
                }, 300);
            }
        }

        $scope.showHit = function () {
            $scope.monsterHitDone = true;
            $timeout(function () {
                $scope.monsterHitDone = false;
            }, 1000);
        }

        $scope.end = function (status) {
            $document[0].body.style.opacity = 0;
            $document[0].body.style.background = 'black';
            $timeout(function () {
                if (status == 'win') {
                    sharedProperties.setLevel(sharedProperties.getLevel() + 1);
                    $document[0].body.style.opacity = 1;
                    $state.go('win');
                } else {
                    sharedProperties.setLevel(1);
                    $document[0].body.style.opacity = 1;
                    $state.go('lose');
                }

            }, 1000)
        }
    });

    app.controller('FinishCtrl', 
    function($scope, $timeout, $document) {
        $timeout(function() {
            $document[0].getElementById('finishText1').style.opacity = 1;
            $timeout(function() {
                $document[0].getElementById('finishText2').style.opacity = 1;
                $timeout(function() {
                    $document[0].getElementById('startbtn').style.opacity = 1;
                }, 1000)
            }, 1000)
        }, 1000);
    });