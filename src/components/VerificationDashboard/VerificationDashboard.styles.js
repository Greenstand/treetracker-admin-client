import { MENU_WIDTH } from '../common/Menu';

const styles = (theme) => ({
  box: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  menuAside: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  menu: {
    height: '100%',
    overflow: 'hidden',
  },
  rightBox: {
    height: '100%',
    position: 'absolute',
    padding: '40px',
    left: MENU_WIDTH,
    top: 0,
    right: 0,
    backgroundColor: 'rgb(239, 239, 239)',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlockEnd: theme.spacing(6),
    gap: theme.spacing(4),
  },
  subtitle: {
    color: theme.palette.stats.carbonGrey,
  },
  dashstatWraper: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    flexWrap: 'wrap',
  },
  split: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)',
    gap: theme.spacing(4),
    alignItems: 'stretch',
    marginBlockStart: theme.spacing(8),
    '@media (max-width: 1080px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
});

export default styles;
