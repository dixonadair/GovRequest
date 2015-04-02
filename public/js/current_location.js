$(function(){
	L.mapbox.accessToken = 'pk.eyJ1IjoieXVtaWtvIiwiYSI6IkRDVk43ZjAifQ.aAdCw3xUw8s1QLZzcBUhbA';
	var geolocate = $('#geolocate'),
	    current_location_map = L.mapbox.map('current_location_map', 'yumiko.lkbilml1'),
	    myLayer = L.mapbox.featureLayer().addTo(current_location_map);
			current_location_map.setView([37.734585, -122.447214], 12);

	var markerGenerator = function(lat, lng, report_issue, report_id){
		var marker = L.mapbox.featureLayer({
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        coordinates: [parseFloat(lat), parseFloat(lng)]
	    },
	    properties: {
	        title: "<a href='http://localhost:9393/reports/"+report_id+"'>" + report_issue + "</a>",
	        'marker-color': '#f86767'
	    }
		}).addTo(current_location_map);
	}

	var iterateReports = function(reportsData) {
		for (var i = 0; i < 32; i++) {
			console.log(reportsData[i].lat + " " + reportsData[i].lng);
			markerGenerator(reportsData[i].lat, reportsData[i].lng, reportsData[i].report_name,reportsData[i].id);
	  }
	}

  var list_of_reports = function(){
	$.ajax({
			url: '/reports/show',
			type: 'GET',
		}).done(function(response){
			iterateReports(response.collection);
		}).fail(function(error){
			console.log('fail');
		});
	}

  list_of_reports();

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