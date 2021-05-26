import React from 'react';
import { connect } from 'react-redux';
import {
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemText,
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
  DialogContentText,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import SortIcon from '@material-ui/icons/Sort';
import Menu from './common/Menu';
import { withStyles } from '@material-ui/core/styles';

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
    marginLeft: '20px',
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
  },
  listItem: {
    padding: '0 16px',
  },
  paddingBottom: {
    paddingBottom: '24px',
  },
  minWidth: {
    minWidth: '320px',
  },
});

const SpeciesTable = (props) => {
  const { classes } = props;
  const sortOptions = { byId: 'id', byName: 'name' };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [speciesEdit, setSpeciesEdit] = React.useState(undefined);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [sortedSpeciesList, setSortedSpeciesList] = React.useState([]);
  const [option, setOption] = React.useState(sortOptions.byName);
  const [selected, setSelected] = React.useState([]);
  const [showCombine, setShowCombine] = React.useState(false);

  const tableRef = React.useRef(null);

  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      props.speciesState.speciesList.length - page * rowsPerPage,
    );

  React.useEffect(() => {
    props.speciesDispatch.loadSpeciesList();
  }, [props.speciesDispatch]);

  React.useEffect(() => {
    const sortBy = (option) => {
      let sortedSpecies;
      if (option === sortOptions.byId) {
        sortedSpecies = [...props.speciesState.speciesList].sort(
          (a, b) => a[option] - b[option],
        );
      }
      if (option === sortOptions.byName) {
        sortedSpecies = [...props.speciesState.speciesList].sort((a, b) =>
          a[option].localeCompare(b[option]),
        );
      }
      setSortedSpeciesList(sortedSpecies);
    };
    sortBy(option);
  }, [
    option,
    sortOptions.byId,
    sortOptions.byName,
    props.speciesState.speciesList,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    tableRef.current && tableRef.current.scrollIntoView();

    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (species) => {
    setSpeciesEdit(species);
    setIsEdit(true);
  };

  const openDeleteDialog = (species) => {
    setSpeciesEdit(species);
    setOpenDelete(true);
  };

  const openCombineModal = () => {
    if (selected.length > 1) setShowCombine(true);
    else alert('Please select two or more species to be combined!');
  };

  const handleSelect = (checked, id) => {
    if (checked) setSelected([...selected, id]);
    else setSelected(selected.filter((item) => item !== id));
  };

  const renderSpecies = () => {
    return (rowsPerPage > 0
      ? sortedSpeciesList.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        )
      : sortedSpeciesList
    ).map((species) => (
      <TableRow key={species.id} role="listitem">
        <TableCell>
          <Checkbox
            onChange={(e) => handleSelect(e.target.checked, species.id)}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {species.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {species.name}
        </TableCell>
        <TableCell>{species.desc}</TableCell>
        <TableCell>{species.captureCount}</TableCell>
        <TableCell>
          <IconButton title="edit" onClick={() => handleEdit(species)}>
            <Edit />
          </IconButton>
          <IconButton title="delete" onClick={() => openDeleteDialog(species)}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  const tablePagination = () => (
    <TablePagination
      count={props.speciesState.speciesList.length}
      rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
      colSpan={3}
      page={page}
      rowsPerPage={rowsPerPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
    />
  );

  return (
    <>
      <Grid container className={classes.box}>
        <Grid item xs={3}>
          <Paper elevation={3} className={classes.menu}>
            <Menu variant="plain" />
          </Paper>
        </Grid>
        <Grid item xs={9} container className={classes.rightBox}>
          <Grid item xs={12}>
            <Grid
              container
              justify="space-between"
              className={classes.titleBox}
            >
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Typography variant="h2">Species</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.addUserBox}>
                <Button
                  onClick={openCombineModal}
                  variant="outlined"
                  color="primary"
                >
                  COMBINE SPECIES
                </Button>
                <Button
                  onClick={() => setIsAdding(true)}
                  variant="contained"
                  className={classes.addUser}
                  color="primary"
                >
                  ADD NEW SPECIES
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="column" className={classes.bodyBox}>
              <TableContainer component={Paper} ref={tableRef}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>
                        ID
                        <IconButton
                          title="sortbyId"
                          onClick={() => setOption(sortOptions.byId)}
                        >
                          <SortIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        name
                        <IconButton
                          title="sortbyName"
                          onClick={() => setOption(sortOptions.byName)}
                        >
                          <SortIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Tagged Captures</TableCell>
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
        isEdit={isAdding || isEdit}
        setIsEdit={isAdding ? setIsAdding : setIsEdit}
        speciesEdit={speciesEdit}
        setSpeciesEdit={setSpeciesEdit}
        styles={{ ...classes }}
        editSpecies={
          isAdding
            ? props.speciesDispatch.createSpecies
            : props.speciesDispatch.editSpecies
        }
        loadSpeciesList={props.speciesDispatch.loadSpeciesList}
        data={sortedSpeciesList}
      />
      <DeleteDialog
        speciesEdit={speciesEdit}
        setSpeciesEdit={setSpeciesEdit}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteSpecies={props.speciesDispatch.deleteSpecies}
        loadSpeciesList={props.speciesDispatch.loadSpeciesList}
      />
      <CombineModal
        show={showCombine}
        setShow={setShowCombine}
        data={sortedSpeciesList}
        combineSpecies={props.speciesDispatch.combineSpecies}
        loadSpeciesList={props.speciesDispatch.loadSpeciesList}
        selected={selected}
        styles={{ ...classes }}
      />
    </>
  );
};

const EditModal = ({
  isEdit,
  setIsEdit,
  speciesEdit,
  setSpeciesEdit,
  styles,
  loadSpeciesList,
  editSpecies,
  data,
}) => {
  const [error, setError] = React.useState(undefined);
  const nameSpecies = data.map((species) => species.name.toLowerCase());

  const onNameChange = (e) => {
    setError(undefined);
    setSpeciesEdit({ ...speciesEdit, name: e.target.value });
  };

  const onDescChange = (e) => {
    setSpeciesEdit({ ...speciesEdit, desc: e.target.value });
  };

  const handleEditDetailClose = () => {
    setIsEdit(false);
    setSpeciesEdit(undefined);
  };

  const handleSave = async () => {
    if (nameSpecies.includes(speciesEdit.name.toLowerCase().trim())) {
      setError('Species already exists');
    } else {
      setError(undefined);
      setIsEdit(false);
      await editSpecies({
        id: speciesEdit.id,
        name: speciesEdit.name,
        desc: speciesEdit.desc,
      });
      loadSpeciesList();
      setSpeciesEdit(undefined);
    }
  };

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
        <DialogContentText>{error}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDetailClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CombineModal = ({
  show,
  setShow,
  selected,
  data,
  combineSpecies,
  loadSpeciesList,
  styles,
}) => {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');

  const list = data
    .filter((species) => selected.includes(species.id))
    .map((species) => species.name);

  const handleClose = () => {
    setShow(false);
    setName('');
    setDesc('');
  };

  const handleSave = async () => {
    if (!name || !desc) return;

    setShow(false);
    await combineSpecies({ combine: selected, name, desc });
    loadSpeciesList();
    setName('');
    setDesc('');
  };

  return (
    <Dialog open={show} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Combine Species</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item>
            <Typography variant="body1">Combining:</Typography>
            <List>
              {list.map((item) => (
                <ListItem className={styles.listItem} key={item}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body1" className={styles.paddingBottom}>
              As:
            </Typography>
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
                  value={name}
                  className={styles.input}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item className={styles.desc}>
                <TextField
                  id="desc"
                  label="Description"
                  type="text"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={desc}
                  className={styles.input}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({
  speciesEdit,
  setSpeciesEdit,
  openDelete,
  setOpenDelete,
  deleteSpecies,
  loadSpeciesList,
}) => {
  const handleDelete = async () => {
    await deleteSpecies({ id: speciesEdit.id });
    loadSpeciesList();
    setOpenDelete(false);
    setSpeciesEdit(undefined);
  };

  const closeDelete = () => {
    setOpenDelete(false);
    setSpeciesEdit(undefined);
  };

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
  );
};

export default withStyles(styles)(
  connect(
    //state
    (state) => ({
      speciesState: state.species,
    }),
    //dispatch
    (dispatch) => ({
      speciesDispatch: dispatch.species,
    }),
  )(SpeciesTable),
);
