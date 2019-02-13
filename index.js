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
    const botText = `<@${event.user}> isn't AWS Lambda awesome?`;
    const attachment = [
      {
        fallback: 'Required plain-text summary of the attachment.',
        color: '#2eb886',
        pretext: 'Optional text that appears above the attachment block',
        author_name: 'Bobby Tables',
        author_link: 'http://flickr.com/bobby/',
        author_icon: 'http://flickr.com/icons/bobby.jpg',
        title: 'Slack API Documentation',
        title_link: 'https://api.slack.com/',
        text: 'Optional text that appears within the attachment',
        fields: [
          {
            title: 'Priority',
            value: 'High',
            short: false,
          },
        ],
        image_url: 'http://my-website.com/path/to/image.jpg',
        thumb_url: 'http://example.com/path/to/thumb.png',
        footer: 'Slack API',
        footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
        ts: 123456789,
      },
    ];
    // const myJSON = JSON.stringify(attachment);
    const message = {
      statusCode: 200,
      token: ACCESS_TOKEN,
      channel: event.channel,
      text: botText,
      attachments: JSON.stringify(attachment),
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
  // console.log(data.body);
  if (data.body !== null && data.body !== undefined) {
    body = JSON.parse(data.body);
  }

  switch (body.type) {
    case 'url_verification': verify(body.token, body.challenge, callback); break;
    case 'event_callback': reply(body.event, callback); break;
    default: callback(null, { statusCode: 200 });
  }
};
