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

  // How far to drag before triggering
  var thresholdX = 15;
  // How far from edge before triggering
  var edgeX = 40;

  var SIDE_LEFT = 'left';
  var SIDE_RIGHT = 'right';
  var STATE_CLOSE = 'close';
  var STATE_OPEN = 'open';

  var isTargetDrag = false;

  var side = $attr.side === SIDE_LEFT ? SIDE_LEFT : SIDE_RIGHT;
  var width = el.clientWidth;
  
  // Current State of Drawer
  var drawerState = STATE_CLOSE;

  var enableAnimation = function() {
    $element.addClass('animate');
  };
  
  var disableAnimation = function() {
    $element.removeClass('animate');
  };

  // Check if this is on target or not
  var isTarget = function(targetEl) {
    while (targetEl) {
      if (targetEl === el]) {
        return true;
      }
      targetEl = targetEl.parentNode;
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

    if (!dragging) {
      return;
    }

    dragging = false;

    console.log('End drag');
    enableAnimation();

    ionic.requestAnimationFrame(function() {
      var translateX = 0;
      
      if (newX < (-width / 2)) {
        translateX = -width;
        drawerState = STATE_CLOSE;
      } else {
        drawerState = STATE_OPEN;
      }
      
      el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + translateX + 'px, 0, 0)';
    });
  };

  var doDrag = function(e) {
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
        if (isTarget(e.target)) {
          startTargetDrag(e);
        } else if(startX < edgeX) {
          startDrag(e);
        } 
      }
    } else {
      console.log(lastX, offsetX, lastX - offsetX);
      newX = Math.min(0, (-width + (lastX - offsetX)));
      ionic.requestAnimationFrame(function() {
        el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
      }); 
    }

    if (dragging) {
      e.gesture.srcEvent.preventDefault();
    }
  };

  $ionicGesture.on('drag', doDrag, $document);
  $ionicGesture.on('dragend', doEndDrag, $document);
  
  this.close = function() {
    enableAnimation();
    drawerState = STATE_CLOSE;
    ionic.requestAnimationFrame(function() {
      el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + (side === SIDE_LEFT ? '-' : '') + '100%, 0, 0)';
    });
  };

  this.open = function() {
    enableAnimation();
    drawerState = STATE_OPEN;
    ionic.requestAnimationFrame(function() {
      el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
    });
  };
  
  this.isOpen = function() {
    return (drawerState === STATE_OPEN);
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
      
      $scope.toggleDrawer = function() {
        if (ctrl.isOpen()) {
          ctrl.close();
        } else {
          ctrl.open();
        }
      };
    }
  }
}]);

.directive('drawerClose', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.bind('click', function() {
        var drawerCtrl = $element.inheritedData('$drawerController');
        drawerCtrl.close();
      });
    }
  }
}]);

})();
