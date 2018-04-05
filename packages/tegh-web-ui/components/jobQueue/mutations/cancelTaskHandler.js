import { compose, withProps } from 'recompose'

import withSpoolMacro from '../../../higherOrderComponents/withSpoolMacro'

const cancelTaskHandler = compose(
  withSpoolMacro,
  withProps(({ spoolMacro }) => ({
    cancelTask: task => spoolMacro({
      printerID: task.printer.id,
      macro: 'eStop',
    }),
  })),
)

export default cancelTaskHandler
