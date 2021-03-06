// @flow
import uuid from 'uuid/v4'
import { Record } from 'immutable'

import type { RecordOf } from 'immutable'

export type JobFileT = RecordOf<{
  name: string,
  filePath: string,
  isTmpFile: boolean,
  quantity: number,
  jobID: string,
}>

const JobFileRecord = Record({
  id: null,
  name: null,
  filePath: null,
  isTmpFile: null,
  quantity: 1,
  jobID: null,
})

const JobFile = attrs => JobFileRecord({
  id: uuid(),
  ...attrs,
})

export const MockJobFile = attrs => (
  JobFile({
    isTmpFile: true,
    ...attrs,
  })
)

export default JobFile
