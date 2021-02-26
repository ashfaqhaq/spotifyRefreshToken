
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
require('dotenv').config({path: __dirname + '/.env'});
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var app = express();
const fs = require('fs');
app.use(cors());
const port = process.env.PORT || 8888;
var counter=0;
app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    // var refresh_token=BQD3kP37pT50FH7Wc3f32eqeXWA7EI5xbH7D-ip2Vb8kn71l3OYj9Xk3KEf84lT2m1MLMwqDEvWhkwaEHjuVsYIIZVFTS4IMt6YC2WiculcE4_OPoWpUFDg-ko4xFisF17doWtwplTfbTrYaUXspu4gWttOY0wD_y-i2xwSh;
    console.log(`request : #${++counter}`)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: "client_credentials"
        // refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
        fs.readFile('./search.json', 'utf-8', function(err, data) {
          if (err) (console.log(err))
        
          var arrayOfObjects = JSON.parse(data) || {}
          arrayOfObjects.search.push({
            refreshTokenCounter: counter ,
            date: new Date()
          })
        
        
        
          fs.writeFile('./search.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
            if (err) (console.log(err))
            // console.log('Done!')
          })
        })

        
      }
      else{
          console.log(response)
      }
    });
    
  });

  console.log('Listening on 8888');
  app.listen(port, () =>
  //a callback that will be called as soon as server start listening
  console.log(`server is listening at http://localhost:${port}`)

)