import { render, unmountComponentAtNode } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';

describe('Home', () => {
  let container = null;
  let queryClient;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('it renders home component', () => {
    act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </QueryClientProvider>,
        container
      );
    });
  });
});
