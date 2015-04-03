

# --- Get/Post routes for making comments ---

# '/new_comment' and new_comment.erb could also be called '/view_report' and report.erb because clicking on this route takes you to an erb file that shows the full report details, including others' previous comments, as well as a form for you to add your own comment at the bottom

get '/reports/:report_id' do
	@report = Report.find(params[:report_id])
	@report_creator = User.find(@report.user_id)
	# if request.xhr?
	# 	content_type :json
	# 	{report: @report}.to_json
	# else
	# 	redirect '/'
	# end
	erb :new_comment
end

post '/reports/:report_id/new_comment' do
	id = params[:report_id]
	comment = Comment.new(content: params[:content])
	comment.user_id = session[:user_id]
	comment.report_id = params[:report_id]
	comment.save
	# redirect '/'
	redirect "/reports/#{id}"
end