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
redirect_response = input('Paste the full redirect URL here:').strip()

# Fetch the access token
github.fetch_token(token_url, client_secret=client_secret,
authorization_response=redirect_response)


# Fetch a protected resource, i.e. user profile
r = github.get('https://api.github.com/user')
print(r.content)

# The content printed is as the next:
# b'{"login":"SamuelBismuth","id":33607401,"node_id":"MDQ6VXNlcjMzNjA3NDAx",
# "avatar_url":"https://avatars0.githubusercontent.com/u/33607401?v=4","
# gravatar_id":"","url":"https://api.github.com/users/SamuelBismuth",
# "html_url":"https://github.com/SamuelBismuth","followers_url":"https://api.github.com/users/SamuelBismuth/followers",
# "following_url":"https://api.github.com/users/SamuelBismuth/following{/other_user}",
# "gists_url":"https://api.github.com/users/SamuelBismuth/gists{/gist_id}",
# "starred_url":"https://api.github.com/users/SamuelBismuth/starred{/owner}{/repo}",
# "subscriptions_url":"https://api.github.com/users/SamuelBismuth/subscriptions",
# "organizations_url":"https://api.github.com/users/SamuelBismuth/orgs",
# "repos_url":"https://api.github.com/users/SamuelBismuth/repos","events_url":"https://api.github.com/users/SamuelBismuth/events{/privacy}","
# received_events_url":"https://api.github.com/users/SamuelBismuth/received_events","type":"User","site_admin":false,
# "name":"Samuel Bismuth","company":null,"blog":"","location":"Israel","email":null,"hireable":null,"bio":null,"public_repos":17,
# "public_gists":0,"followers":4,"following":7,"created_at":"2017-11-12T20:51:22Z","updated_at":"2018-10-18T15:57:59Z"}'

# The question is how should we handle the data, and how it's work about the password? Another thing is how should we do
# if the login is already in use? Maybe the solution is to attribute to the new user a new user name, and allows him to
# connect only via github, or give him a new password as weel for the normal connection?

# Second issue: is this work should be done in the backend or the frontend??