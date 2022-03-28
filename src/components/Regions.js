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
  Tooltip,
  Input,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
// import SortIcon from '@material-ui/icons/Sort';
import Delete from '@material-ui/icons/Delete';
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
    width: 170,
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
  // const sortOptions = { byId: 'id', byName: 'name' };
  const {
    regions,
    currentPage,
    pageSize,
    changeCurrentPage,
    changePageSize,
    // changeSort,
    regionCount,
    loadRegions,
    createRegion,
    updateRegion,
    deleteRegion,
  } = useContext(RegionContext);
  const { orgList, userHasOrg } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [regionEdit, setRegionEdit] = useState(undefined);
  const [openDelete, setOpenDelete] = useState(false);

  const tableRef = useRef(null);

  const handleChangeCurrentPage = (event, value) => {
    tableRef.current && tableRef.current.scrollIntoView();
    changeCurrentPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    changePageSize(Number(event.target.value));
    changeCurrentPage(0);
  };

  const handleEdit = (region) => {
    setRegionEdit(region);
    setIsEdit(true);
  };

  const handleDelete = (region) => {
    setRegionEdit(region);
    setOpenDelete(true);
  };

  const renderRegionProperties = (region, max = 0) => {
    return Object.keys(region.properties || {}).map((key, idx) => {
      if (max === 0 || idx < max)
        return (
          <Grid key={`prop_${region.id}_${key}_${max}`}>
            <span>
              <b>{key}:</b>
            </span>
            &nbsp;
            <span>{JSON.stringify(region.properties[key])}</span>
            {max > 0 && idx === max - 1 && <span>&nbsp;&hellip;</span>}
          </Grid>
        );
    });
  };

  const renderRegions = () => {
    return regions.map((region) => (
      <TableRow key={region.id} role="listitem">
        {/* <TableCell>
          <Checkbox
            onChange={(e) => handleSelect(e.target.checked, region.id)}
            checked={selected.includes(region.id)}
          />
        </TableCell> */}
        <Tooltip title={region.id}>
          <TableCell component="th" scope="row">
            {`${(region.id + '').substring(0, 9)}`}&hellip;
          </TableCell>
        </Tooltip>
        <TableCell component="th" scope="row" data-testid="region">
          {region.name}
        </TableCell>
        {!userHasOrg && (
          <TableCell>
            {
              orgList.find((org) => org.stakeholder_uuid === region.owner_id)
                ?.name
            }
          </TableCell>
        )}
        <Tooltip title={renderRegionProperties(region)}>
          <TableCell>{renderRegionProperties(region, 4)}</TableCell>
        </Tooltip>
        <TableCell align="center">
          {region.show_on_org_map ? 'Yes' : 'No'}
        </TableCell>
        <TableCell align="center">
          {region.calculate_statistics ? 'Yes' : 'No'}
        </TableCell>
        <TableCell align="center">
          <IconButton title="edit" onClick={() => handleEdit(region)}>
            <Edit />
          </IconButton>
          <IconButton title="delete" onClick={() => handleDelete(region)}>
            <Delete />
          </IconButton>
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
                  UPLOAD REGION
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="column" className={classes.bodyBox}>
              <TableContainer component={Paper} ref={tableRef}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        ID
                        {/* <IconButton
                          title="sortbyId"
                          onClick={() => changeSort(sortOptions.byId)}
                        >
                          <SortIcon />
                        </IconButton> */}
                      </TableCell>
                      <TableCell>
                        Name
                        {/* <IconButton
                          title="sortbyName"
                          onClick={() => changeSort(sortOptions.byName)}
                        >
                          <SortIcon />
                        </IconButton> */}
                      </TableCell>
                      {!userHasOrg && <TableCell>Owner</TableCell>}
                      <TableCell>Properties</TableCell>
                      <TableCell align="center">Shown on Org Map</TableCell>
                      <TableCell align="center">
                        Statistics Calculated
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderRegions()}</TableBody>
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
  const [regionNameProperty, setRegionNameProperty] = useState(undefined);
  const [show, setShow] = useState(true);
  const [calc, setCalc] = useState(true);
  const [geojson, setGeoJson] = useState(undefined);
  const [shape, setShape] = useState(undefined);
  const { orgList, userHasOrg } = useContext(AppContext);

  useEffect(() => {
    setShape(undefined);
    setGeoJson(undefined);
    setRegionNameProperty(undefined);
    if (regionEdit) {
      setId(regionEdit.id);
      setOwnerId(regionEdit.owner_id);
      setName(regionEdit.name);
      setShow(regionEdit.show_on_org_map);
      setCalc(regionEdit.calculate_statistics);
    } else {
      setId(undefined);
      setOwnerId(getOrganizationUUID());
      setName(undefined);
      setRegionNameProperty(undefined);
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

  const onRegionNamePropertyChange = (e) => {
    setRegionNameProperty(e.target.value);
    setErrors((prev) => ({
      ...prev,
      name: undefined,
    }));
  };

  const onShowChange = (e) => {
    setShow(e.target.checked);
  };

  const onCalcChange = (e) => {
    setCalc(e.target.checked);
  };

  const onFileChange = (e) => {
    setErrors((prev) => ({
      ...prev,
      shape: undefined,
    }));
    const fileread = new FileReader();
    try {
      fileread.onload = function (e) {
        const content = e.target.result;
        const json = JSON.parse(content);
        setShape(json);
      };
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        shape: `Failed to process shape file: ${error}`,
      }));
    }
    fileread.readAsText(e.target.files[0]);
    setGeoJson(e.target.value);
  };

  const handleEditDetailClose = () => {
    setIsEdit(false);
    setRegionEdit(undefined);
  };

  const handleSave = async () => {
    let hasError = false;
    if (isAdding) {
      if (!shape) {
        hasError = true;
        setErrors((prev) => {
          return { ...prev, shape: 'Please select a shape file.' };
        });
      } else if (!regionNameProperty) {
        hasError = true;
        setErrors((prev) => {
          return { ...prev, name: 'Please select a region name property.' };
        });
      }
    }

    if (isEdit && !name) {
      hasError = true;
      setErrors((prev) => {
        return { ...prev, name: 'Please enter a name for the region.' };
      });
    }

    if (!hasError) {
      try {
        await editRegion({
          id,
          ownerId,
          name,
          regionNameProperty: regionNameProperty,
          shape,
          showOnOrgMap: show,
          calculateStatistics: calc,
        });
        setIsEdit(false);
        loadRegionList(true);
        setRegionEdit(undefined);
      } catch (error) {
        // TO DO - report the error details
        alert(`Upload failed`);
      }
    }
  };

  return (
    <Dialog open={isEdit || isAdding} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isEdit ? 'Edit Region' : 'Upload Region'}
      </DialogTitle>
      <DialogContent>
        {isAdding && (
          <Grid item className={styles.input}>
            <Input
              type="file"
              value={geojson || ''}
              onChange={onFileChange}
              inputProps={{
                accept: '.json,.geojson',
              }}
              error={errors.shape ? true : false}
            />
          </Grid>
        )}
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

          <Grid item>
            {isEdit ? (
              <TextField
                error={errors.name ? true : false}
                helperText={errors.name}
                id="name"
                label="Region Name"
                type="text"
                variant="outlined"
                fullWidth
                value={name || ''}
                className={styles.input}
                onChange={onNameChange}
              />
            ) : (
              <TextField
                select
                error={errors.name ? true : false}
                helperText={errors.name}
                id="prop"
                label="Region Name Property"
                type="text"
                variant="outlined"
                fullWidth
                value={regionNameProperty || ''}
                className={styles.input}
                onChange={onRegionNamePropertyChange}
                disabled={!shape?.properties}
              >
                {Object.keys(shape?.properties || {}).map((prop) => (
                  <MenuItem key={prop} value={prop}>
                    {prop}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
    try {
      await deleteRegion({ id: regionEdit.id });
    } catch (error) {
      alert(`Delete region failed: ${error}`);
    }
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
