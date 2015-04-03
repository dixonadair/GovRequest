$(function(){

	// Grab some variables:
	// (grab the lat + lng variables so they can be set later based on user geolocation info)
	var user_current_lat = $("#user_current_lat"),
		  user_current_lng = $("#user_current_lng"),
		  create_report = $("#create_a_report"),
		  formData = '';

	// Declare the mapbox access token
	L.mapbox.accessToken = 'pk.eyJ1IjoieXVtaWtvIiwiYSI6IkRDVk43ZjAifQ.aAdCw3xUw8s1QLZzcBUhbA';
	
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
				$('#geolocate.ui-button').fadeOut('slow');
			}).fail(function(error){
				console.log('fail');
			});
		}
	});
	
});