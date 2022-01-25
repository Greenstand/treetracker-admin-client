import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Checkbox,
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
  DialogContentText,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import SortIcon from '@material-ui/icons/Sort';
import Menu from './common/Menu';
import { withStyles } from '@material-ui/core/styles';
import { RegionContext } from '../context/RegionContext';
import CustomTable from './common/CustomTable/CustomTable';

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
  const regionContext = useContext(RegionContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [regionEdit, setRegionEdit] = useState(undefined);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortedRegionList, setSortedRegionList] = useState([]);
  const [option, setOption] = useState(sortOptions.byName);
  const [selected, setSelected] = useState([]);

  const tableRef = useRef(null);

  useEffect(() => {
    const sortBy = (option) => {
      let sortedSpecies;
      if (option === sortOptions.byId) {
        sortedSpecies = [...regionContext.regions].sort(
          (a, b) => a[option] - b[option]
        );
      }
      if (option === sortOptions.byName) {
        sortedSpecies = [...regionContext.regions].sort((a, b) =>
          a[option].localeCompare(b[option])
        );
      }
      setSortedRegionList(sortedSpecies);
    };
    sortBy(option);
  }, [option, sortOptions.byId, sortOptions.byName, regionContext.regions]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    tableRef.current && tableRef.current.scrollIntoView();

    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (region) => {
    setRegionEdit(region);
    setIsEdit(true);
  };

  const openDeleteDialog = (region) => {
    setRegionEdit(region);
    setOpenDelete(true);
  };

  const handleSelect = (checked, id) => {
    if (checked) setSelected([...selected, id]);
    else setSelected(selected.filter((item) => item !== id));
  };

  const renderSpecies = () => {
    return (rowsPerPage > 0
      ? sortedRegionList.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : sortedRegionList
    ).map((region) => (
      <TableRow key={region.id} role="listitem">
        <TableCell>
          <Checkbox
            onChange={(e) => handleSelect(e.target.checked, region.id)}
            checked={selected.includes(region.id)}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {region.id}
        </TableCell>
        <TableCell component="th" scope="row" data-testid="region">
          {region.name}
        </TableCell>
        <TableCell>{region.desc}</TableCell>
        <TableCell>{region.captureCount}</TableCell>
        <TableCell>{region.captureCount}</TableCell>
        <TableCell>
          <IconButton title="edit" onClick={() => handleEdit(region)}>
            <Edit />
          </IconButton>
          <IconButton title="delete" onClick={() => openDeleteDialog(region)}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  const tablePagination = () => (
    <TablePagination
      count={regionContext.regions.length}
      rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
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

  // console.log('context', context);

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
                    <Typography variant="h2">Regions</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.addUserBox}>
                <Button
                  onClick={() => setIsAdding(true)}
                  variant="contained"
                  className={classes.addUser}
                  color="primary"
                >
                  ADD NEW REGION
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
                      <TableCell>Properties</TableCell>
                      <TableCell>Shown on Org Map</TableCell>
                      <TableCell>Statistics Calculated</TableCell>
                      <TableCell>Operations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderSpecies()}</TableBody>
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
        regionEdit={regionEdit}
        setRegionEdit={setRegionEdit}
        styles={{ ...classes }}
        editSpecies={
          isAdding ? regionContext.createRegion : regionContext.updateRegion
        }
        loadSpeciesList={regionContext.load}
        data={sortedRegionList}
      />
      <DeleteDialog
        regionEdit={regionEdit}
        setRegionEdit={setRegionEdit}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteSpecies={regionContext.deleteSpecies}
        loadSpeciesList={regionContext.load}
      />
    </>
  );
};

const EditModal = ({
  isEdit,
  setIsEdit,
  regionEdit,
  setRegionEdit,
  styles,
  loadSpeciesList,
  editSpecies,
  data,
}) => {
  const [error, setError] = useState(undefined);
  const [errors, setErrors] = useState({
    name: undefined,
    tag: undefined,
  });
  const [id] = useState(regionEdit?.id || undefined);
  const [name, setName] = useState(regionEdit?.name || undefined);
  const [propTag, setPropTag] = useState(undefined);
  const [show, setShow] = useState(true);
  const [calc, setCalc] = useState(true);
  const [geojson, setGeoJson] = useState(undefined);
  const [shape, setShape] = useState(undefined);
  // const nameSpecies = data.map((region) => region.name.toLowerCase());

  const onNameChange = (e) => {
    setError(undefined);
    setName(e.target.value);
  };

  const onPropChange = (e) => {
    setPropTag(e.target.value);
  };

  const onShowChange = (e) => {
    console.log(e.target.checked);
    setShow(e.target.checked);
  };

  const onCalcChange = (e) => {
    setCalc(e.target.checked);
  };

  const onFileChange = (e) => {
    const fileread = new FileReader();
    fileread.onload = function (e) {
      const content = e.target.result;
      const json = JSON.parse(content);
      setShape(json);
    };
    fileread.readAsText(e.target.files[0]);
    setGeoJson(e.target.value);
  };

  const handleEditDetailClose = () => {
    setError(undefined);
    setIsEdit(false);
    setRegionEdit(undefined);
  };

  const handleSave = async () => {
    if (!name) {
      setErrors((prev) => {
        return { ...prev, name: 'Please designate a name for your region.' };
      });
    } else if (!propTag && shape.type === 'FeatureCollection') {
      setErrors((prev) => {
        return { ...prev, tag: 'Please designate a tag for your subregions.' };
      });
    } else {
      // console.log('regionEdit -- ', regionEdit);
      // const editName = regionEdit.name.toLowerCase().trim();
      // const otherSpeciesList = isEdit
      //   ? data.filter((region) => Number(region.id) !== regionEdit.id)
      //   : data;
      // const nameSpecies = otherSpeciesList.map((region) =>
      //   region.name.toLowerCase(),
      // );
      // if (nameSpecies.includes(editName)) {
      //   setError('Species already exists');
      // } else {
      setError(undefined);
      setIsEdit(false);
      await editSpecies({
        id,
        name: name || '',
        nameKey: propTag || '',
        shape,
        showOnOrgMap: show,
        calculateStatistics: calc,
      });
      loadSpeciesList(true);
      setRegionEdit(undefined);
    }
  };

  return (
    <Dialog open={isEdit} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Region Detail</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item className={styles.name}>
            <TextField
              error={errors.name ? true : false}
              helperText={errors.name}
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
              onChange={onNameChange}
            />
          </Grid>
          <Grid item className={styles.desc}>
            <TextField
              error={errors.tag ? true : false}
              helperText={errors.tag}
              id="desc"
              label="Properties Tag for Subregion Name"
              type="text"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={propTag}
              className={styles.input}
              onChange={onPropChange}
            />
          </Grid>
          <FormGroup row={true}>
            <FormControlLabel
              control={
                <Switch defaultChecked checked={show} onChange={onShowChange} />
              }
              label="Show on Organization Map"
            />
            <FormControlLabel
              control={
                <Switch defaultChecked checked={calc} onChange={onCalcChange} />
              }
              label="Calculate Statistics"
            />
          </FormGroup>
          <input type="file" value={geojson} onChange={onFileChange}></input>
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

const DeleteDialog = ({
  regionEdit,
  setRegionEdit,
  openDelete,
  setOpenDelete,
  deleteSpecies,
  loadSpeciesList,
}) => {
  const handleDelete = async () => {
    await deleteSpecies({ id: regionEdit.id });
    loadSpeciesList(true);
    setOpenDelete(false);
    setRegionEdit(undefined);
  };

  const closeDelete = () => {
    setOpenDelete(false);
    setRegionEdit(undefined);
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
