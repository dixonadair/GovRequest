(function () {
	google.load("maps", "2");
	google.setOnLoadCallback(function () {
		// Create map
		var current_user_map = new google.maps.Map2(document.getElementById("user_current_location_map")),
			markerText = "<h2>You are here</h2><p>Nice with geolocation, ain't it?</p>",
			markOutLocation = function (lat, long) {
				var latLong = new google.maps.LatLng(lat, long),
					marker = new google.maps.Marker(latLong);
				current_user_map.setCenter(latLong, 13);
				current_user_map.addOverlay(marker);
				marker.openInfoWindow(markerText);
				google.maps.Event.addListener(marker, "click", function () {
					marker.openInfoWindow(markerText);
				});
			};
			current_user_map.setUIToDefault();

		// Check for geolocation support	
		if (navigator.geolocation) {
			// Get current position
			navigator.geolocation.getCurrentPosition(function (position) {
					// Success!
					markOutLocation(position.coords.latitude, position.coords.longitude);
				}, 
				function () {
					// Gelocation fallback: Defaults to Stockholm, Sweden
					markerText = "<p>Please accept geolocation for me to be able to find you. <br>I've put you in Stockholm for now.</p>";
					markOutLocation(59.3325215, 18.0643818);
				}
			);
		}
		else {
			// No geolocation fallback: Defaults to Eeaster Island, Chile
			markerText = "<p>No location support. Try Easter Island for now. :-)</p>";
			markOutLocation(-27.121192, -109.366424);
		}
	});	
})();

