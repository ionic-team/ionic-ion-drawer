(function() {

'use strict';

/**
 * The ionic-contrib-frosted-glass is a fun frosted-glass effect
 * that can be used in iOS apps to give an iOS 7 frosted-glass effect
 * to any element.
 */
angular.module('ionic.contrib.drawer', ['ionic'])

.controller('drawerCtrl', ['$element', '$attrs', '$ionicGesture', function($element, $attr, $ionicGesture) {
  var el = $element[0];
  var dragging = false;
  var startX, lastX, offsetX;
  var side;

  // How far to drag before triggering
  var thresholdX = 15;
  // How far from edge before triggering
  var edgeX = 25;

  var LEFT = 0;
  var RIGHT = 1;

  var startDrag = function(e) {
    dragging = true;
    offsetX = lastX - el.offsetLeft;
    console.log('Starting drag');
    console.log('Offset:', offsetX);
  };

  var doDrag = function(e) {
    if(!lastX) {
      startX = e.gesture.touches[0].pageX;
    }

    lastX = e.gesture.touches[0].pageX;

    if(!dragging) {

      console.log(lastX, startX);

      // Dragged 15 pixels and finger is by edge
      if(Math.abs(lastX - startX) > thresholdX) {
        console.log('Over threshold', side);
        if(side === LEFT && startX < edgeX) {
          startDrag(e, el);
        } else if(startX > (window.clientWidth - edgeX)) {
          startDrag(e, el);
        }
      }
    } else {
      el.style.transform = el.style.webkitTransform = 'translate3d(' + (lastX - offsetX) + 'px, 0, 0)';
      e.preventDefault();
    }
  };

  side = $attr.side == 'left' ? LEFT : RIGHT;
  console.log(side);

  $ionicGesture.on('drag', function(e) {
    doDrag(e, $element[0]);
  }, $element);
}])

.directive('drawer', ['$rootScope', '$ionicGesture', function($rootScope, $ionicGesture) {
  return {
    restrict: 'E',
    controller: 'drawerCtrl',
    link: function($scope, $element, $attr) {
      $element.addClass($attr.side);

    }
  }
}]);

})();
