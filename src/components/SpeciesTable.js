import React, { useState, useEffect, useRef, useContext } from 'react';
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
import { Edit, Delete, Category, Sort as SortIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { SpeciesContext } from '../context/SpeciesContext';
import Menu from './common/Menu';
import Spinner from './common/Spinner';
// import * as loglevel from 'loglevel';

// const log = loglevel.getLogger('./SpeciesTable.js');

const styles = (theme) => ({
  speciesTableContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
  },
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
    flexGrow: 1,
  },
  titleBox: {
    marginBottom: theme.spacing(4),
  },
  accountIcon: {
    fontSize: 67,
    marginRight: 11,
    color: 'gray',
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
  operationButton: {
    padding: '6px',
  },
  spacer: {
    flex: '0 0 16px',
  },
});

const SpeciesTable = (props) => {
  const { classes } = props;
  const sortOptions = { byId: 'id', byName: 'name' };
  const speciesContext = useContext(SpeciesContext);
  const { isLoading } = useContext(SpeciesContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [speciesEdit, setSpeciesEdit] = useState(undefined);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortedSpeciesList, setSortedSpeciesList] = useState([]);
  const [option, setOption] = useState(sortOptions.byName);
  const [selected, setSelected] = useState([]);
  const [showCombine, setShowCombine] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    const sortBy = (option) => {
      let sortedSpecies;
      if (option === sortOptions.byId) {
        sortedSpecies = [...speciesContext.speciesList].sort(
          (a, b) => a[option] - b[option]
        );
      }
      if (option === sortOptions.byName) {
        sortedSpecies = [...speciesContext.speciesList].sort((a, b) =>
          a[option].localeCompare(b[option])
        );
      }
      setSortedSpeciesList(sortedSpecies);
    };
    sortBy(option);
  }, [
    option,
    sortOptions.byId,
    sortOptions.byName,
    speciesContext.speciesList,
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
          page * rowsPerPage + rowsPerPage
        )
      : sortedSpeciesList
    ).map((species) => (
      <TableRow key={species.id} role="listitem">
        <TableCell>
          <Checkbox
            onChange={(e) => handleSelect(e.target.checked, species.id)}
            checked={selected.includes(species.id)}
          />
        </TableCell>
        <TableCell component="th" scope="row" data-testid="species">
          {species.name}
        </TableCell>
        <TableCell>{species.desc}</TableCell>
        <TableCell>{species.captureCount}</TableCell>
        <TableCell>
          <IconButton
            title="edit"
            onClick={() => handleEdit(species)}
            className={classes.operationButton}
          >
            <Edit />
          </IconButton>
          <IconButton
            title="delete"
            onClick={() => openDeleteDialog(species)}
            className={classes.operationButton}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  const tablePagination = () => (
    <TablePagination
      count={speciesContext.speciesList.length}
      rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
      classes={{ spacer: classes.spacer }}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
    />
  );

  return (
    <Grid className={classes.speciesTableContainer}>
      <Paper elevation={3} className={classes.menu}>
        <Menu variant="plain" />
      </Paper>

      <Grid item container className={classes.rightBox}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            className={classes.titleBox}
          >
            <Grid item>
              <Grid container>
                <Grid item>
                  <Category className={classes.accountIcon} />
                </Grid>
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
                    <TableCell width={20}></TableCell>
                    <TableCell width={80}>
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
                <TableBody>{renderSpecies()}</TableBody>
                {!isLoading && (
                  <TableFooter>
                    <TableRow>{tablePagination()}</TableRow>
                  </TableFooter>
                )}
              </Table>
            </TableContainer>

            {isLoading && <Spinner />}
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
          isAdding ? speciesContext.createSpecies : speciesContext.editSpecies
        }
        loadSpeciesList={speciesContext.loadSpeciesList}
        data={sortedSpeciesList}
      />
      <DeleteDialog
        speciesEdit={speciesEdit}
        setSpeciesEdit={setSpeciesEdit}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteSpecies={speciesContext.deleteSpecies}
        loadSpeciesList={speciesContext.loadSpeciesList}
      />
      <CombineModal
        show={showCombine}
        setShow={setShowCombine}
        data={sortedSpeciesList}
        combineSpecies={speciesContext.combineSpecies}
        loadSpeciesList={speciesContext.loadSpeciesList}
        selected={selected}
        styles={{ ...classes }}
      />
    </Grid>
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
  const [error, setError] = useState(undefined);
  // const nameSpecies = data.map((species) => species.name.toLowerCase());

  const onNameChange = (e) => {
    setError(undefined);
    setSpeciesEdit({ ...speciesEdit, name: e.target.value });
  };

  const onDescChange = (e) => {
    setSpeciesEdit({ ...speciesEdit, desc: e.target.value });
  };

  const handleEditDetailClose = () => {
    setError(undefined);
    setIsEdit(false);
    setSpeciesEdit(undefined);
  };

  const handleSave = async () => {
    // log.debug('speciesEdit -- ', speciesEdit);
    const editName = speciesEdit.name.toLowerCase().trim();
    const otherSpeciesList = isEdit
      ? data.filter((species) => Number(species.id) !== speciesEdit.id)
      : data;
    const nameSpecies = otherSpeciesList.map((species) =>
      species.name.toLowerCase()
    );
    if (nameSpecies.includes(editName)) {
      setError('Species already exists');
    } else {
      setError(undefined);
      setIsEdit(false);
      await editSpecies({
        id: speciesEdit.id,
        name: speciesEdit.name || '',
        desc: speciesEdit.desc || '', // need default value for desc to prevent error
      });
      loadSpeciesList(true);
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
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

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
    loadSpeciesList(true);
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
    loadSpeciesList(true);
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

export default withStyles(styles)(SpeciesTable);
