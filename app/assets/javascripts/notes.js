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
  this.mapOptions = {
      zoom: 19,
      disableDefaultUI: true
    };
  this.currentUserPos = "";
}

Model.prototype = {

};

function Controller(model, view) {
  this.model = model;
  this.view = view;
}

Controller.prototype = {
  initializeMap: function() {
    this.model.map = this.view.createMap(this.model.mapOptions);
    if ( navigator.geolocation ) {
      var centerMap = this.getUserPos.bind( this );
      centerMap();
    } else {
      alert( "geolocation not supported" );
    }
  },
  getUserPos: function() {
    navigator.geolocation.getCurrentPosition( function( position ) {
      var pos = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
      this.model.map.setCenter( pos );
      this.view.addMarker( pos, this.model.map );
      this.model.currentUserPos = { "latitude" : position.coords.latitude, "longitude" : position.coords.longitude };
    }.bind( this ), function() {
      console.log( "geolocation fail" );
    },
    { maximumAge:5000, timeout:5000, enableHighAccuracy: true }
    );
  },
  bindListeners: function() {
    $("#note_submit").on("click", function() {
      document.cookie = "latitude="+this.model.currentUserPos.latitude;
      document.cookie = "longitude="+this.model.currentUserPos.longitude;
    }.bind(this));
  }
};

$( document ).ready( function() {
  var model = new Model();
  var view = new View();
  var controller = new Controller( model, view );
  controller.initializeMap();
  controller.bindListeners();
});
