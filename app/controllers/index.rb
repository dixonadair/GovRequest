post '/' do
	redirect :index
end

post '/reports/create' do
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

get '/reports/show' do
	@all_reports = Report.all
	if request.xhr?
		content_type :json
		{collection: @all_reports}.to_json
	else
		redirect '/'
	end
end

