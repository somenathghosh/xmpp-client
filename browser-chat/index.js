const http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
const server = http.createServer((req, res) => {
  let uri = url.parse(req.url).pathname
  if (uri === '/') uri = '/index.html'
  const filename = path.join(process.cwd(), 'public', uri)
  fs.exists(filename, function(exists) {
    if (!exists) {
      res.writeHead(404)
      res.end()
      return
    }
    const mimeType = (-1 === req.url.indexOf('/scripts')) ?
      'text/html' : 'application/javascript'
    res.writeHead(200, mimeType)
    fs.createReadStream(filename).pipe(res)
  })
})
server.listen(3000);

const Primus = require('primus')
const options = { transformer: 'websockets' }
const primus = new Primus(server, options)
const Xmpp = require('xmpp-ftw')
primus.on('connection', (socket) => {
  console.log('New websocket connection')
  const xmpp = new Xmpp.Xmpp(socket)
  socket.xmpp = xmpp
})
primus.on('disconnection', (socket) => {
  console.log('Websocket disconnected, logging user out')
  socket.xmpp.logout()
})

// primus.on('connection', (socket) => {
//   console.log('New websocket connection')
// })
// primus.on('disconnection', (socket) => {
//     console.log('Websocket disconnected')
// });
primus.plugin('emitter', require('primus-emitter'));
primus.save(path.join(process.cwd(), 'public', 'scripts', 'primus.js'))
