const https = require('https');
const qs = require('querystring');

// eslint-disable-next-line prefer-destructuring
const VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;
const ACCESS_TOKEN = process.env.BOT_TOKEN;

// Verify Url - https://api.slack.com/events/url_verification
function verify(token, challenge, callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify(challenge),
  };
  if (token === VERIFICATION_TOKEN) {
    callback(null, response);
  } else callback('verification failed');
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function reply(event, callback) {
  // check for non-bot message and keywords
  if (!event.subtype && event.type === 'message' && /(aws|lambda)/ig.test(event.text)) {
    const text = `<@${event.user}> isn't AWS Lambda awesome?`;
    const message = {
      statusCode: 200,
      token: ACCESS_TOKEN,
      channel: event.channel,
      text,
    };
    // console.log('request: ' + JSON.stringify(message));
    const query = qs.stringify(message); // prepare the querystring
    https.get(`https://slack.com/api/chat.postMessage?${query}`);
  }

  callback(null, { statusCode: 200 });
}

// Lambda handler
exports.handler = (data, context, callback) => {
  let body;
  // console.log(process.env);
  if (data.body !== null && data.body !== undefined) {
    body = JSON.parse(data.body);
  }

  switch (body.type) {
    case 'url_verification': verify(body.token, body.challenge, callback); break;
    case 'event_callback': reply(body.event, callback); break;
    default: callback(null, { statusCode: 200 });
  }
};
