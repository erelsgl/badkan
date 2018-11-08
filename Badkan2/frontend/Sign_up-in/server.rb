require 'sinatra'
require 'rest-client'
require 'json'

CLIENT_ID = ENV['528d45b16af255f773b8']
CLIENT_SECRET = ENV['074e5b62b1accf16083b6bf58d2af459113f24b7']

get '/' do
  erb :index, :locals => {:client_id => CLIENT_ID}
end

