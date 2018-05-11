# Twilio TaskRouter Contact Center
Contact Center System powered by Twilio TaskRouter.

## Requirement
* Node.js 8.9.4 or later
* npm or yarn
* Twilio Account
* Docker
* Ngrok

## Install
### Twilio
Create account if you don't have.  
[Twilio (For Japan)](https://twilio.kddi-web.com)  
[Twilio (Other)](https://www.twilio.com)

### Application
Fork and clone the repository. Then, install dependencies with

`npm install` or `yarn install`

In order to run the application you will need to copy environment file and set the following variables:

`copy .env.example .env`

* TWILIO_ACCOUNT_SID
* TWILIO_AUTH_TOKEN
* TWILIO_TASKROUTER_WORKSPACE_SID
* TWILIO_TWIML_APP_SID
* TWILIO_API_KEY
* TWILIO_API_SECRET
* TWILIO_SYNC_SERVICE_SID
* TWILIO_CONFERENCE_NUMBER
* TWILIO_TASKROUTER_WORKFLOW_SID
* NGROK_GLOBAL_DOMAIN

For global access from Twilio, you will need to make tunnel using ngrok.

`ngrok http 1080`

Set the ngrok variable from result above.

* NGROK_GLOBAL_DOMAIN=https://[YOUR_SUB_DOMAIN].ngrok.io/

Prepare your Twilio number for incoming call, then set voice url to IVR endpoint on Twilio Console.
Additionally, set status callback url to CALLBACK endpoint too.

https://jp.twilio.com/console/phone-numbers/incoming

- Voice URL

    `https://[GLOBAL_DOMAIN]/api/twilio/twiml/voices/ivr`

- Status Callback URL

    `https://[GLOBAL_DOMAIN]/api/twilio/twiml/voices/callback`

Then, start your application temporary.

`docker-compose up`

Create some taskqueues.

http://localhost:1080/#/taskqueues

Create a workflow.

http://localhost:1080/#/workflows

※ Set callback url with value of following.

-- https://[YOUR_SUB_DOMAIN].ngrok.io/api/twilio/twiml/voices/assignment

And then, set the workflow variable from result above.

* TWILIO_TASKROUTER_WORKFLOW_SID=[WWxxxxxxxxxxxxxxxxxxxxxx]

Restart your server.

-- Ctrl + C

`docker-compose up`

Regist your ivr settings.

http://localhost:1080/#/ivrs

Create agents to reponse incoming call.

http://localhost:1080/#/workers

Open specified agent window on Chrome browser.

http://localhost:1080/#/operators/[WORKER_SID]/show

Open the page for super visor on another window.

http://localhost:1080/#/sv/monitor

Finally, call to your Twilio number!!  

## Contribution
Contributions are welcome and generally accepted.

## Licence
MIT
