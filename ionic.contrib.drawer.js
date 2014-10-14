(function() {

'use strict';

/**
 * The ionic-contrib-frosted-glass is a fun frosted-glass effect
 * that can be used in iOS apps to give an iOS 7 frosted-glass effect
 * to any element.
 */
angular.module('ionic.contrib.drawer', ['ionic'])

.controller('drawerCtrl', ['$element', '$attrs', '$ionicGesture', '$document', function($element, $attr, $ionicGesture, $document) {
  var el = $element[0];
  var dragging = false;
  var startX, lastX, offsetX, newX;
  var side;

  // How far to drag before triggering
  var thresholdX = 15;
  // How far from edge before triggering
  var edgeX = 25;

  var LEFT = 0;
  var RIGHT = 1;

  var width = $element[0].clientWidth;

  var enableAnimation = function() {
    $element.addClass('animate');
  };
  var disableAnimation = function() {
    $element.removeClass('animate');
  };

  var startDrag = function(e) {
    disableAnimation();

    dragging = true;
    offsetX = lastX - el.offsetLeft;
    console.log('Starting drag');
    console.log('Offset:', offsetX);
  };

  var doEndDrag = function(e) {
    if(!dragging) {
      return;
    }

    dragging = false;

    console.log('End drag');
    enableAnimation();

    ionic.requestAnimationFrame(function() {
      if(newX < (-width / 2)) {
        el.style.transform = el.style.webkitTransform = 'translate3d(' + -width + 'px, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
      }
    });
  };

  var doDrag = function(e) {
    ionic.requestAnimationFrame(function() {
      if(e.defaultPrevented) {
        return;
      }

      if(!lastX) {
        startX = e.gesture.touches[0].pageX;
      }

      lastX = e.gesture.touches[0].pageX;

      console.log(startX, window.innerWidth - edgeX);

      if(!dragging) {

        // Dragged 15 pixels and finger is by edge
        if(Math.abs(lastX - startX) > thresholdX) {
          console.log(side, startX, edgeX);
          if(startX < edgeX) {
            console.log(lastX, startX);

            startDrag(e, el);
          } 
        }
      } else {
        newX = Math.min(0, (-width + (lastX - offsetX)));
        el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
        e.preventDefault();
      }
    });
  };

  side = $attr.side == 'left' ? LEFT : RIGHT;
  console.log(side);

  $ionicGesture.on('drag', function(e) {
    doDrag(e);
  }, $document);
  $ionicGesture.on('dragend', function(e) {
    doEndDrag(e);
  }, $document);


  this.close = function() {
    if(side === LEFT) {
      el.style.transform = el.style.webkitTransform = 'translate3d(-100%, 0, 0)';
    } else {
      el.style.transform = el.style.webkitTransform = 'translate3d(100%, 0, 0)';
    }
  };
  this.open = function() {
    if(side === LEFT) {
      el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
    } else {
      el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
    }
  };
}])

.directive('drawer', ['$rootScope', '$ionicGesture', function($rootScope, $ionicGesture) {
  return {
    restrict: 'E',
    controller: 'drawerCtrl',
    scope: {
    },
    link: function($scope, $element, $attr, ctrl) {
      $element.addClass($attr.side);
      $scope.open = function() {
        ctrl.open();
      };
      $scope.close = function() {
        ctrl.close();
      };
    }
  }
}]);

})();
