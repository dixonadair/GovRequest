// $(function(){
// 	$('.leaflet-popup-content-wrapper').on('click', '.pop_up_report_name', function(e){
// 				debugger;
// 		e.preventDefault();
// 		$target = event.target;

// 		$.ajax({
// 			url: $target.attr('href'),
// 			type: 'GET'
// 		}).done(function(response){
// 			$('.report_form').html('');
// 			$('.report_form').append('.detailBox');
// 			$('.detailBox').css('display','block');
// 		}).fail(function(error){
// 			console.log('unable to append comment box');
// 		})
// 	});
// });