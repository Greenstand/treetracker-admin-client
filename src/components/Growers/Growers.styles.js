import { makeStyles } from '@material-ui/core/styles';

const GROWER_IMAGE_SIZE = 182;

const useStyle = makeStyles((theme) => ({
  card: {
    width: `${GROWER_IMAGE_SIZE}px`,
    cursor: 'pointer',
    margin: '0.5rem',
  },
  errorBox: {
    width: '100%',
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 0,
    height: `${GROWER_IMAGE_SIZE}px`,
    position: 'relative',
  },
  cardMedia: {
    height: `${GROWER_IMAGE_SIZE}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 14),
  },
  items: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    padding: theme.spacing(0, 4),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2, 14),
  },
  body: {
    width: '100%',
    overflow: 'hidden auto',
  },
  person: {
    height: 90,
    width: 90,
    fill: 'gray',
  },
  name: {
    textTransform: 'capitalize',
  },
  tooltipTop: {
    top: '16px',
  },
  tooltipBottom: {
    top: '-16px',
  },
  tooltipCard: {
    maxWidth: '180px',
  },
  tooltipCardHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  tooltipIcon: {
    display: 'flex',
    marginTop: theme.spacing(1),
  },
  tooltipTitle: {
    marginLeft: '12px',
    fontSize: '.9rem',
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  tooltipLabel: {
    marginLeft: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

export { useStyle, GROWER_IMAGE_SIZE };
