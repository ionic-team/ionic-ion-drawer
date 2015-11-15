ionic-contrib-drawer
====================

A side menu drawer for Ionic apps

#####Setting up:

Clone the ionic-ion-drawer repo into the lib folder in your ionic project so it looks like:

*yourProjectName/www/lib/ionic-ion-drawer*

Add the ionic-contrib-drawer.js and ionic-contrib-drawer.css files to your index file

    <link href="lib/ionic-ion-drawer/ionic.contrib.drawer.css" rel="stylesheet">
    <script src="lib/ionic-ion-drawer/ionic.contrib.drawer.js"></script>
    
Add ionic.contrib.drawer to your Angular app:

    angular.module('App', [
      'ionic',
      'ionic.contrib.drawer'
    ])

#####Usage:

 Add the `<drawer>` directive to your ionic templates or index.html files.

#####Example:

    <ion-view>
      <ion-content>
        <div class="bar bar-header bar-dark">
          <h1 class="title">Example</h1>
        </div>
      </ion-content>
      <drawer side="right">
        <ion-content>
          <h2>Menu</h2>
          <button ng-click="closeDrawer()">Close</button>
          <ion-list>
            <ion-item>Friends</ion-item>
            <ion-item>Favorites</ion-item>
            <ion-item>Search</ion-item>
          </ion-list>
        </ion-content>
      </drawer>
    </ion-view>



Change the 'side' attribute of the `<drawer>` to either "right" or "left" to switch the side the drawer opens from.

#####Credits:

driftyco: https://github.com/driftyco (original build)

vitalyrotari: https://github.com/vitalyrotari (bug fixes, improved performance, background fading 
transition)

brybott: https://github.com/brybott (right side functionality)
