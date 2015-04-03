$(function() {
	var popupDescription = "";
	// Declare mapbox access token and set up map
	L.mapbox.accessToken = 'pk.eyJ1IjoieXVtaWtvIiwiYSI6IkRDVk43ZjAifQ.aAdCw3xUw8s1QLZzcBUhbA';
	
	var geolocate = $('#geolocate'),
	    current_location_map = L.mapbox.map('current_location_map', 'yumiko.lkbilml1'),
	    myLayer = L.mapbox.featureLayer().addTo(current_location_map);

	current_location_map.setView([37.734585, -122.447214], 12);

	// marker generating function
	var markerGenerator = function(lat, lng, report_issue, report_id, issue) {
		popupDescription = "<div class='pop_up_report_name'><a href='http://localhost:9393/reports/"+report_id+"'>" + report_issue + "</a></div><div class='popup_report_type'>" + issue +"</div>";
		var marker = L.mapbox.featureLayer({
		    type: 'Feature',
		    geometry: {
		        type: 'Point',
		        coordinates: [parseFloat(lat), parseFloat(lng)]
		    },
		    properties: {
		        title: popupDescription,
		        'marker-color': '#0099FF'
		    }
		});
		//debugger;
		marker.addTo(current_location_map);
	};

	// function which gets collection of reports via ajax call and executes iterateReports on it
  	var list_of_reports = function() {
		$.ajax({
			url: '/list_all_reports',
			type: 'GET',
		}).done(function(response) {
			iterateReports(response.collection, response.collection.length);
		}).fail(function(error) {
			console.log('fail');
		});
	};

	// iterate through list of reports and call markerGenerator function to generate markers for each
	var iterateReports = function(reportsData, number_of_data) {
		for (var i = 0; i < number_of_data; i++) {
			markerGenerator(reportsData[i].lat, reportsData[i].lng, reportsData[i].report_name,reportsData[i].id, reportsData[i].report_type);
	    }
	};

	// execute the list_of_reports function
  	list_of_reports();

	if (!navigator.geolocation) {
	    geolocate.html('Geolocation is not available');
	} else {
		geolocate.on('click',function(e) {
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

	// // ------------- Example marker --------------

	// var marker2 = L.mapbox.featureLayer({
	//     type: 'Feature',
	//     geometry: {
	//         type: 'Point',
	//         coordinates: [-122, 37]
	//     },
	//     properties: {
	//         title: "Hi",
	//         'marker-color': '#f86767'
	//     }
	// });
	// marker2.addTo(current_location_map);

	// // ----- Example markers in downtown SF area -----

	// var lng_generator = function() {
	// 	var new_lng = (Math.floor(Math.random() * 25514)/1000000 + 37.772194);
	// 	console.log(new_lng);
	// 	return new_lng;
	// };

	// var lat_generator = function() {
	// 	var new_lat = (-1)*(Math.floor(Math.random() * 31811)/1000000 + 122.402006);
	// 	console.log(new_lat);
	// 	return new_lat;
	// };

	// for (i=1; i<20; i++) {
	// 	L.mapbox.featureLayer({
	// 	    type: 'Feature',
	// 	    geometry: {
	// 	        type: 'Point',
	// 	        // coordinates: [i*10, i*10]
	// 	        coordinates: [lat_generator(), lng_generator()]
	// 	    },
	// 	    properties: {
	// 	        title: "Hi",
	// 	        'marker-color': '#f86767'
	// 	    }
	// 	}).addTo(current_location_map);
	// }

	// ---------------------------------------------

});