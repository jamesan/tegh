import { createSelector } from 'reselect'
import { EXTRUDER } from '../types/PeripheralTypeEnum'

const isExtruder = createSelector(
  config => config,
  config => k => (
    config.machine.peripherals.get(k, {}).type === EXTRUDER
  ),
)

export default isExtruder
