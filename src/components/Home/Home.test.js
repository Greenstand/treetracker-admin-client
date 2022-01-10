import { render, unmountComponentAtNode } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Home from './Home';

describe('Home', () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('it renders home component', () => {
    act(() => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
        container,
      );
    });
  });
});
