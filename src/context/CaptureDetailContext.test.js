import React, { useContext } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  CaptureDetailContext,
  CaptureDetailProvider,
} from './CaptureDetailContext';
import api from '../api/treeTrackerApi';
import { authAxios } from '../api/httpClient';

jest.mock('../api/treeTrackerApi', () => ({
  getSpeciesById: jest.fn(),
  getTagById: jest.fn(),
}));
jest.mock('../api/httpClient', () => ({ authAxios: { get: jest.fn() } }));

function deferred() {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function DetailConsumer() {
  const { capture, species, tags, getCaptureDetail } = useContext(
    CaptureDetailContext
  );
  return (
    <>
      <button onClick={() => getCaptureDetail(42)}>Load capture</button>
      <output data-testid="detail">
        {JSON.stringify({ capture, species, tags })}
      </output>
    </>
  );
}

const readDetail = () => JSON.parse(screen.getByTestId('detail').textContent);

describe('CaptureDetailProvider concurrent requests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each(['species', 'tags'])(
    'preserves both fields when %s resolves first',
    async (firstField) => {
      const capture = { id: 42, speciesId: 3, treeTags: [{ tagId: 7 }] };
      const species = { id: 3, name: 'Mango' };
      const tag = { id: 7, tagName: 'healthy' };
      const requests = { species: deferred(), tags: deferred() };
      const results = { species, tags: tag };
      authAxios.get.mockResolvedValue({ data: capture });
      api.getSpeciesById.mockReturnValue(requests.species.promise);
      api.getTagById.mockReturnValue(requests.tags.promise);

      render(
        <CaptureDetailProvider>
          <DetailConsumer />
        </CaptureDetailProvider>
      );
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Load capture' }));
      });
      await waitFor(() => {
        expect(api.getSpeciesById).toHaveBeenCalledWith(3);
        expect(api.getTagById).toHaveBeenCalledWith(7);
      });

      await act(async () => {
        requests[firstField].resolve(results[firstField]);
      });
      expect(readDetail()[firstField]).toEqual(
        firstField === 'species' ? species : [tag]
      );

      const secondField = firstField === 'species' ? 'tags' : 'species';
      await act(async () => {
        requests[secondField].resolve(results[secondField]);
      });
      expect(readDetail()).toEqual({ capture, species, tags: [tag] });
    }
  );
});
