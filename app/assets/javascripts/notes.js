function View() {
  this.mapDiv = 'map-canvas';
}

View.prototype = {
  createMap: function(mapOptions) {
    return new google.maps.Map(document.getElementById(this.mapDiv),mapOptions);
  },
  addMarker: function( pos, map ) {
    new google.maps.Marker({
      position: pos,
      map: map
    });
  }
};

function Model() {
  this.map = "";
}

Model.prototype = {
  getMapOptions: function() {
    return {
      zoom: 19,
      disableDefaultUI: true
    };
  }
};

function Controller(model, view) {
  this.model = model;
  this.view = view;
}

Controller.prototype = {
  initialize: function() {
    var mapOptions = this.model.getMapOptions();
    this.model.map = this.view.createMap(mapOptions);

    if (navigator.geolocation) {
      var pos = this.getUserPos.bind(this);
      pos();
    } else {
      alert( "geolocation not supported" );
    }

  },
  getUserPos: function() {
    navigator.geolocation.getCurrentPosition( function( position ) {
      var pos = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
      this.model.map.setCenter( pos );
      this.view.addMarker( pos, this.model.map );
    }.bind(this), function() {
      console.log( "geolocation fail" );
    },
    { maximumAge:5000, timeout:5000, enableHighAccuracy: true }
    );
  }
};

$( document ).ready( function() {
  var model = new Model();
  var view = new View();
  var controller = new Controller( model, view );
  controller.initialize();
});
