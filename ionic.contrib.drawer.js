(function() {

'use strict';

/**
 * The ionic-contrib-frosted-glass is a fun frosted-glass effect
 * that can be used in iOS apps to give an iOS 7 frosted-glass effect
 * to any element.
 */
angular.module('ionic.contrib.drawer', ['ionic'])

.controller('drawerCtrl', ['$element', '$attrs', '$ionicGesture', '$timeout', '$document', function($element, $attr, $ionicGesture, $timeout, $document) {

  var el = $element[0];
  var dragging = false;
  var startX, lastX, offsetX, newX;
  var side;

  // How far to drag before triggering
  var thresholdX = 15;
  // How far from edge before triggering
  var edgeX = 40;

  var LEFT = 0;
  var RIGHT = 1;

  var isTargetDrag = false;

  var width = 0;

  var clientWidth = document.body.clientWidth;

  $timeout(function(){
   width = $element[0].clientWidth;
  }, 10);

  var enableAnimation = function() {
    $element.addClass('animate');
  };
  var disableAnimation = function() {
    $element.removeClass('animate');
  };

  // Check if this is on target or not
  var isTarget = function(el) {
    while(el) {
      if(el === $element[0]) {
        return true;
      }
      el = el.parentNode;
    }
  };

  var startDrag = function(e) {
    disableAnimation();

    dragging = true;
    offsetX = lastX - startX;
    console.log('Starting drag');
    console.log('Offset:', offsetX);
  };

  var startTargetDrag = function(e) {
    disableAnimation();

    dragging = true;
    isTargetDrag = true;
    offsetX = lastX - startX;
    console.log('Starting target drag');
    console.log('Offset:', offsetX);
  };

  var doEndDrag = function(e) {
    startX = null;
    lastX = null;
    offsetX = null;
    isTargetDrag = false;

    if(!dragging) {
      return;
    }

    dragging = false;

    console.log('End drag');
    enableAnimation();

    ionic.requestAnimationFrame(function() {
      console.log(newX, (width / 2))
      if(newX > (width / 2)) {
        el.style.transform = el.style.webkitTransform = 'translate3d('+width+'px, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
      }
    });
  };

  var doDrag = function(e) {
    if(e.defaultPrevented) {
      return;
    }

    if(!lastX) {
      startX = e.gesture.touches[0].pageX;
    }

    lastX = e.gesture.touches[0].pageX;

    if(!dragging) {
      // Dragged 15 pixels and finger is by edge
      if(isTarget(e.target)) {
        startTargetDrag(e);
      } else if(Math.abs(lastX - startX) > thresholdX) {
        if (side == RIGHT) {
          if (startX > edgeX) {
            startDrag(e);
          }
        } else {
          if (startX < edgeX) {
            startDrag(e);
          }
        }
      }
    } else {
      console.log(lastX - offsetX)
      newX = Math.max(0, width- (clientWidth - (lastX - offsetX)));

      ionic.requestAnimationFrame(function() {
        console.log('drag', newX)
        el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
      });
    }

    if(dragging) {
      e.gesture.srcEvent.preventDefault();
    }
  };

  side = $attr.side == 'left' ? LEFT : RIGHT;

  if (side == RIGHT) {
    edgeX = clientWidth - edgeX
  }

  $ionicGesture.on('drag', function(e) {
    doDrag(e);
  }, $document);
  $ionicGesture.on('dragend', function(e) {
    doEndDrag(e);
  }, $document);


  this.close = function() {
    enableAnimation();
    ionic.requestAnimationFrame(function() {
      if(side === LEFT) {
        el.style.transform = el.style.webkitTransform = 'translate3d(-100%, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(100%, 0, 0)';
      }
    });
  };

  this.open = function() {
    enableAnimation();
    ionic.requestAnimationFrame(function() {
      if(side === LEFT) {
        el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
      }
    });
  };
}])

.directive('drawer', ['$rootScope', '$ionicGesture', function($rootScope, $ionicGesture) {
  return {
    restrict: 'E',
    controller: 'drawerCtrl',
    link: function($scope, $element, $attr, ctrl) {
      $element.addClass($attr.side);
      $scope.openDrawer = function() {
        console.log('open');
        ctrl.open();
      };
      $scope.closeDrawer = function() {
        console.log('close');
        ctrl.close();
      };
    }
  }
}]);

})();
