(function () {

  'use strict';

  /**
   * The ionic-contrib-drawer is an Android like drawer widget
   * that can be used in Android apps (or in any other platforms if it is convenient)
   */
  angular.module('ionic.contrib.drawer', ['ionic'])

    .controller('drawerCtrl', ['$element', '$attrs', '$ionicGesture', '$document', function ($element, $attr, $ionicGesture, $document) {

      var el = $element[0];
      var dragging = false;
      var startX, lastX, offsetX, newX;
      var side;

      var swipeOpen = false;

      // How far to drag before triggering
      var thresholdX = 15;
      // How far from edge before triggering
      var edgeX = 40;

      var LEFT = 0;
      var RIGHT = 1;

      var isTargetDrag = false;

      var width = $element[0].clientWidth;

      var enableAnimation = function () {
        $element.addClass('animate');
      };
      var disableAnimation = function () {
        $element.removeClass('animate');
      };

      // Check if this is on target or not
      var isTarget = function (el) {
        while (el) {
          if (el === $element[0]) {
            return true;
          }
          el = el.parentNode;
        }
      };

      var startDrag = function (e) {
        disableAnimation();

        dragging = true;
        offsetX = lastX - startX;
        console.log('Starting drag');
        console.log('Offset:', offsetX);
      };

      var startTargetDrag = function (e) {
        disableAnimation();

        dragging = true;
        isTargetDrag = true;
        offsetX = lastX - startX;
        console.log('Starting target drag');
        console.log('Offset:', offsetX);
      };

      var doEndDrag = function (e) {
        startX = null;
        lastX = null;
        offsetX = null;
        isTargetDrag = false;

        if (!dragging) {
          return;
        }

        dragging = false;

        console.log('End drag');
        enableAnimation();


        ionic.requestAnimationFrame(function () {
          var dragWidth = side ? width : -width,
            closeThreshold = Math.floor(dragWidth / 1.4),
            closeCondition = side ? newX > closeThreshold : newX < closeThreshold;

          if (closeCondition) {
            el.style.transform = el.style.webkitTransform = 'translate3d(' + dragWidth + 'px, 0, 0)';
          } else {
            el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
          }
        });
      };

      var doDrag = function (e) {
        if (e.defaultPrevented) {
          return;
        }

        if (!lastX) {
          startX = e.gesture.touches[0].pageX;
        }

        lastX = e.gesture.touches[0].pageX;

        if (!dragging) {

          // Dragged 15 pixels and finger is by edge
          if (Math.abs(lastX - startX) > thresholdX) {
            if (side ? startX < lastX : startX > lastX) {
              if (isTarget(e.target)) {
                startTargetDrag(e);
              } else if (startX < edgeX && swipeOpen) {
                startDrag(e);
              }
            }
          }
        } else {

          var dragWidth = side ? 0 : -width,
            currentX = (dragWidth + (lastX - offsetX));

          newX = side ? Math.max(0, currentX) : Math.min(0, currentX);

          ionic.requestAnimationFrame(function () {
            el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
          });

        }

        if (dragging) {
          e.gesture.srcEvent.preventDefault();
        }
      };

      side = $attr.side == 'left' ? LEFT : RIGHT;
      console.log(side);


      $ionicGesture.on('drag', function (e) {
        doDrag(e);
      }, $document);
      $ionicGesture.on('dragend', function (e) {
        doEndDrag(e);
      }, $document);


      this.close = function () {
        enableAnimation();
        ionic.requestAnimationFrame(function () {
          if (side === LEFT) {
            el.style.transform = el.style.webkitTransform = 'translate3d(-100%, 0, 0)';
          } else {
            el.style.transform = el.style.webkitTransform = 'translate3d(100%, 0, 0)';
          }
        });
      };

      this.open = function () {
        enableAnimation();
        ionic.requestAnimationFrame(function () {
          if (side === LEFT) {
            el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
          } else {
            el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
          }
        });
      };
    }])

    .directive('drawer', ['$rootScope', '$ionicGesture', function ($rootScope, $ionicGesture) {
      return {
        restrict: 'E',
        controller: 'drawerCtrl',
        link: function ($scope, $element, $attr, ctrl) {
          $element.addClass($attr.side);
          $rootScope.openDrawer = function () {
            console.log('open');
            ctrl.open();
          };
          $rootScope.closeDrawer = function () {
            console.log('close');
            ctrl.close();
          };
        }
      }
    }])

    .directive('drawerClose', ['$rootScope', function ($rootScope) {
      return {
        restrict: 'A',
        link: function ($scope, $element) {
          $element.bind('click', function () {
            var drawerCtrl = $element.inheritedData('$drawerController');
            drawerCtrl.close();
          });
        }
      }
    }]);

})();
