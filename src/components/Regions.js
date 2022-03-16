import React, { useState, useEffect, useRef, useContext } from 'react';
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
  FormGroup,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import SortIcon from '@material-ui/icons/Sort';
import Menu from './common/Menu';
import { withStyles } from '@material-ui/core/styles';
import { RegionContext } from '../context/RegionContext';
import { AppContext } from '../context/AppContext';
import { getOrganizationUUID } from '../api/apiUtils';

const styles = (theme) => ({
  regionsTableContainer: {
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
  owner: {
    width: 150,
    marginRight: theme.spacing(1),
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

const RegionTable = (props) => {
  const { classes } = props;
  const sortOptions = { byId: 'id', byName: 'name' };
  const {
    regions,
    currentPage,
    pageSize,
    changeCurrentPage,
    changePageSize,
    changeSort,
    regionCount,
    loadRegions,
    createRegion,
    updateRegion,
    deleteRegion,
  } = useContext(RegionContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [regionEdit, setRegionEdit] = useState(undefined);
  const [openDelete, setOpenDelete] = useState(false);

  const tableRef = useRef(null);

  const handleChangeCurrentPage = (event) => {
    tableRef.current && tableRef.current.scrollIntoView();
    changeCurrentPage(Number(event.target.value));
  };

  const handleChangeRowsPerPage = (event) => {
    changePageSize(Number(event.target.value));
    handleChangeCurrentPage(0);
  };

  const handleEdit = (region) => {
    setRegionEdit(region);
    setIsEdit(true);
  };

  const renderRegion = () => {
    return regions.map((region) => (
      <TableRow key={region.id} role="listitem">
        {/* <TableCell>
          <Checkbox
            onChange={(e) => handleSelect(e.target.checked, region.id)}
            checked={selected.includes(region.id)}
          />
        </TableCell> */}
        <TableCell component="th" scope="row">
          {region.id}
        </TableCell>
        <TableCell component="th" scope="row" data-testid="region">
          {region.name}
        </TableCell>
        <TableCell>
          {region.properties ? JSON.stringify(region.properties) : ''}
        </TableCell>
        <TableCell>{region.show_on_org_map ? 'Yes' : 'No'}</TableCell>
        <TableCell>{region.calculate_statistics ? 'Yes' : 'No'}</TableCell>
        <TableCell>
          <IconButton title="edit" onClick={() => handleEdit(region)}>
            <Edit />
          </IconButton>
          {/* <IconButton title="delete" onClick={() => openDeleteDialog(region)}>
            <Delete />
          </IconButton> */}
        </TableCell>
      </TableRow>
    ));
  };

  const tablePagination = () => (
    <TablePagination
      count={Number(regionCount)}
      rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
      colSpan={3}
      page={currentPage}
      rowsPerPage={pageSize}
      onChangePage={handleChangeCurrentPage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
    />
  );

  return (
    <>
      <Grid container className={classes.regionsTableContainer}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>

        <Grid item container className={classes.rightBox}>
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
                      {/* <TableCell></TableCell> */}
                      <TableCell>
                        ID
                        <IconButton
                          title="sortbyId"
                          onClick={() => changeSort(sortOptions.byId)}
                        >
                          <SortIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        name
                        <IconButton
                          title="sortbyName"
                          onClick={() => changeSort(sortOptions.byName)}
                        >
                          <SortIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>Properties</TableCell>
                      <TableCell>Shown on Org Map</TableCell>
                      <TableCell>Statistics Calculated</TableCell>
                      <TableCell>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderRegion()}</TableBody>
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
        isAdding={isAdding}
        setIsEdit={isAdding ? setIsAdding : setIsEdit}
        regionEdit={regionEdit}
        setRegionEdit={setRegionEdit}
        styles={{ ...classes }}
        editRegion={isAdding ? createRegion : updateRegion}
        loadRegionList={loadRegions}
        data={regions}
      />
      <DeleteDialog
        regionEdit={regionEdit}
        setRegionEdit={setRegionEdit}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteRegion={deleteRegion}
        loadRegionList={loadRegions}
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
  loadRegionList,
  editRegion,
  isAdding,
}) => {
  const [errors, setErrors] = useState({
    name: undefined,
    tag: undefined,
  });
  const [id, setId] = useState(undefined);
  const [ownerId, setOwnerId] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [propTag, setPropTag] = useState(undefined);
  const [show, setShow] = useState(true);
  const [calc, setCalc] = useState(true);
  const [geojson, setGeoJson] = useState(undefined);
  const [shape, setShape] = useState(undefined);
  // const nameRegion = data.map((region) => region.name.toLowerCase());
  const { orgList, userHasOrg } = useContext(AppContext);

  useEffect(() => {
    setShape(undefined);
    setGeoJson(undefined);
    if (regionEdit) {
      setId(regionEdit.id);
      setOwnerId(regionEdit.owner_id);
      setName(regionEdit.name);
      setPropTag(regionEdit.prop_tag);
      setShow(regionEdit.show_on_org_map);
      setCalc(regionEdit.calculate_statistics);
    } else {
      setId(undefined);
      setOwnerId(getOrganizationUUID());
      setName(undefined);
      setPropTag(undefined);
      setShow(true);
      setCalc(true);
    }
  }, [regionEdit]);
  const onOwnerChange = (e) => {
    setOwnerId(e.target.value);
    setErrors((prev) => ({
      ...prev,
      owner: undefined,
    }));
  };

  const onNameChange = (e) => {
    setName(e.target.value);
    setErrors((prev) => ({
      ...prev,
      name: undefined,
    }));
  };

  const onPropChange = (e) => {
    setPropTag(e.target.value);
    setErrors((prev) => ({
      ...prev,
      propTag: undefined,
    }));
  };

  const onShowChange = (e) => {
    setShow(e.target.checked);
  };

  const onCalcChange = (e) => {
    setCalc(e.target.checked);
  };

  // TO DO: add try-catch for validation
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
    setIsEdit(false);
    setRegionEdit(undefined);
  };

  const handleSave = async () => {
    let hasError = false;
    if (!ownerId) {
      hasError = true;
      setErrors((prev) => {
        return { ...prev, owner: 'Please select an owner for your region.' };
      });
    }
    if (name) {
      // const editName = regionEdit.name.toLowerCase().trim();
      // const otherRegionList = isEdit
      //   ? data.filter((region) => Number(region.id) !== regionEdit.id)
      //   : data;
      // const nameRegion = otherRegionList.map((region) =>
      //   region.name.toLowerCase(),
      // );
      // if (nameRegion.includes(editName)) {
      //   setErrors((prev) => {
      //  return { ...prev, name: 'Name already exists'};
      ///});
    } else {
      hasError = true;
      setErrors((prev) => {
        return { ...prev, name: 'Please designate a name for your region.' };
      });
    }
    if (!propTag && shape?.type === 'FeatureCollection') {
      hasError = true;
      setErrors((prev) => {
        return { ...prev, tag: 'Please designate a tag for your subregions.' };
      });
    }

    if (!hasError) {
      setIsEdit(false);
      await editRegion({
        id,
        ownerId,
        name: name || '',
        nameKey: propTag || '',
        shape,
        showOnOrgMap: show,
        calculateStatistics: calc,
      });
      loadRegionList(true);
      setRegionEdit(undefined);
    }
  };

  return (
    <Dialog open={isEdit || isAdding} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Region Detail</DialogTitle>
      <DialogContent>
        <Grid container>
          {!userHasOrg && (
            <Grid item className={styles.owner}>
              <TextField
                error={errors.owner ? true : false}
                helperText={errors.owner}
                select
                className={styles.input}
                id="owner"
                label="Owner"
                value={ownerId || ''}
                onChange={onOwnerChange}
                fullWidth
              >
                {orgList.length &&
                  orgList.map((org) => (
                    <MenuItem
                      key={org.stakeholder_uuid}
                      value={org.stakeholder_uuid}
                    >
                      {org.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          )}

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
              value={name || ''}
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
              value={propTag || ''}
              className={styles.input}
              onChange={onPropChange}
            />
          </Grid>
          <FormGroup row={true}>
            <FormControlLabel
              control={<Switch checked={show} onChange={onShowChange} />}
              label="Show on Organization Map"
            />
            <FormControlLabel
              control={<Switch checked={calc} onChange={onCalcChange} />}
              label="Calculate Statistics"
            />
          </FormGroup>
          <input
            hidden={isEdit}
            type="file"
            value={geojson || ''}
            onChange={onFileChange}
            accept=".json,.geojson"
          ></input>
        </Grid>
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
  deleteRegion,
  loadRegionList,
}) => {
  const handleDelete = async () => {
    await deleteRegion({ id: regionEdit.id });
    loadRegionList(true);
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

export default withStyles(styles)(RegionTable);
