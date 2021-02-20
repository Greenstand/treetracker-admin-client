/*
 * The whole app's frame
 */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Filter from './Filter'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TextField from '@material-ui/core/TextField'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import IconSettings from '@material-ui/icons/Settings'
import IconSearch from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconCloudDownload from '@material-ui/icons/CloudDownload'
import FilterModel from '../models/Filter'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
    width: 724,
  },
}))

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]
function SimpleTable() {
  const classes = useStyles()

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Dessert</TableCell>
          <TableCell align="right">Calories</TableCell>
          <TableCell align="right">Fat&nbsp;(g)</TableCell>
          <TableCell align="right">Carbs&nbsp;(g)</TableCell>
          <TableCell align="right">Protein&nbsp;(g)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name} hover={true}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.calories}</TableCell>
            <TableCell align="right">{row.fat}</TableCell>
            <TableCell align="right">{row.carbs}</TableCell>
            <TableCell align="right">{row.protein}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={100}
            rowsPerPage={20}
            page={1}
            style={{
              borderBottom: 'none',
            }}
          />
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default function TreeTest() {
  return (
    <React.Fragment>
      <Grid item>
        <Box pl={27} pt={11} pr={3}>
          <Typography variant="h5">2,000 trees</Typography>
          <Box py={2}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <TextField
                  placeholder="search"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <IconCloudDownload color="action" />
                <Box pl={3} clone>
                  <IconSettings color="action" />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <SimpleTable />
        </Box>
      </Grid>
      <Grid item>
        <Filter isOpen={true} filter={new FilterModel()} />
      </Grid>
    </React.Fragment>
  )
}
