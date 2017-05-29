const Client = require('node-xmpp-client');
const ltx = Client.ltx;
const ddg = require('ddg');

const options = {
  jid: 'prad@127.0.0.1',
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

const NS_CHAT_STATE = 'http://jabber.org/protocol/chatstates';
const sendChatState = (to, state) => {
  const stanza = new ltx.Element('message', { type: 'chat', to })
  stanza.c(state, { xmlns: NS_CHAT_STATE })
  console.log('Sending chat state: ' + stanza.toString())
  client.send(stanza)
}


const handleMessage = (stanza) => {
  console.log(stanza);
  const messageContent = stanza.getChildText('body')
  if (!messageContent) return /* Not a chat message */
  const from = stanza.attr('from')
  const logEntry = 'Received message from ' + from + ' with content: ' + messageContent;
  console.log(logEntry);
  // const reply = new ltx.Element( 'message', { type: 'chat', to: from });
  // reply.c('body').t(messageContent);
  // client.send(reply);
  sendChatState(from, 'active');
  sendChatState(from, 'composing');

  ////
  ddg.query(messageContent, (error, data) => {
    let result = null
    if (error) {
      result = 'Unfortunately we could not answer your request'
    } else {
      if (!data.RelatedTopics[0]) {
        result = 'Sorry, there were no results!'
      } else {
        const item = data.RelatedTopics[0]
        result = item.FirstURL + '\n' + item.Text
      }
    }
    const reply = new ltx.Element(
      'message',
      { type: 'chat', to: from }
    );
    reply.c('body').t(result)
    .up()
    .c('inactive', { xmlns: NS_CHAT_STATE });
    console.log('Sending response: ' + reply);
    client.send(reply);
    // sendChatState(from, 'gone');
  });
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
