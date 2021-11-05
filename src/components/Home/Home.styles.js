import { MENU_WIDTH } from '../common/Menu';

const styles = () => ({
  box: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  menuAside: {
    height: '100%',
    width: MENU_WIDTH,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  menu: {
    height: '100%',
    width: MENU_WIDTH,
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
  },
  welcomeBox: {
    height: '100%',
  },
  title: {
    fill: '#9f9f9f',
    fontSize: 48,
    fontFamily: 'Lato,Roboto,Helvetica,Arial,sans-serif',
    fontWeight: '400',
    lineHeight: '1.235',
  },
});

export default styles;
