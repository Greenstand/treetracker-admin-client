import { makeStyles } from '@material-ui/core/styles';

// change 88 to unit spacing,
const useStyle = makeStyles((theme) => ({
  root: {
    position: 'relative',
    paddingLeft: theme.spacing(16),
    overflowX: 'auto',
  },
  tableGrid: {
    width: '100%',
    overflow: 'hidden',
    flexWrap: 'nowrap',
  },
  tableRow: {
    cursor: 'pointer',
  },
  locationCol: {
    width: '270px',
  },
  table: {
    minHeight: '100vh',
    '&:nth-child(2)': {
      width: 20,
    },
  },
  tableBody: {
    minHeight: '100vh',
  },
  pagination: {
    position: 'sticky',
    bottom: '0px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.15)',
  },
  title: {
    paddingLeft: theme.spacing(4),
  },
  cornerTable: {
    margin: theme.spacing(1),
    '&>*': {
      display: 'inline-flex',
      margin: theme.spacing(1, 1),
    },
  },
  buttonCsv: {
    height: 36,
  },
  loadingIndicator: {
    justifyContent: 'space-around',
    padding: theme.spacing(2),
  },
  tooltipTop: {
    top: '8px',
  },
  arrow: {
    fontSize: '12px',
  },
}));

export default useStyle;
