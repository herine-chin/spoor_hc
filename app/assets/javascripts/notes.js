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
  displayNoteMarkers: function( notes, map ) {
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
  },
  displayLocalNotes: function( notes, user ) {
    for ( var note in notes ) {
      var noteTemplate = "<div class='notes_nearby'> <p>"+notes[note].note_message+"</p>" + "<div class='note_info'> Posted by: " + user.first_name + " at " + notes[note].created_at + "</div></div>"; // use template tool
      $("#notes").append( noteTemplate );
    }
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
    var userPos = { latitude: this.model.currentUserPos.latitude, longitude: this.model.currentUserPos.longitude };
    $.ajax({
      url: "/notes",
      type: "GET",
      data: userPos,
      dataType: "json"
    }).done( function( notes ) {
      controller.view.displayNoteMarkers( notes.noteMarkers, controller.model.map );
      controller.view.displayLocalNotes( notes.localNotes, notes.user );
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
