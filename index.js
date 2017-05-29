const Client = require('node-xmpp-client');
const ltx = Client.ltx;

const options = {
  jid: 'samsyasam@ec2-54-190-12-232.us-west-2.compute.amazonaws.com',
  password: 'a1b2c3d4'
}

const client = new Client(options);

client.once('online', (connectionDetails) => {
  console.log('We are connected!');
  console.log(connectionDetails);
  sendPresence();
});

// const sendPresence = () => {
//   var stanza = new ltx.Element('presence')
//   console.log('Sending presence: ' + stanza.toString())
//   client.send(stanza)
// }
//
// client.on('stanza', (stanza) => {
//   if (false === stanza.is('message')) return /* Not a <message/> stanza */
//   const messageContent = stanza.getChildText('body')
//   if (!messageContent) return /* Not a chat message */
//   const from = stanza.attr('from')
//   const logEntry = 'Received message from ' + from + ' with content:\n' + messageContent;
//   console.log(logEntry);
//   const reply = new ltx.Element( 'message', { type: 'chat', to: from });
//   reply.c('body').t(messageContent);
//   client.send(reply);
// });


const sendPresence = () => {
  const stanza = new ltx.Element('presence')
    .c('show')
    .t('available')
  console.log('Sending presence: ' + stanza.toString())
  client.send(stanza)
}

const handleMessage = (stanza) => {
  const messageContent = stanza.getChildText('body')
  if (!messageContent) return /* Not a chat message */
  const from = stanza.attr('from')
  const logEntry = 'Received message from ' + from + ' with content:\n' + messageContent;
  console.log(logEntry);
  const reply = new ltx.Element( 'message', { type: 'chat', to: from });
  reply.c('body').t(messageContent);
  client.send(reply);
}

const handlePresence = (stanza) => {
  if (false === stanza.attr('subscribe')) {
    return /* We don't handle anything other than a subscribe */
  }
  const reply = new ltx.Element(
    'presence',
    { type: 'subscribed', to: stanza.attr('from') }
  )
  client.send(reply)
}

client.on('stanza', (stanza) => {
  if (true === stanza.is('message')) {
    console.log('Got message');
    return handleMessage(stanza);
  } else if (true === stanza.is('presence')) {
    console.log('Got presence');
    return handlePresence(stanza);
  }
});
