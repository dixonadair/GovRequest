
get '/department/login' do
	erb :'/department/login'
end

post '/department/login' do
  department = Department.find_by(dept_name: params[:dept_name])
  redirect '/department/login' unless department
  if department.authenticate(params[:password])
    session[:deparment_id] = department.id
    redirect '/department'
  else
    erb :'/department/login'
  end
end

get '/department/logout' do
  session[:deparment_id] = nil
  redirect '/'
end

get '/department/register' do
	erb :'/department/register'
end

post '/department/register' do
  department = Department.new(dept_name: params[:dept_name], password: params[:password])
  if user.save
    session[:department_id] = department.id
    redirect '/'
  else
    erb :index
  end
end