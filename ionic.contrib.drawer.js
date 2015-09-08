(function () {

    'use strict';

    /**
     * The ionic-contrib-frosted-glass is a fun frosted-glass effect
     * that can be used in iOS apps to give an iOS 7 frosted-glass effect
     * to any element.
     */
    angular.module('ionic.contrib.drawer', ['ionic'])

        .controller('drawerCtrl', [
            '$element',
            '$attrs',
            '$ionicGesture',
            '$ionicSideMenuDelegate',
            '$document',
            '$timeout',
            '$ionicPlatform',
            function ($element,
                      $attr,
                      $ionicGesture,
                      $ionicSideMenuDelegate,
                      $document,
                      $timeout,
                      $ionicPlatform) {
                var el = $element[0];
                var dragging = false;
                var startX, lastX, offsetX, newX;

                // How far to drag before triggering
                var thresholdX = 7;

                var SIDE_LEFT = 'left';
                var SIDE_RIGHT = 'right';
                var STATE_CLOSE = 'close';
                var STATE_OPEN = 'open';

                var isTargetDrag = false;

                var side = $attr.side === SIDE_LEFT ? SIDE_LEFT : SIDE_RIGHT;
                var width = el.clientWidth;
                var docWidth = $document[0].body.clientWidth;

                // Handle back button
                var unregisterBackAction;

                // Current State of Drawer
                var drawerState = STATE_CLOSE;

                // Drawer overlay
                var $overlay = angular.element('<div class="drawer-overlay" />');
                var overlayEl = $overlay[0];
                var overlayState = STATE_CLOSE;

                $element.parent().prepend(overlayEl);

                var toggleOverlay = function (state) {
                    if (overlayState !== state) {
                        var timeToRemove = state === STATE_CLOSE ? 400 : 0;

                        if (state === STATE_OPEN) {
                            $element
                                .removeClass('closed')
                                .addClass('opened');
                        }

                        $timeout(function () {
                            ionic.requestAnimationFrame(function () {
                                var translateX = state === STATE_CLOSE ? '-100' : '0';
                                overlayEl.style[ionic.CSS.TRANSFORM] = 'translate3d(' + translateX + '%, 0, 0)';
                                if (state === STATE_CLOSE) {
                                    $element
                                        .removeClass('opened')
                                        .addClass('closed');
                                }
                            });
                        }, timeToRemove);
                        overlayState = state;
                    }
                };

                var enableAnimation = function () {
                    $element.addClass('animate');
                    $overlay.addClass('animate');
                };

                var disableAnimation = function () {
                    $element.removeClass('animate');
                    $overlay.removeClass('animate');
                };

                var isOpen = function () {
                    return drawerState === STATE_OPEN;
                };

                var startDrag = function (e) {
                    if (!$ionicSideMenuDelegate.canDragContent()) {
                        return;
                    }

                    disableAnimation();
                    toggleOverlay(STATE_OPEN);

                    dragging = true;
                    offsetX = lastX - startX;
                };

                var doEndDrag = function (e) {
                    if (!$ionicSideMenuDelegate.canDragContent()) {
                        return;
                    }

                    startX = lastX = offsetX = null;
                    isTargetDrag = false;

                    if (!dragging) {
                        return;
                    }

                    dragging = false;

                    enableAnimation();

                    var translateX = 0;
                    var opacity = 0;

                    if (side === SIDE_RIGHT) {
                        if (newX > width / 2) {
                            translateX = width;
                            drawerState = STATE_CLOSE;
                        } else {
                            opacity = 1;
                            drawerState = STATE_OPEN;
                        }
                    } else if (side === SIDE_LEFT) {
                        if (newX < (-width / 2)) {
                            translateX = -width;
                            drawerState = STATE_CLOSE;
                        } else {
                            opacity = 1;
                            drawerState = STATE_OPEN;
                        }
                    }

                    toggleOverlay(drawerState);
                    ionic.requestAnimationFrame(function () {
                        overlayEl.style.opacity = opacity;
                        el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + translateX + 'px, 0, 0)';
                        $element
                            .removeClass('opened closed')
                            .addClass(drawerState === STATE_OPEN ? 'opened' : 'closed');
                    });
                };

                var doDrag = function (e) {
                    if (e.defaultPrevented || !$ionicSideMenuDelegate.canDragContent()) {
                        return;
                    }

                    var finger = e.gesture.touches[0];
                    var dir = e.gesture.direction;

                    if (!lastX) {
                        startX = finger.pageX;
                    }

                    lastX = finger.pageX;

                    if (dir === 'down' || dir === 'up') {
                        return;
                    }

                    if (!dragging) {
                        //here at just the beginning of drag
                        // Dragged 15 pixels and finger is by edge
                        if (Math.abs(lastX - startX) > thresholdX) {
                            if (side === SIDE_LEFT) {
                                if (isOpen()) {
                                    if (dir === SIDE_RIGHT) {
                                        return;
                                    }
                                } else {
                                    if (dir === SIDE_LEFT) {
                                        return;
                                    }
                                }
                            } else if (side === SIDE_RIGHT) {
                                if (isOpen()) {
                                    if (dir === SIDE_LEFT) {
                                        return;
                                    }
                                } else {
                                    if (dir === SIDE_RIGHT) {
                                        return;
                                    }
                                }
                            }

                            startDrag(e);
                        }
                    } else {
                        //here when we are dragging
                        e.gesture.srcEvent.stopImmediatePropagation();

                        // if fast gesture
                        if (e.gesture.deltaTime < 200) {
                            if (side === SIDE_LEFT) {
                                if (isOpen()) {
                                    if (dir === SIDE_LEFT) {
                                        return newX = -width;
                                    }
                                } else {
                                    if (dir === SIDE_RIGHT) {
                                        return newX = 0;
                                    }
                                }
                            } else if (side === SIDE_RIGHT) {
                                if (isOpen()) {
                                    if (dir === SIDE_RIGHT) {
                                        return newX = width;
                                    }
                                } else {
                                    if (dir === SIDE_LEFT) {
                                        return newX = 0;
                                    }
                                }
                            }
                        }

                        var opacity;
                        if (side === SIDE_LEFT) {
                            newX = Math.min(0, (-width + (lastX - offsetX)));
                            opacity = 1 + parseFloat(newX / width).toFixed(2);
                        } else if (side === SIDE_RIGHT) {
                            newX = Math.max(0, (width - (docWidth - lastX + offsetX)));
                            opacity = 1 - parseFloat(newX / width).toFixed(2);
                        }


                        if (opacity < 0) {
                            opacity = 0;
                            return;
                        }

                        ionic.requestAnimationFrame(function () {
                            overlayEl.style.opacity = opacity;
                            el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
                            $element
                                .removeClass('closed')
                                .addClass('opened');
                        });
                    }

                    if (dragging) {
                        e.gesture.srcEvent.preventDefault();
                    }
                };

                var hardwareBackCallback = function () {
                    this.close();
                }.bind(this);

                this.close = function () {
                    drawerState = STATE_CLOSE;
                    enableAnimation();
                    toggleOverlay(STATE_CLOSE);

                    ionic.requestAnimationFrame(function () {
                        overlayEl.style.opacity = 0;
                        el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + (side === SIDE_LEFT ? '-' : '') + '100%, 0, 0)';
                    });

                    if (unregisterBackAction) {
                        unregisterBackAction();
                    }
                };

                this.open = function () {
                    drawerState = STATE_OPEN;
                    enableAnimation();
                    toggleOverlay(STATE_OPEN);

                    ionic.requestAnimationFrame(function () {
                        overlayEl.style.opacity = 1;
                        el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
                    });

                    unregisterBackAction = $ionicPlatform.registerBackButtonAction(hardwareBackCallback, 100);
                };

                this.isOpen = isOpen;

                $ionicGesture.on('drag', doDrag, $document);
                $ionicGesture.on('dragend', doEndDrag, $document);
                $overlay.on('click', this.close);
            }
        ])

        .directive('drawer', ['$rootScope', '$ionicGesture', function ($rootScope, $ionicGesture) {
            return {
                restrict: 'E',
                controller: 'drawerCtrl',
                link: function ($scope, $element, $attr, ctrl) {
                    $element.addClass($attr.side + ' closed');

                    $scope.openDrawer = function () {
                        ctrl.open();
                    };

                    $scope.closeDrawer = function () {
                        ctrl.close();
                    };

                    $scope.toggleDrawer = function () {
                        if (ctrl.isOpen()) {
                            ctrl.close();
                        } else {
                            ctrl.open();
                        }
                    };
                }
            }
        }])
        .directive('drawerClose', ['$ionicHistory', '$timeout', function ($ionicHistory, $timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element, $attr, ctrl) {
                    $element.bind('click', function () {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });

                        if (($attr.goNative !== undefined) && window.plugins && window.plugins.nativepagetransitions) {
                            $timeout(function () {
                                $scope.closeDrawer();
                                console.log('waited');
                            }, window.plugins.nativepagetransitions.globalOptions.duration);
                        } else {
                            $scope.closeDrawer();
                        }
                    });
                }
            }
        }])

        .directive('drawerToggle', [function () {
            return {
                restrict: 'A',
                link: function ($scope, $element, $attr, ctrl) {
                    $element.bind('click', function () {
                        $scope.toggleDrawer();
                    });
                }
            }
        }]);

})();
