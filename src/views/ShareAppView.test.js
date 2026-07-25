import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-ui/core/styles';

import ShareAppView from './ShareAppView';
import { getOrganizationById } from 'api/organizations';
import { buildShareAppLink } from 'common/shareLink';
import { AppContext } from 'context/AppContext';
import theme from 'components/common/theme';

jest.mock(
  'components/common/Menu',
  () =>
    function Menu() {
      return null;
    }
);

jest.mock(
  'components/Navbar',
  () =>
    function Navbar() {
      return null;
    }
);

jest.mock('api/organizations', () => ({
  getOrganizationById: jest.fn(),
}));

// v4 QRCodeCanvas forwards its ref to the <canvas>; mirror that so the
// download handler can read qrRef.current directly.
jest.mock('qrcode.react', () => {
  const React = require('react');
  return {
    QRCodeCanvas: React.forwardRef(function QRCodeCanvas(props, ref) {
      return React.createElement('canvas', { ref, 'data-testid': 'qr-canvas' });
    }),
  };
});

describe('ShareAppView', () => {
  let queryClient;
  const ORG = { id: 42, name: 'Acme' };
  const shareLink = buildShareAppLink({ name: ORG.name, id: ORG.id });

  function renderView(user = { policy: { organization: { id: ORG.id } } }) {
    return render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppContext.Provider value={{ user }}>
            <ShareAppView />
          </AppContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  function setMatchMedia(matches) {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    setMatchMedia(false); // desktop layout
    getOrganizationById.mockResolvedValue(ORG);

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    // jsdom has no canvas backend — stub the bits the download path uses.
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      imageSmoothingEnabled: true,
      drawImage: jest.fn(),
    }));
    HTMLCanvasElement.prototype.toDataURL = jest.fn(
      () => 'data:image/png;base64,AAAA'
    );
    jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('renders the link, QR and action buttons for an organization', async () => {
    renderView();

    const link = await screen.findByTestId('share-app-link');
    expect(link).toHaveAttribute('href', shareLink);
    expect(link).toHaveTextContent(shareLink);

    expect(
      screen.getByText(/here is your link to share with your planter/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/here is your qr code to present to your planter/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download your qr code/i })
    ).toBeInTheDocument();
    expect(getOrganizationById).toHaveBeenCalledWith(ORG.id);
  });

  it('copies the link and shows the "copied" notification', async () => {
    renderView();

    const copyButton = await screen.findByRole('button', { name: /copy/i });
    userEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(shareLink);
    });
    expect(await screen.findByText('copied')).toBeInTheDocument();
  });

  it('exports a PNG and shows the downloading notification', async () => {
    renderView();

    const downloadButton = await screen.findByRole('button', {
      name: /download your qr code/i,
    });
    userEvent.click(downloadButton);

    expect(
      await screen.findByText('Downloading your QR code...')
    ).toBeInTheDocument();
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith(
      'image/png'
    );
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
  });
});
