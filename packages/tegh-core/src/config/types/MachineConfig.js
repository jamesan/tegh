import { Record, Map } from 'immutable'
import t from 'tcomb-validation'

import MachineAxisConfig, { MachineAxisConfigStruct } from './MachineAxisConfig'
import MachinePeripheralConfig, { MachinePeripheralConfigStruct } from './MachinePeripheralConfig'

export const MachineConfigStruct = t.struct({
  id: t.String,
  driver: t.String,
  axes: t.dict(t.String, MachineAxisConfigStruct),
  peripherals: t.dict(t.String, MachinePeripheralConfigStruct),
})

const MachineConfigRecordFactory = Record(
  Map(MachineConfigStruct.meta.props).map(() => null).toJS(),
)

const mapOfRecords = (entries = {}, recordFactory) => (
  Map(entries).map(props => recordFactory(props))
)

const MachineConfig = (props = {}) => MachineConfigRecordFactory({
  ...props,
  axes: mapOfRecords(props.axes, MachineAxisConfig),
  peripherals: mapOfRecords(props.peripherals, MachinePeripheralConfig),
})

export default MachineConfig
