const Client = require('node-xmpp-client')
const options = {
  jid: 'samsyasam@ec2-54-190-12-232.us-west-2.compute.amazonaws.com',
  password: 'a1b2c3d4'
}
const client = new Client(options)
client.once('online', (connectionDetails) => {
  console.log('We are connected!')
  console.log(connectionDetails)
})
