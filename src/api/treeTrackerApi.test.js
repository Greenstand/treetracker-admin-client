import api from './treeTrackerApi';
import { authAxios } from './httpClient';

jest.mock('./httpClient', () => ({ authAxios: jest.fn() }));

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe('createCaptureTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('waits for every tag write and preserves request payloads', async () => {
    const first = deferred();
    const second = deferred();
    authAxios
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const completed = jest.fn();

    const result = api.createCaptureTags(42, [{ id: 7 }, { id: 9 }]);
    Promise.resolve(result).then(completed);

    expect(authAxios).toHaveBeenCalledTimes(2);
    [7, 9].forEach((tagId, index) => {
      expect(authAxios).toHaveBeenNthCalledWith(index + 1, {
        url: `${process.env.REACT_APP_API_ROOT}/api/tree_tags`,
        method: 'POST',
        data: { treeId: 42, tagId },
        signal: undefined,
      });
    });
    await Promise.resolve();
    expect(completed).not.toHaveBeenCalled();

    first.resolve({ data: { id: 101 } });
    await Promise.resolve();
    await Promise.resolve();
    expect(completed).not.toHaveBeenCalled();

    second.resolve({ data: { id: 102 } });
    await expect(result).resolves.toEqual([{ id: 101 }, { id: 102 }]);
    expect(completed).toHaveBeenCalledTimes(1);
  });

  it('rejects when a tag write fails', async () => {
    const write = deferred();
    const error = new Error('Tag write failed');
    authAxios.mockReturnValueOnce(write.promise);

    const result = api.createCaptureTags(42, [{ id: 7 }]);
    const rejected = expect(result).rejects.toBe(error);
    write.reject(error);

    await rejected;
  });

  it('resolves an empty tag list without making a request', async () => {
    await expect(api.createCaptureTags(42, [])).resolves.toEqual([]);
    expect(authAxios).not.toHaveBeenCalled();
  });
});
