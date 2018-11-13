from requests_oauthlib import OAuth2Session
import os

client_id = '528d45b16af255f773b8'
client_secret = '074e5b62b1accf16083b6bf58d2af459113f24b7'

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"
# OAuth endpoints given in the GitHub API documentation
authorization_base_url = 'https://github.com/login/oauth/authorize'
token_url = 'https://github.com/login/oauth/access_token'

github = OAuth2Session(client_id)

# Redirect user to GitHub for authorization
authorization_url, state = github.authorization_url(authorization_base_url)
print('Please go here and authorize,', authorization_url)

# Get the authorization verifier code from the callback url
redirect_response = input('Paste the full redirect URL here:').strip()

# Fetch the access token
github.fetch_token(token_url, client_secret=client_secret, authorization_response=redirect_response)


# Fetch a protected resource, i.e. user profile
r = github.get('https://api.github.com/user')
print(r.content)

# The question is how should we handle the data, and how it's work about the password? Another thing is how should we do
# if the login is already in use? Maybe the solution is to attribute to the new user a new user name, and allows him to
# connect only via github, or give him a new password as weel for the normal connection?

# Second issue: is this work should be done in the backend or the frontend??
