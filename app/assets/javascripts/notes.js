function View() {
  this.mapDiv = "map-canvas";
}

View.prototype = {
  createMap: function( mapOptions ) {
    return new google.maps.Map( document.getElementById( this.mapDiv ), mapOptions );
  },
  addMarker: function( pos, map ) {
    var marker = new google.maps.Marker({
      position: pos,
      map: map
    });
  },
  displayNotes: function( notes, map ) {
    for ( var note in notes ) {
      var pos = new google.maps.LatLng( notes[note].latitude, notes[note].longitude );
      this.addMarker( pos, map );
    }
  },
  displayNoteCircle: function( pos, map ) {
    new google.maps.Circle({
      center: pos,
      radius: 15,
      fillColor: "#ff69b4",
      fillOpacity: 0.5,
      strokeOpacity: 0.0,
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
  saveUserPosition: function( position ) {
    this.currentUserPos = { "latitude" : position.coords.latitude, "longitude" : position.coords.longitude };
  }
};

function Controller( model, view ) {
  this.model = model;
  this.view = view;
}

Controller.prototype = {
  initializeMap: function() {
    this.model.map = this.view.createMap( this.model.mapOptions );
    if ( navigator.geolocation ) {
      var centerMap = this.setUserPos.bind( this );
      centerMap();
    } else {
      alert( "geolocation not supported" );
    }
  },
  setUserPos: function() {
    navigator.geolocation.getCurrentPosition( function( position ) {
        var pos = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
        this.model.map.setCenter( pos );
        this.view.addMarker( pos, this.model.map );
        this.model.saveUserPosition(position);
        this.getNotes();
        this.view.displayNoteCircle( pos, this.model.map );
    }.bind( this ), function() {
      console.log( "geolocation fail" );
    },
      { enableHighAccuracy: true }
    );
  },
  bindListeners: function() {
    $("#note_submit").on("click", function() {
      document.cookie = "latitude="+this.model.currentUserPos.latitude;
      document.cookie = "longitude="+this.model.currentUserPos.longitude;
    }.bind(this));
  },
  getNotes: function() {
    controller = this;
    $.ajax({
      url: "/notes",
      type: "GET",
      dataType: "json"
    }).done( function( notes ) {
      controller.view.displayNotes( notes, controller.model.map );
    }).fail( function() {
      console.log( "notes ajax fail" );
    });
  }
};

$( document ).ready( function() {
  var model = new Model();
  var view = new View();
  var controller = new Controller( model, view );
  controller.initializeMap();
  controller.bindListeners();
});
