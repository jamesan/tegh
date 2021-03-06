import tql from 'typiql'
import snl from 'strip-newlines'
import {
  GraphQLInputObjectType,
} from 'graphql'

import actionResolver from '../../util/actionResolver'
import deleteJob from '../actions/deleteJob'

import JobGraphQL from '../types/Job.graphql'

const deleteJobGraphQL = () => ({
  type: tql`${JobGraphQL}`,
  description: snl`
    creates a job to print a file already on the Tegh server.
  `,

  resolve: actionResolver({
    actionCreator: deleteJob,
    selector: () => null,
  }),

  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'DeleteJobInput',
        fields: {
          printerID: {
            type: tql`ID!`,
          },
          jobID: {
            type: tql`ID!`,
          },
        },
      }),
    },
  },
})

export default deleteJobGraphQL
