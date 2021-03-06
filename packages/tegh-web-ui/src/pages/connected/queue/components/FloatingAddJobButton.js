import React from 'react'
import {
  withStyles,
  Button,
  Tooltip,
} from '@material-ui/core'
import {
  Add,
} from '@material-ui/icons'

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4 + 56,
    right: theme.spacing.unit * 2,
  },
})

const enhance = withStyles(styles, { withTheme: true })

const FloatingAddJobButton = ({ classes, onChange }) => {
  const onHTMLInputChange = (e) => {
    e.preventDefault()
    // convert files to an array
    const files = [...e.target.files]
    onChange(files)
  }

  return (
    <Tooltip title="Add Job" placement="left">
      <Button
        component="label"
        variant="fab"
        className={classes.fab}
        color="default"
      >
        <input
          name="gcodeFile"
          type="file"
          accept=".ngc,.gcode"
          style={{ display: 'none' }}
          value=""
          onChange={onHTMLInputChange}
        />
        <Add />
      </Button>
    </Tooltip>
  )
}

export default enhance(FloatingAddJobButton)
