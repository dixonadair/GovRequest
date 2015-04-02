post '/' do
	redirect :index
end

post '/report/create' do
	new_report = Report.new(params[:report])
	new_report.user_id = session[:user_id]
	new_report.save
	if request.xhr?
		content_type :json
		{data: params}.to_json
	else
		redirect '/'
	end
end

