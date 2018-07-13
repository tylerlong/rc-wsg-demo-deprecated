import WS from 'ws'
import RingCentral from 'ringcentral-js-concise'
import dotenv from 'dotenv'
import uuid from 'uuid/v1'
import delay from 'timeout-as-promise'

dotenv.config()

;(async () => {
  const rc = new RingCentral(
    process.env.RINGCENTRAL_CLIENT_ID,
    process.env.RINGCENTRAL_CLIENT_SECRET,
    process.env.RINGCENTRAL_SERVER_URL
  )
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })
  const accessToken = rc.token().access_token

  const ws = new WS(process.env.RINGCENTRAL_WSG_URL)
  ws.on('open', function open () {
    console.log('open')
    ws.send(JSON.stringify(
      [
        {
          'type': 'ClientRequest',
          'messageId': uuid(),
          'method': 'GET',
          'path': '/restapi/v1.0/account/~/extension/~',
          'headers': {
            Authorization: `Bearer ${accessToken}`
          }
        }
      ]
    ))
  })
  ws.on('message', function incoming (data) {
    console.log('message', data)
  })

  await delay(10000)
})()
