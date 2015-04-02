$(function(){
	L.mapbox.accessToken = 'pk.eyJ1IjoieXVtaWtvIiwiYSI6IkRDVk43ZjAifQ.aAdCw3xUw8s1QLZzcBUhbA';
	var geolocate = $('#geolocate');
	var current_location_map = L.mapbox.map('current_location_map', 'yumiko.lkbilml1');
	var myLayer = L.mapbox.featureLayer().addTo(current_location_map);

	if (!navigator.geolocation) {
	    geolocate.html('Geolocation is not available');
	} else {
			geolocate.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				current_location_map.locate();
			});
	}

	current_location_map.on('locationfound', function(e) {
	    current_location_map.fitBounds(e.bounds);

	    var user_geo_data = myLayer.setGeoJSON({
	        type: 'Feature',
	        geometry: {
	            type: 'Point',
	            coordinates: [e.latlng.lng, e.latlng.lat]
	        },
	        properties: {
	            'title': 'Here I am!',
	            'marker-color': '#ff8888',
	            'marker-symbol': 'star'
	        }
	    });

	    $('#user_current_lat').val(user_geo_data._geojson.geometry.coordinates[0]);
	    $('#user_current_lng').val(user_geo_data._geojson.geometry.coordinates[1]);

	    geolocate.remove();
	});

	current_location_map.on('locationerror', function() {
	    geolocate.html('Position could not be found');
	});

});