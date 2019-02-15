# slack-events-example

Slack bot using Lambda and API Gateway

## Slack App Creation Steps

Slack application creation link - <https://api.slack.com/apps>

### 1. Create a new app

* Click Create New App
  * Fill out App Name and Development Slack Workspace

### 2. Copy the Verification(challenge) token

* Go to Settings > Basic Information
* Under the App Credentials section is a verification token. Save the verification token for later use in the Lambda function.

### 3. Create a bot

* Go to Features > Bot Users
* Click on Add a Bot User - choose a display name and username then click Add Bot User

### 4. Copy Bot Token

* Go to Features > OAuth and Permissions
* Click Install App to Workspace.
* Tokens for your workspace will now be shown.  Save the bot user oauth access token for later use in the lambda function.

## AWS Lambda Function Creation Steps

### 1. Go to the main Lambda page and click Create function

* Choose Author from scratch and fill out the following fields:
  * Name: Pick a name for you function
  * Runtime: Node.js
  * Role: Create a new role from one or more templates
  * Role name: Pick a name for the new role that will be created for the function
* Hit create function (takes a bit)
* Copy the index.js code from here into the index.js function in the Lambda code editor

### 2. Add environment variables

* Add VERIFICATION_TOKEN and BOT_TOKEN keys as environment variables (found below the code editor)
* Paste the copied slack tokens from ealier as the values for the keys

### 3. Add API Gateway as a trigger

* Configure the trigger
  * Select create a new API from the drop-down
  * Select open from the Security drop-down
    * Click add - No additional setting are needed
  * Click the orange save button
* An API endpoint will be created.  Copy and save the URL for use in the Slack App Event Subscriptions.

## Linking Slack and Lambda/API Gateway

### 1. Create and configuring an event

* Return to the slack app build [page](https://api.slack.com/apps).
* Click on the newly created app then go to Features > Event Subscriptions
  * Turn Enable Events On
  * Paste the API gateway URL from earlier in the the Request URL field
    * Slack will return Verified in green if everything went well

### 2. Subcribe to Bot Events

* From the Event Subscriptions page, scroll down to Subscribe to Bot Events
* Click Add Bot User Event
* Add the message.channels event
* Click Save Changes

### 3. Add Bot to slack channel

* Go to your slack workspace
* Add the bot to the channel of your choosing (general for example)
* Type the keywords aws or lambda and the bot should reply

## Debugging

* Log statements are in place that will return output to CloudWatch
  * `console.log(data.body)` is in place to show the request coming from slack
  * `console.log('request: ' + JSON.stringify(message))` is in place to see the message lambda is sending to slack
* From the main CloudWatch interface, click on Logs, then click on the name of your function under Log Groups
