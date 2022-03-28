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
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
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
  operations: {
    whiteSpace: 'nowrap',
  },
});

const RegionTable = (props) => {
  const { classes } = props;
  // const sortOptions = { byId: 'id', byName: 'name' };
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
  } = useContext(RegionContext);
  const { orgList, userHasOrg } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
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

  const handleEdit = (item, isCollection) => {
    setSelectedItem({
      ...item,
      isCollection,
    });
    setIsEdit(true);
  };

  const handleDelete = (item, isCollection) => {
    setSelectedItem({
      ...item,
      isCollection,
    });
    setOpenDelete(true);
  };

  const handleChangeShowCollections = (event, val) => {
    setShowCollections(val);
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
        <Tooltip title={item.id}>
          <TableCell component="th" scope="row">
            {`${(item.id + '').substring(0, 9)}`}&hellip;
          </TableCell>
        </Tooltip>
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
            <TableCell>{item.collectionName || '---'}</TableCell>
            <Tooltip title={<RegionProperties region={item} />}>
              <TableCell>
                <RegionProperties region={item} max={4} />
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
                  onClick={() => setIsUpload(true)}
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
                  <TableFooter>
                    <TableRow>
                      <RegionTablePagination />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <EditModal
        isEdit={isEdit}
        isUpload={isUpload}
        setIsEdit={isUpload ? setIsUpload : setIsEdit}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        styles={{ ...classes }}
        upload={upload}
        updateRegion={updateRegion}
        updateCollection={updateCollection}
      />
      <DeleteDialog
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        deleteRegion={deleteRegion}
        deleteCollection={deleteCollection}
      />
    </>
  );
};

const EditModal = ({
  isEdit,
  setIsEdit,
  isUpload,
  selectedItem,
  setSelectedItem,
  styles,
  upload,
  updateRegion,
  updateCollection,
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
  const [isCollection, setIsCollection] = useState(false);
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
    }
  }, [shape]);

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
    setSelectedItem(undefined);
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

    if ((isEdit || isCollection) && !name) {
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
      try {
        if (isUpload) {
          await upload({
            id,
            ownerId,
            collectionName: isCollection ? name : undefined,
            regionNameProperty,
            shape,
            showOnOrgMap: show,
            calculateStatistics: calc,
          });
        } else {
          if (isCollection) {
            await updateCollection({
              id,
              ownerId,
              name,
            });
          } else {
            await updateRegion({
              id,
              ownerId,
              name,
              showOnOrgMap: show,
              calculateStatistics: calc,
            });
          }
        }
        setIsEdit(false);
        setSelectedItem(undefined);
      } catch (error) {
        // TO DO - report the error details
        alert(`Upload failed`);
      }
    }
  };

  return (
    <Dialog open={isEdit || isUpload} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isEdit
          ? `Edit ${isCollection ? 'Collection' : 'Region'}`
          : 'Upload New Region or Collection'}
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
            {(isEdit || isCollection) && (
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
        <Button onClick={handleEditDetailClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isUpload ? 'Upload' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({
  selectedItem,
  setSelectedItem,
  openDelete,
  setOpenDelete,
  deleteRegion,
  deleteCollection,
}) => {
  const handleDelete = async () => {
    try {
      if (selectedItem.isCollection) {
        await deleteCollection({ id: selectedItem.id });
      } else {
        await deleteRegion({ id: selectedItem.id });
      }
    } catch (error) {
      alert(`Failed to delete item: ${error}`);
    }
    setOpenDelete(false);
    setSelectedItem(undefined);
  };

  const closeDelete = () => {
    setOpenDelete(false);
    setSelectedItem(undefined);
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
