import { loadConfig } from 'tegh-daemon'

import createSerialPort from './create_serial_port'

const serialConsole = () => {
  const configPath = './tegh.yml'
  const config = loadConfig(configPath)

  const {
    serialPort,
    serialOptions,
    parser,
    path,
    baudRate
  } = createSerialPort(config)

  console.log(`opening ${path} with options:`, serialOptions)
  serialPort.open()

  serialPort.on('open', () => {
    console.log('opened')
  })

  parser.on('data', (data) => {
    console.log(`rx: ${data}`)
  })
}

export default serialConsole