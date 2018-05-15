## Twilio integration documentation


[Twilio](https://www.twilio.com/)

Setup an account on Twilio to receive/create:</br>
   SMS-enabled Twilio phone number<br>
   <ul >
   <li>ACCOUNT SID</li>
   <li>AUTH TOKEN<br></li>
   <li>Friendly Name</li>
   <li>API Key SID<br></li>
   <li>API Key Secret</li>

Setup development environment to send and receive messages</br>
 Install the Twilio node helper library</br></br>
   `npm install twilio`  

 Require twilio in code</br></br>
  `const twilio = require('twilio');`

Test your install<br><br>
 example code
 
  ```var accountSid = 'ACa11a6a4751c701a38d24ec97aa801c83'; // Your Account SID from www.twilio.com/console
  var authToken = 'your_auth_token';   // Your Auth Token from www.twilio.com/console

  var twilio = require('twilio');
  var client = new twilio(accountSid, authToken);

  client.messages.create({
      body: 'Hello from Node',
      to: '+12345678901',  // Text this number
      from: '+12345678901' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));```

[Setup Two-Factor Authentication via SMS with Authy](https://www.twilio.com/docs/authy/tutorials/two-factor-authentication-node-express)
twilio.com
Twilio - Communication APIs for SMS, Voice, Video and Authentication
Cloud communications platform for building SMS, Voice & Messaging applications on an API built for global scale. Get started with a free trial.
twilio.com
Two-Factor Authentication with Authy, Node.js and Express
Learn how to keep you user accounts secure by using two-factor authentication (2FA) in your application with Node.js, Express, and Authy from Twilio!