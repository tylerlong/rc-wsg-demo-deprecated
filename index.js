import WS from 'ws'
import RingCentral from 'ringcentral-js-concise'
import dotenv from 'dotenv'

dotenv.config()

;(async () => {
  const rc = new RingCentral(process.env.RINGCENTRAL_CLIENT_ID, process.env.RINGCENTRAL_CLIENT_SECRET, process.env.RINGCENTRAL_SERVER_URL)

  try {
    await rc.authorize({
      username: process.env.RINGCENTRAL_USERNAME,
      extension: process.env.RINGCENTRAL_EXTENSION,
      password: process.env.RINGCENTRAL_PASSWORD
    })
    console.log('access_token:', rc.token().access_token)
  } catch (e) {
    console.log(e.response.data)
  }

  const ws = new WS(process.env.RINGCENTRAL_WSG_URL)

  ws.on('open', function open () {
    console.log('open')
    ws.send([
      {
        'type': 'ClientRequest',
        'messageId': 'uniq-message-id',
        'method': 'GET',
        'path': '/restapi/v1.0/account/~/extension/~',
        'headers': {
          'Authorization': `Bearer ${rc.token().access_token}`
        }
      }
    ])
  })

  ws.on('message', function incoming (data) {
    console.log('message', data)
  })
})()
