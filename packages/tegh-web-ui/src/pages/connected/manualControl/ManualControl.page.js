import React from 'react'
import { compose, withProps } from 'recompose'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import Loader from 'react-loader-advanced'
import gql from 'graphql-tag'

import withLiveData from '../shared/higherOrderComponents/withLiveData'

import PrinterStatusGraphQL from '../shared/PrinterStatus.graphql'

import Header from '../frame/components/Header'
// import Log from './components/Log'
import Home from './components/home/Home'
import XYJogButtons from './components/jog/XYJogButtons'
import ZJogButtons from './components/jog/ZJogButtons'
import HeaterControl, { HeaterControlFragment } from './components/heaters/HeaterControl'

const MANUAL_CONTROL_SUBSCRIPTION = gql`
  subscription ManualControlSubscription($printerID: ID!) {
    live {
      patch { op, path, from, value }
      query {
        singularPrinter: printers(id: $printerID) {
          ...PrinterStatus
          heaters {
            ...HeaterControlFragment
          }
        }
      }
    }
  }

  # fragments
  ${PrinterStatusGraphQL}
  ${HeaterControlFragment}
`

const enhance = compose(
  withProps(ownProps => ({
    subscription: MANUAL_CONTROL_SUBSCRIPTION,
    variables: {
      printerID: ownProps.match.params.printerID,
    },
  })),
  withLiveData,
  withProps(({ singularPrinter }) => ({
    printer: singularPrinter[0],
    isReady: singularPrinter[0].status === 'READY',
  })),
)

const ManualControl = ({ printer, isReady }) => (
  <div>
    <Header printer={printer} />
    <main>
      <Grid
        container
        spacing={24}
      >
        <Loader
          show={!isReady}
          message={(
            <Typography variant="h4" style={{ color: '#fff' }}>
              manual controls disabled while
              {' '}
              {printer.status.toLowerCase()}
            </Typography>
          )}
          style={{
            flex: 1,
            margin: 12,
          }}
          backgroundStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
          contentStyle={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <Grid item xs={12}>
            <Home printer={printer} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <XYJogButtons printer={printer} form="xyJog" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <ZJogButtons printer={printer} form="zJog" />
          </Grid>
        </Loader>
        {
          printer.heaters.map(heater => (
            <Grid item xs={12} key={heater.id}>
              <HeaterControl
                printer={printer}
                heater={heater}
                disabled={!isReady}
              />
            </Grid>
          ))
        }
      </Grid>
    </main>
  </div>
)

export default enhance(ManualControl)
