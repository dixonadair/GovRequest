# ------ MAIN PAGE ------

get '/' do
	if session[:user_id]
		id = User.find(session[:user_id])
		@username = User.find(id).name
	  erb :index
	else
	  redirect '/user/welcome'
	end
end

# ------ Welcome, Login, Logout, Register ------

get '/welcome' do
	erb :'/user/welcome'
end

get '/login' do
	erb :'/user/login'
end

post '/login' do
  user = User.find_by(username: params[:username])
  redirect '/login' unless user
  if user.authenticate(params[:password])
    session[:user_id] = user.id
    redirect '/'
  else
    erb :'/user/login'
  end
end

get '/logout' do
  session[:user_id] = nil
  redirect '/user/welcome'
end

get '/register' do
	erb :'/user/register'
end

post '/register' do
  user = User.new(name: params[:name], username: params[:username], password: params[:password])
  if user.save
    session[:user_id] = user.id
    redirect '/'
  else
    erb :'/user/register'
  end
end