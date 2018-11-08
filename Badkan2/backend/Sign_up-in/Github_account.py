# https://stackoverflow.com/questions/50941758/authlib-client-error-state-not-equal-in-request-and-response

# Credentials you get from registering a new application
import os

client_id = '528d45b16af255f773b8'
client_secret = '074e5b62b1accf16083b6bf58d2af459113f24b7'

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"
# OAuth endpoints given in the GitHub API documentation
authorization_base_url = 'https://github.com/login/oauth/authorize'
token_url = 'https://github.com/login/oauth/access_token'

from requests_oauthlib import OAuth2Session
github = OAuth2Session(client_id)

# Redirect user to GitHub for authorization
authorization_url, state = github.authorization_url(authorization_base_url)
print('Please go here and authorize,', authorization_url)

# Get the authorization verifier code from the callback url
redirect_response = input('Paste the full redirect URL here:')

# Fetch the access token
github.fetch_token(token_url, client_secret=client_secret,
authorization_response=redirect_response)


# Fetch a protected resource, i.e. user profile
r = github.get('https://api.github.com/user')
print(r.content)