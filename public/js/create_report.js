$(function(){

	$('#reportSubmit').on('click', function(event){
		event.preventDefault();
		var create_report = $("#create_a_report"),
			  formData = create_report.serialize();

		$.ajax({
			url: '/report/create',
			type: 'POST',
	    dataType: 'JSON',
	    data: formData
		}).done(function(response){
			$('.welcome_section').append('<div class="red">Thank you for sending us a report!</div>');
		}).fail(function(error){
			console.log('fail');
		});

	});
	
});