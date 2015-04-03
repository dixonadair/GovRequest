$(function(){
	var user_current_lat = $("#user_current_lat"),
		  user_current_lng = $("#user_current_lng"),
		  create_report = $("#create_a_report"),
		  formData = '';

	L.mapbox.accessToken = 'pk.eyJ1IjoieXVtaWtvIiwiYSI6IkRDVk43ZjAifQ.aAdCw3xUw8s1QLZzcBUhbA';


	var getUserGeoinfo = function(lat, lng){
		  user_current_lat.val(lat);
		  user_current_lng.val(lng);
		  formData = create_report.serialize();
			$.ajax({
				url: '/reports/create',
				type: 'POST',
		    dataType: 'JSON',
		    data: formData
			}).done(function(response){
				$('.welcome_section').append('<div class="text-danger">Thank you for sending us a report!</div>');
			}).fail(function(error){
				console.log('fail');
			});
	}

	$('#reportSubmit').on('click', function(event){
		event.preventDefault();
		var report_address = $("#report_address").val();   
		formData = create_report.serialize();

		if (report_address !== ''){
			var geocoder = L.mapbox.geocoder('mapbox.places');
			geocoder.query(report_address, showMap);
			function showMap(err, data) {
		    console.log(data.latlng[0], data.latlng[1]);
		    getUserGeoinfo(data.latlng[1], data.latlng[0]);
		  }
		}else{
			$.ajax({
				url: '/reports/create',
				type: 'POST',
		    dataType: 'JSON',
		    data: formData
			}).done(function(response){
				$('.welcome_section').append('<div class="text-danger">Thank you for sending us a report!</div>');
			}).fail(function(error){
				console.log('fail');
			});
		}
	});
	
});