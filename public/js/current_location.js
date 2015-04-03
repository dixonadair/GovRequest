$(function() {
	var popupDescription = "";
	// Declare mapbox access token and set up map
	L.mapbox.accessToken = 'pk.eyJ1IjoieXVtaWtvIiwiYSI6IkRDVk43ZjAifQ.aAdCw3xUw8s1QLZzcBUhbA';
	
	var geolocate = $('#geolocate'),
	    current_location_map = L.mapbox.map('current_location_map', 'yumiko.lkbilml1'),
	    myLayer = L.mapbox.featureLayer().addTo(current_location_map);

	    current_location_map.setView([37.734585, -122.447214], 12);

	// marker generating function
	var markerGenerator = function(lat, lng, report_issue, report_id, issue, status) {
		var marker;
		popupDescription = "<div class='pop_up_report_name'><a href='http://localhost:9393/reports/"+report_id+"'>" + report_issue + "</a></div><div class='popup_report_type'>" + issue +"</div><div class='popup_status text-success'>"+status+"</div>";
		if(status === 'pending'){
			marker = L.mapbox.featureLayer({
			    type: 'Feature',
			    geometry: {
			        type: 'Point',
			        coordinates: [parseFloat(lat), parseFloat(lng)]
			    },
			    properties: {
			        title: popupDescription,
			        'marker-color': '#ff8888'
			    }
			});
		}else if (status === 'in process'){
			marker = L.mapbox.featureLayer({
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
		}else{
			marker = L.mapbox.featureLayer({
			    type: 'Feature',
			    geometry: {
			        type: 'Point',
			        coordinates: [parseFloat(lat), parseFloat(lng)]
			    },
			    properties: {
			        title: popupDescription,
			        'marker-color': '#00CC99'
			    }
			});
		}

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
			markerGenerator(reportsData[i].lat, reportsData[i].lng, reportsData[i].report_name,reportsData[i].id, reportsData[i].report_type, reportsData[i].status);
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
	            'marker-color': '#0099FF',
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
	var user_current_lat = $("#user_current_lat"),
		  user_current_lng = $("#user_current_lng"),
		  create_report = $("#create_a_report"),
		  formData = '';

	// Declare the mapbox access token
	
	var getUserGeoinfo = function(lat, lng) {
		// set user current lat + lng based on retrieved user geolocation info
		user_current_lat.val(lat);
		user_current_lng.val(lng);
		// the lat + lng info is now in the formData, so serialize the formData now
		formData = create_report.serialize();

  		var ajaxRequest = $.ajax({
				url: '/reports/create',
				type: 'POST',
		    	dataType: 'JSON',
		    	data: formData
		});
		ajaxRequest.done(function(response) {
			$('.welcome_section').append('<div class="text-danger">Thank you for sending us a report!</div>');
			// form clear after submission
			$('form').find("input[type=text], textarea").val("");
			debugger;
			markerGenerator(response.data.lat, response.data.lng, response.data.report_name, response.data.id, response.data.report_type, response.data.status);
			$('#geolocate.ui-button').fadeOut('slow');
		});
		ajaxRequest.fail(function(error) {
			console.log('fail');
		});
	};

	// When report is submitted:
	$('#reportSubmit').on('click', function(event) {
		event.preventDefault();
		// Capture address param...
		var report_address = $("#report_address").val();   
		formData = create_report.serialize();

		// ...and as long as it wasn't blank, do...
		if (report_address !== ''){
			var geocoder = L.mapbox.geocoder('mapbox.places');
			// geocoder.query() takes a queryString (an address in this case), and a callback function into which the result of running geocoder.query() will be put.
			geocoder.query(report_address, getJsonDataFromMapBox);
			// getJsonDataFromMapBox() takes an error (if any), and the JSON data from running geocoder.query(). That data has several things, including a latlng array ([lat, lng]), which we want.
			function getJsonDataFromMapBox(err, data) {
				// Execute getUserGeoinfo function/ajax request
			    getUserGeoinfo(data.latlng[1], data.latlng[0]);
		    }
		} else {
			$.ajax({
				url: '/reports/create',
				type: 'POST',
			    dataType: 'JSON',
			    data: formData
			}).done(function(response){
				$('.welcome_section').append('<div class="text-danger">Thank you for sending us a report!</div>');
				$('form').find("input[type=text], textarea").val("");
				debugger;
				markerGenerator(response.data.lat, response.data.lng, response.data.report_name, response.data.id, response.data.report_type, response.data.status);
				$('#geolocate.ui-button').fadeOut('slow');
			}).fail(function(error){
				console.log('fail');
			});
		}
	});
});