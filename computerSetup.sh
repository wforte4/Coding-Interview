mkdir ~/db && mkdir ~/db/coding-interview

brew tap mongodb/brew
brew install mongodb-community@7.0

cd api
touch .env
echo "
  JWT_SECRET = 'D9902EBF455ED6A1252525204306ABFD5732F4466'
  ADMINPASS = '8cZt02NS^5125252DN6eJ99u'
  EXPRESS_SECRET = 'asdf98asd92525253r98afsdfajkh23r'
  MAILCHIMP_API_KEY = ''
  MONGODB_URI = 'mongodb://localhost:27017/coding-interview'
" >> .env