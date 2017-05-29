$(document).ready(function(){
  console.log(socket);
  socket.on('xmpp.connection',function(details) {

    console.log('connected', details);
    $('p.connection-status').html('Online')
  });
  socket.on('xmpp.error', function(error) {
    if ('auth' === error.type) {
      return alert('Authentication failed')
    }
  });
  // console.log('XMPP Scripts');

  $('#loginButton').click(function(e) {
    // e.preventdefault();
    // console.log('clicked');
    var jid = $('input[name="jid"]').val();
    console.log(jid);
    var password = $('input[name="password"]').val()
       if (!jid || !password) {
         return alert('Please enter connection details')
       }
       var options = { jid: jid, password: password }
       console.log('sending login request');
       socket.send('xmpp.login', options)
  });

  var sendMessage = function() {
      var message = $('textarea[name="outgoing-message"]').val()
      if (!message) return alert('Please enter a message!')
      var toSend = {
        to: 'sam@localhost', /* We'll hard code this for now */
        content: message
      }
      var html = [ '<div class="message">', '<time>',new Date().toString(), '</time>', '<span >-&gt; </span> ', message, '</div>' ]
      $('div.received').append(html.join(''))
      socket.send('xmpp.chat.message', toSend)
  }
  $('button[name="send-message"]').click(sendMessage);

  socket.on('xmpp.chat.message', function(incoming) {
    console.log(incoming);
    //  if (('localhost' !== incoming.from.domain) || ('sam' !== incoming.from.user))
    //   {
    //     return /* Ignore messages from anywhere else */
    //   }
    handleChatState(incoming.state)
      if (!incoming.content) return
       /* Ignore anything which isn't a chat message */
       /* Note: We really should escape the message contents here! */
       var html = [ '<div class="message">', '<time>', new Date().toString(),
       '</time>', '<span > &lt;- </span> ',
         incoming.content, '</div>' ]
        $('div.received').append(html.join(''))
  });

  var handleChatState = function(state) {
    if (!state) return /* Nothing to update */
    switch (state) {
      case 'active':  state = 'Reading question'; break
      case 'composing':
      default: state = 'Writing a response'; break
      case 'inactive': state = ''; break
    }
    $('p.chat-status').html(state);
}


// http://www.jquery-az.com/minimize-maximize-modal-of-bootstrap-by-using-jquery-3-demos/




});
