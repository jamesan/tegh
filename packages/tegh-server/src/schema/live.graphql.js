import EventEmitter from 'events'
import _ from 'lodash'
import {
  GraphQLLiveData,
  subscribeToLiveData,
} from 'graphql-live-subscriptions'

import QueryRootGraphQL from './QueryRoot.graphql'

const MAX_UPDATE_RATE_MS = 500

const type = () => QueryRootGraphQL

const LiveSubscriptionRoot = () => GraphQLLiveData({
  name: 'LiveSubscriptionRoot',
  type,
})

const liveGraphQL = () => ({
  type: LiveSubscriptionRoot(),
  resolve: source => source,
  subscribe: subscribeToLiveData({
    initialState: (source, args, context) => (
      context.store.getState()
    ),
    eventEmitter: (source, args, context) => {
      const eventEmitter = new EventEmitter()
      const { store } = context

      const emitUpdate = () => setImmediate(() => {
        const nextState = store.getState()
        eventEmitter.emit('update', { nextState })
      })

      store.subscribe(_.throttle(emitUpdate, MAX_UPDATE_RATE_MS))

      return eventEmitter
    },
    sourceRoots: {
      Job: [
        'files',
        'tasks',
        'history',
        'printsCompleted',
        'totalPrints',
        'printsQueued',
        'isDone',
      ],
      JobFile: [
        'tasks',
        'printsCompleted',
        'totalPrints',
        'printsQueued',
        'isDone',
      ],
      Printer: [
        'macroDefinitions',
        'fans',
        'heaters',
      ],
      Heater: [
        'name',
        'type',
      ],
      Task: [
        'printer',
      ],
    },
  }),
})

export default liveGraphQL
