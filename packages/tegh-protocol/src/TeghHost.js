
import Peer from 'simple-peer'
import EventEmitter from 'eventemitter3'

import { signalTrigger } from './shared/eventTrigger'
import connectToSignallingServer from './shared/connectToSignallingServer'
import * as announcement from './shared/announcement'
import { chunkifier, dechunkifier } from './shared/webRTCDataChunk'

/*
 * keys = { private, public } - PEM format private and public keys
 * authenticate = (clientPulbicKey) => <any> - function that takes a client's
 * signallingServer = string - the url to the central signallingServer
 * public key and returns an account object or `false` if they are unauthorized.
 */
const TeghHost = ({
  keys,
  authenticate,
  signallingServer,
  wrtc,
}) => {
  const teghHost = new EventEmitter()
  teghHost.CONNECTING = 0
  teghHost.OPEN = 1
  teghHost.CLOSING = 2
  teghHost.CLOSED = 3

  const connect = async () => {
    const {
      socket: announcementSocket,
      promise: announcementSocketPromise,
    } = connectToSignallingServer({
      keys,
      signallingServer,
    })

    await announcementSocketPromise

    announcementSocket.on('announcement', async (announcementMessage) => {
      // validate and decrypt the client's announcement
      const offerPayload = await announcement.decrypt({
        message: announcementMessage,
        keys,
      })

      // authenticate the client via their public key
      const account = authenticate(offerPayload.publicKey)
      if (account === false) return

      // accept the offer from the client
      const rtcPeer = new Peer({
        initiator: false,
        wrtc,
      })

      rtcPeer.signal(offerPayload.signal)

      // create and send an answer
      const answerSignal = await signalTrigger(rtcPeer, 'answer')
      announcement.publish({
        socket: announcementSocket,
        signal: answerSignal,
        keys,
        peerPublicKey: offerPayload.publicKey,
      })

      // wait for the client to establish the webRTC connection and
      // create a public interface that can act as a drop-in replacement for a
      // websocket connection
      const teghSocket = new EventEmitter()

      if (!offerPayload.protocol.startsWith('chunked-')) {
        throw new Error(`Unsupported protocol: ${offerPayload.protocol}`)
      }
      teghSocket.protocol = offerPayload.protocol.replace(/chunked-/, '')
      teghSocket.readyState = teghHost.OPEN

      teghSocket.close = () => {
        rtcPeer.destroy()
      }

      rtcPeer.on('connect', () => {
        // relay events through the teghSocket
        rtcPeer.on('data', dechunkifier((data) => {
          teghSocket.emit('message', data)
        }))

        // eslint-disable-next-line no-underscore-dangle
        teghSocket.send = chunkifier(rtcPeer._channel, (data) => {
          rtcPeer.send(data)
        })

        teghHost.emit('connection', teghSocket)
      })

      rtcPeer.on('close', () => {
        teghSocket.readyState = teghHost.CLOSED
        teghSocket.emit('close')
      })

      rtcPeer.on('error', (e) => {
        teghSocket.readyState = teghHost.ERRORED
        teghSocket.emit('error', e)
      })
    })
  }

  connect()
  return teghHost
}

export default TeghHost
