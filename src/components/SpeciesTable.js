import React from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Button,
  TablePagination,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import SortIcon from '@material-ui/icons/Sort';
import Menu from './common/Menu'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  box: {
    height: '100%',
  },
  menu: {
    height: '100%',
  },
  rightBox: {
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(8),
  },
  titleBox: {
    marginBottom: theme.spacing(4),
  },
  accountIcon: {
    fontSize: 67,
    marginRight: 11,
  },
  addUserBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addUser: {
    color: 'white',
  },
  input: {
    margin: theme.spacing(0, 1, 4, 1),
  },
  name: {
    marginRight: theme.spacing(1),
  },
  desc: {
    marginRight: theme.spacing(1),
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  noteBox: {
    backgroundColor: 'lightgray',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  copyIcon: {
    position: 'relative',
    bottom: 20,
  },
  copyMsg: {
    color: theme.palette.primary.main,
    position: 'relative',
    bottom: 5,
  },
  radioButton: {
    '&$radioChecked': { color: theme.palette.primary.main },
  },
  radioChecked: {},
  radioGroup: {
    position: 'relative',
    bottom: 12,
    left: 10,
  }
})

const SpeciesTable = (props) => {
  const { classes } = props
  const sortOptions = {byId:"id", byName:"name"}

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [isEdit, setIsEdit] = React.useState(false)
  const [speciesEdit, setSpeciesEdit] = React.useState(undefined)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [sortedSpeciesList, setSortedSpeciesList] = React.useState([])
  const [option, setOption] = React.useState(sortOptions.byName)

  const tableRef = React.useRef(null)

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.speciesState.speciesList.length - page * rowsPerPage)

  React.useEffect(() => {
    props.speciesDispatch.loadSpeciesList()
  }, [props.speciesDispatch])

  React.useEffect(()=>{
    const sortBy = (option) => {
      let sortedSpecies
      if(option === sortOptions.byId){
        sortedSpecies = [...props.speciesState.speciesList].sort((a, b) => a[option] - b[option]);
      }
      if(option === sortOptions.byName){
        sortedSpecies = [...props.speciesState.speciesList].sort((a, b) => a[option].localeCompare(b[option]));
      }
      setSortedSpeciesList(sortedSpecies)
    }
    sortBy(option)
  },[option, sortOptions.byId, sortOptions.byName, props.speciesState.speciesList])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    tableRef.current && tableRef.current.scrollIntoView();

    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEdit = (species) => {
    setSpeciesEdit(species)
    setIsEdit(true)
  }

  const openDeleteDialog = (species) => {
    setSpeciesEdit(species)
    setOpenDelete(true)
  }

  const renderSpecies = () => {    
    return ( rowsPerPage > 0
      ? sortedSpeciesList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedSpeciesList
    ).map((species) => (
        <TableRow key={species.id} role="listitem">
          <TableCell component="th" scope="row">{species.id}
          </TableCell>
          <TableCell component="th" scope="row">{species.name}
          </TableCell>
          <TableCell>{species.desc}</TableCell>
          <TableCell>{species.treeCount}</TableCell>
          <TableCell>
            <IconButton title="edit" onClick={() => handleEdit(species)}>
              <Edit />
            </IconButton>
            <IconButton title="delete" onClick={() => openDeleteDialog(species)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
    ))
  }

  const tablePagination = () => 
      <TablePagination
        count={props.speciesState.speciesList.length}
        rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
        colSpan={3}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true
        }}
      />
  
  return (
    <>
      <Grid container className={classes.box} >
        <Grid item xs={3}>
          <Paper elevation={3} className={classes.menu}>
            <Menu variant="plain" />
          </Paper>
        </Grid>
        <Grid item xs={9} container className={classes.rightBox}>
          <Grid item xs={12}>
            <Grid container justify="space-between" className={classes.titleBox}>
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Typography variant="h2">Species</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.addUserBox}>
                <Button
                  // onClick={handleAddUser}
                  variant="contained"
                  className={classes.addUser}
                  color="primary"
                >ADD NEW SPECIES
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="column" className={classes.bodyBox}>
              <TableContainer component={Paper} ref={tableRef}>
                <Table className={classes.table} aria-label="simple table" >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID
                        <IconButton title="sortbyId" onClick={()=>setOption(sortOptions.byId)} >
                          <SortIcon />
                          </IconButton>
                      </TableCell>                   
                      <TableCell>name
                        <IconButton title="sortbyName" onClick={()=>setOption(sortOptions.byName)} >
                          <SortIcon />
                        </IconButton>
                        </TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Tagged Trees</TableCell>
                      <TableCell>Operations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {renderSpecies()}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>{tablePagination()}</TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <EditModal
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        speciesEdit={speciesEdit}
        setSpeciesEdit={setSpeciesEdit}
        styles={{ ...classes }}
        editSpecies={props.speciesDispatch.editSpecies}
        loadSpeciesList={props.speciesDispatch.loadSpeciesList}
      />
      <DeleteDialog
        speciesEdit={speciesEdit}
        setSpeciesEdit={setSpeciesEdit}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteSpecies={props.speciesDispatch.deleteSpecies}
        loadSpeciesList={props.speciesDispatch.loadSpeciesList}
      />
    </>
  )
}

const EditModal = ({
  isEdit,
  setIsEdit,
  speciesEdit,
  setSpeciesEdit,
  styles,
  loadSpeciesList,
  editSpecies,
}) => {
  const onNameChange = (e) => {
    console.log(e.target.value)
    setSpeciesEdit({ ...speciesEdit, name: e.target.value })
  }

  const onDescChange = (e) => {
    console.log(e.target.value)
    setSpeciesEdit({ ...speciesEdit, desc: e.target.value })
  }

  const handleEditDetailClose = () => {
    setIsEdit(false)
    setSpeciesEdit(undefined)
  }

  const handleSave = async () => {
    setIsEdit(false)
    await editSpecies({ id: speciesEdit.id, name: speciesEdit.name, desc: speciesEdit.desc })
    loadSpeciesList()
    setSpeciesEdit(undefined)
  }

  return (
    <Dialog open={isEdit} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Species Detail</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item className={styles.name}>
            <TextField
              autoFocus
              id="name"
              label="Name"
              type="text"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={(speciesEdit && speciesEdit.name) || ''}
              className={styles.input}
              onChange={onNameChange}
            />
          </Grid>
          <Grid item className={styles.desc}>
            <TextField
              autoFocus
              id="desc"
              label="Description"
              type="text"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={(speciesEdit && speciesEdit.desc) || ''}
              className={styles.input}
              onChange={onDescChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDetailClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const DeleteDialog = ({
  speciesEdit,
  setSpeciesEdit,
  openDelete,
  setOpenDelete,
  deleteSpecies,
  loadSpeciesList,
}) => {
  const handleDelete = async () => {
    await deleteSpecies({ id: speciesEdit.id })
    loadSpeciesList()
    setOpenDelete(false)
    setSpeciesEdit(undefined)
  }

  const closeDelete = () => {
    setOpenDelete(false)
    setSpeciesEdit(undefined)
  }

  return (
    <Dialog
      open={openDelete}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Please confirm you want to delete`}</DialogTitle>
      <DialogActions>
        <Button onClick={handleDelete} color="primary">
          Delete
        </Button>
        <Button onClick={closeDelete} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withStyles(styles)(
  connect(
    //state
    (state) => ({
      speciesState: state.species,
    }),
    //dispatch
    (dispatch) => ({
      speciesDispatch: dispatch.species,
    })
  )(SpeciesTable)
)
