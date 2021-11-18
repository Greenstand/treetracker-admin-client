import { selectedHighlightColor } from '../../common/variables.js';
import { makeStyles } from '@material-ui/core/styles';

const GROWER_IMAGE_SIZE = 182;

const useStyle = makeStyles((theme) => ({
  outer: {
    height: '100vh',
    flex: 1,
    flexWrap: 'nowrap',
  },
  cardImg: {
    width: '100%',
    height: 'auto',
  },
  cardTitle: {
    color: '#f00',
  },
  card: {
    cursor: 'pointer',
    margin: '0.5rem',
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  cardContent: {
    padding: 0,
    height: `${GROWER_IMAGE_SIZE}px`,
    position: 'relative',
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`,
  },
  cardMedia: {
    height: `${GROWER_IMAGE_SIZE}px`,
  },
  cardWrapper: {
    width: 200,
  },
  growerCard: {
    borderRadius: 16,
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: 'none',
  },
  placeholderCard: {
    pointerEvents: 'none',
    background: '#eee',
    '& *': {
      opacity: 0,
    },
    border: 'none',
  },
  title: {
    padding: theme.spacing(2, 16),
  },
  snackbar: {
    bottom: 20,
  },
  snackbarContent: {
    backgroundColor: theme.palette.action.active,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginRight: '8px',
  },
  sidePanel: {},
  body: {
    width: '100%',
    overflow: 'hidden auto',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  bottomLine: {
    borderBottom: '1px solid lightgray',
  },
  tooltip: {
    maxWidth: 'none',
  },
  page: {
    padding: theme.spacing(2, 16),
  },
  personBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    height: '100%',
  },
  person: {
    height: 90,
    width: 90,
    fill: 'gray',
  },
  name: {
    textTransform: 'capitalize',
  },
}));

export { useStyle, GROWER_IMAGE_SIZE };
