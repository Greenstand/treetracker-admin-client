import React from 'react'
import SpeciesTable from './SpeciesTable'
import { Grid } from '@material-ui/core'

const SpeciesMgt = () => {
  return (
    <Grid container direction="column" style={{ flexWrap: 'nowrap', height: '100%' }}>
      <Grid item container style={{ height: '100%', overflow: 'hidden' }}>
        <SpeciesTable />
      </Grid>
    </Grid>
  )
}

export default SpeciesMgt
