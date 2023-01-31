import React, { useState, useContext, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  FormControlLabel,
  LinearProgress,
} from '@material-ui/core';
import { CapturesContext } from 'context/CapturesContext';
import { CSVLink } from 'react-csv';
import { formatCell } from './Captures/CaptureTable';

const useStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    padding: theme.spacing(0, 4),
  },
  textInput: {
    margin: theme.spacing(2, 1),
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(2),
  },
}));

const ExportCaptures = (props) => {
  const { isOpen, handleClose, columns, filter, speciesLookup } = props;
  const classes = useStyle();
  let nameColumns = {};
  columns.forEach(({ attr, renderer }) => {
    nameColumns[attr] = { status: true, renderer: renderer };
  });
  // checkboxes to choose download columns
  const [checkedColumns, setCheckColumns] = useState(nameColumns);
  const capturesContext = useContext(CapturesContext);
  const [downloadData, setDownloadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const csvLink = useRef();

  useEffect(() => {
    if (downloadData.length) {
      csvLink.current.link.click();
      handleClose();
    }
  }, [downloadData]);

  function handleChange(attr) {
    const newStatus = !checkedColumns[attr].status;
    setCheckColumns({
      ...checkedColumns,
      [attr]: { ...checkedColumns[attr], status: newStatus },
    });
  }

  function processDownloadData(captures, selectedColumns) {
    return captures.map((capture) => {
      let formattedCapture = {};
      Object.keys(selectedColumns).forEach((attr) => {
        if (['id', 'grower_account_id', 'imageUrl'].includes(attr)) {
          formattedCapture[attr] = capture[attr];
        } else {
          const renderer = selectedColumns[attr].renderer;
          formattedCapture[attr] = formatCell(
            capture,
            speciesLookup,
            attr,
            renderer
          );
        }
      });
      return formattedCapture;
    });
  }

  async function downloadCaptures() {
    setLoading(true);
    const filterColumns = Object.entries(checkedColumns).filter(
      (val) => val[1].status === true
    );
    const selectedColumns = Object.fromEntries(filterColumns);
    let response = await capturesContext.getAllCaptures({ filter });
    let data = await processDownloadData(response, selectedColumns);
    setDownloadData(data);
    setLoading(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Export Captures</DialogTitle>
      <DialogContent>
        <DialogContentText>Select the columns to download:</DialogContentText>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            {columns.map(({ attr, label }) => (
              <FormControlLabel
                key={attr}
                control={
                  <Checkbox
                    checked={checkedColumns[attr].status}
                    onChange={() => handleChange(attr)}
                    name={attr}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
        <DialogContentText>
          Only the first 20,000 records will be downloaded.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          disabled={loading}
          onClick={downloadCaptures}
        >
          Download
        </Button>
        <CSVLink data={downloadData} filename={'captures.csv'} ref={csvLink} />
      </DialogActions>
      {loading && <LinearProgress color="primary" />}
    </Dialog>
  );
};

export default ExportCaptures;
