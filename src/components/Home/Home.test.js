import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';

describe('Home', () => {
  let container = null;
  let root = null;
  let queryClient = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    container = null;
  });

  it('it renders home component', () => {
    act(() => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </QueryClientProvider>
      );
    });
  });
});
