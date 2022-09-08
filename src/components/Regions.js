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
  CircularProgress,
  Snackbar,
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Edit, Close, CloudDownload, Delete, Map } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { RegionContext } from '../context/RegionContext';
import { AppContext } from '../context/AppContext';
import { getOrganizationUUID } from '../api/apiUtils';
import Menu from './common/Menu';
import Spinner from './common/Spinner';

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
    color: 'gray',
  },
  headerButtonBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload: {
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
  operations: {
    whiteSpace: 'nowrap',
  },
});

const RegionTable = (props) => {
  const { classes } = props;
  // const sortOptions = { byName: 'name' };
  const {
    regions,
    collections,
    currentPage,
    pageSize,
    showCollections,
    changeCurrentPage,
    changePageSize,
    // changeSort,
    setShowCollections,
    regionCount,
    collectionCount,
    upload,
    updateRegion,
    updateCollection,
    deleteRegion,
    deleteCollection,
    isLoading,
  } = useContext(RegionContext);
  const { orgList, userHasOrg } = useContext(AppContext);
  const [openEdit, setOpenEdit] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMesssage] = useState('');
  useEffect(() => {
    if (!openDelete && !openEdit) {
      // Wait for the dialog to disappear before clearing the selected item.
      setTimeout(() => {
        setSelectedItem(undefined);
        setIsUpload(false);
      }, 300);
    }
  }, [openDelete, openEdit]);

  const tableRef = useRef(null);

  const handleChangeCurrentPage = (event, value) => {
    tableRef.current && tableRef.current.scrollIntoView();
    changeCurrentPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    changePageSize(Number(event.target.value));
    changeCurrentPage(0);
  };

  const handleEdit = (item, isCollection) => {
    setSelectedItem({
      ...item,
      isCollection,
    });
    setOpenEdit(true);
  };

  const handleDelete = (item, isCollection) => {
    setSelectedItem({
      ...item,
      isCollection,
    });
    setOpenDelete(true);
  };

  const handleChangeShowCollections = (event, val) => {
    if (val !== null) {
      setShowCollections(val);
    }
  };

  const handleUploadClick = () => {
    setIsUpload(true);
    setOpenEdit(true);
  };

  const handleDownload = async (item) => {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/${item.shape}`;
    console.log('item', item);
    const result = await fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        // Authorization: session.token,
      },
    });
    if (!result.ok) {
      console.error(
        `There has been an error status ${result.status} on a fetch request to ${query}`
      );
      return;
    }
    location.replace(result.url);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    setSnackbarMesssage('');
  };

  const showSnackbar = (message) => {
    setSnackbarMesssage(message);
    setSnackbarOpen(true);
  };

  const RegionProperties = ({ region, max = 0 }) => {
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

  const RegionTableRows = () => {
    return (showCollections ? collections : regions).map((item) => (
      <TableRow key={item.id} role="listitem">
        {/* <TableCell>
          <Checkbox
            onChange={(e) => handleSelect(e.target.checked, region.id)}
            checked={selected.includes(region.id)}
          />
        </TableCell> */}
        <TableCell component="th" scope="row" data-testid="region">
          {item.name}
        </TableCell>
        {!userHasOrg && (
          <TableCell>
            {orgList.find((org) => org.stakeholder_uuid === item.owner_id)
              ?.name || '---'}
          </TableCell>
        )}
        {!showCollections && (
          <>
            <TableCell>{item.collection_name || '---'}</TableCell>
            <Tooltip title={<RegionProperties region={item} />}>
              <TableCell>
                <RegionProperties region={item} max={3} />
              </TableCell>
            </Tooltip>
            <TableCell align="center">
              {item.show_on_org_map ? 'Yes' : 'No'}
            </TableCell>
            <TableCell align="center">
              {item.calculate_statistics ? 'Yes' : 'No'}
            </TableCell>
          </>
        )}
        <TableCell align="right" className={classes.operations}>
          <IconButton title="download" onClick={() => handleDownload(item)}>
            <CloudDownload />
          </IconButton>
          <IconButton
            title="edit"
            onClick={() => handleEdit(item, showCollections)}
          >
            <Edit />
          </IconButton>
          <IconButton
            title="delete"
            onClick={() => handleDelete(item, showCollections)}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  const RegionTablePagination = () => (
    <TablePagination
      count={Number(showCollections ? collectionCount : regionCount)}
      rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
      page={currentPage}
      rowsPerPage={pageSize}
      onPageChange={handleChangeCurrentPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
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
              justifyContent="space-between"
              className={classes.titleBox}
            >
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Map className={classes.accountIcon} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h2">Regions</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.headerButtonBox}>
                <ToggleButtonGroup
                  color="primary"
                  value={showCollections}
                  exclusive
                  onChange={handleChangeShowCollections}
                >
                  <ToggleButton value={false}>Regions</ToggleButton>
                  <ToggleButton value={true}>Collections</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item className={classes.headerButtonBox}>
                <Button
                  onClick={handleUploadClick}
                  variant="contained"
                  className={classes.upload}
                  color="primary"
                >
                  UPLOAD
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="column" className={classes.bodyBox}>
              <TableContainer component={Paper} ref={tableRef}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
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
                      {!showCollections && (
                        <>
                          <TableCell>Collection</TableCell>
                          <TableCell>Properties</TableCell>
                          <TableCell align="center">Shown on Org Map</TableCell>
                          <TableCell align="center">
                            Statistics Calculated
                          </TableCell>
                        </>
                      )}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <RegionTableRows />
                  </TableBody>
                  {!isLoading && (
                    <TableFooter>
                      <TableRow>
                        <RegionTablePagination />
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </TableContainer>

              {isLoading && <Spinner />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <EditModal
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        isUpload={isUpload}
        selectedItem={selectedItem}
        styles={{ ...classes }}
        upload={upload}
        updateRegion={updateRegion}
        updateCollection={updateCollection}
        showSnackbar={showSnackbar}
      />
      <DeleteDialog
        selectedItem={selectedItem}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteRegion={deleteRegion}
        deleteCollection={deleteCollection}
        showSnackbar={showSnackbar}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
};

const EditModal = ({
  openEdit,
  setOpenEdit,
  isUpload,
  selectedItem,
  styles,
  upload,
  updateRegion,
  updateCollection,
  showSnackbar,
}) => {
  const [errors, setErrors] = useState({});
  const [id, setId] = useState(undefined);
  const [ownerId, setOwnerId] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [regionNameProperty, setRegionNameProperty] = useState(undefined);
  const [show, setShow] = useState(true);
  const [calc, setCalc] = useState(true);
  const [geojson, setGeoJson] = useState(undefined);
  const [shape, setShape] = useState(undefined);
  const [isCollection, setIsCollection] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [shapeProperties, setShapeProperties] = useState([]);
  const { orgList, userHasOrg } = useContext(AppContext);

  const reset = () => {
    setShape(undefined);
    setGeoJson(undefined);
    setRegionNameProperty(undefined);
    setId(undefined);
    setName(undefined);
    setRegionNameProperty(undefined);
    setShow(true);
    setCalc(true);
    setIsCollection(false);
    setOwnerId(undefined);
    setErrors({});
  };

  useEffect(() => {
    reset();
    if (selectedItem) {
      setId(selectedItem.id);
      setOwnerId(selectedItem.owner_id);
      setName(selectedItem.name);
      if (selectedItem.isCollection) {
        setIsCollection(true);
      } else {
        setShow(selectedItem.show_on_org_map);
        setCalc(selectedItem.calculate_statistics);
      }
    } else {
      setOwnerId(getOrganizationUUID());
    }
  }, [selectedItem]);

  useEffect(() => {
    if (shape?.type?.endsWith('Collection')) {
      setIsCollection(true);
      setShapeProperties(
        (shape?.features || []).reduce((props, feature) => {
          return [
            ...new Set([...props, ...Object.keys(feature.properties || {})]),
          ];
        }, [])
      );
    } else {
      setShapeProperties(shape?.properties || []);
    }
  }, [shape]);

  useEffect(() => {
    // Auto-set to "name" if present
    const nameProp = shapeProperties?.find(
      (prop) => prop.toLowerCase() === 'name'
    );
    if (nameProp) {
      setRegionNameProperty(nameProp);
    }
  }, [shapeProperties]);

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
    setOpenEdit(false);
  };

  const handleSave = async () => {
    let hasError = false;
    if (isUpload) {
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

    if ((!isUpload || isCollection) && !name) {
      hasError = true;
      setErrors((prev) => {
        return {
          ...prev,
          name: `Please enter a name for the ${
            isCollection ? 'collection' : 'region'
          }.`,
        };
      });
    }

    if (!hasError) {
      setSaveInProgress(true);
      let res;
      try {
        if (isUpload) {
          res = await upload({
            id,
            owner_id: ownerId,
            collection_name: isCollection ? name : undefined,
            region_name_property: regionNameProperty,
            shape,
            show_on_org_map: show,
            calculate_statistics: calc,
          });
        } else {
          if (isCollection) {
            res = await updateCollection({
              id,
              owner_id: ownerId,
              name,
            });
          } else {
            res = await updateRegion({
              id,
              owner_id: ownerId,
              name,
              show_on_org_map: show,
              calculate_statistics: calc,
            });
          }
        }

        if (res?.error) {
          throw res.message;
        } else {
          showSnackbar(
            `${isCollection ? 'Collection' : res?.region?.name} ${
              isUpload ? 'uploaded' : 'updated'
            }`
          );
          setOpenEdit(false);
        }
      } catch (error) {
        // TO DO - report the error details
        alert(`Upload failed: ${error}`);
      }
      setSaveInProgress(false);
    }
  };

  return (
    <Dialog open={openEdit} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isUpload
          ? 'Upload New Region or Collection'
          : `Edit ${isCollection ? 'Collection' : 'Region'}`}
      </DialogTitle>
      <DialogContent>
        {isUpload && (
          <>
            <Grid container>
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
            </Grid>
            {shape && (
              <Grid container>
                <Grid item className={styles.input}>
                  <Typography>
                    {isCollection ? 'Collection' : 'Region'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </>
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
                <MenuItem key={'null'} value={null}>
                  No owner
                </MenuItem>
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
            {(!isUpload || isCollection) && (
              <TextField
                error={errors.name ? true : false}
                helperText={errors.name}
                id="name"
                label={`${isCollection ? 'Collection' : 'Region'} Name`}
                type="text"
                variant="outlined"
                fullWidth
                value={name || ''}
                className={styles.input}
                onChange={onNameChange}
              />
            )}
            {isUpload && (
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
              >
                {shapeProperties.length ? (
                  shapeProperties.map((prop) => (
                    <MenuItem key={prop} value={prop}>
                      {prop}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem key={'null'} value={null}>
                    No properties found
                  </MenuItem>
                )}
              </TextField>
            )}
          </Grid>
          {!isCollection && (
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
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDetailClose} disabled={saveInProgress}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saveInProgress}
        >
          {saveInProgress ? (
            <CircularProgress size={21} />
          ) : isUpload ? (
            'Upload'
          ) : (
            'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({
  selectedItem,
  openDelete,
  setOpenDelete,
  deleteRegion,
  deleteCollection,
  showSnackbar,
}) => {
  const handleDelete = async () => {
    try {
      let res;
      if (selectedItem.isCollection) {
        res = await deleteCollection(selectedItem.id);
      } else {
        res = await deleteRegion(selectedItem.id);
      }
      if (res?.error) {
        throw res.message;
      } else {
        showSnackbar(
          `${
            selectedItem.isCollection
              ? res?.collection?.name
              : res?.region?.name
          } deleted`
        );
        setOpenDelete(false);
      }
    } catch (error) {
      alert(`Failed to delete item: ${error}`);
    }
  };

  const closeDelete = () => {
    setOpenDelete(false);
  };

  return (
    <Dialog
      open={openDelete}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are you sure you want to delete ${selectedItem?.name}?`}
      </DialogTitle>
      <DialogActions>
        <Button onClick={closeDelete} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(RegionTable);
