import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useDebounce } from './useDebounce';

function Trigger({ delay, onCall }) {
  const debounced = useDebounce(onCall, delay);
  return <button onClick={() => debounced('value')}>trigger</button>;
}

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not call the callback before the delay expires', () => {
    const cb = jest.fn();
    render(<Trigger delay={300} onCall={cb} />);

    fireEvent.click(screen.getByRole('button'));

    expect(cb).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(cb).not.toHaveBeenCalled();
  });

  it('calls the callback with the correct args after the delay', () => {
    const cb = jest.fn();
    render(<Trigger delay={300} onCall={cb} />);

    fireEvent.click(screen.getByRole('button'));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('value');
  });

  it('debounces rapid calls and fires only once after the final call', () => {
    const cb = jest.fn();
    render(<Trigger delay={300} onCall={cb} />);

    fireEvent.click(screen.getByRole('button'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    fireEvent.click(screen.getByRole('button'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    fireEvent.click(screen.getByRole('button'));
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('always invokes the latest callback, not a stale one', () => {
    const stale = jest.fn();
    const latest = jest.fn();
    const { rerender } = render(<Trigger delay={300} onCall={stale} />);

    fireEvent.click(screen.getByRole('button'));

    // Replace the callback before the timer fires.
    rerender(<Trigger delay={300} onCall={latest} />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(stale).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('cancels the pending timer on unmount', () => {
    const cb = jest.fn();
    const { unmount } = render(<Trigger delay={300} onCall={cb} />);

    fireEvent.click(screen.getByRole('button'));
    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(cb).not.toHaveBeenCalled();
  });

  it('returns a stable function reference across re-renders when delay is unchanged', () => {
    const refs = [];
    function Test() {
      const fn = useDebounce(jest.fn(), 300);
      refs.push(fn);
      return null;
    }

    const { rerender } = render(<Test />);
    rerender(<Test />);

    expect(refs[0]).toBe(refs[1]);
  });

  it('returns a new function reference when the delay changes', () => {
    const refs = [];
    function Test({ delay }) {
      const fn = useDebounce(jest.fn(), delay);
      refs.push(fn);
      return null;
    }

    const { rerender } = render(<Test delay={300} />);
    rerender(<Test delay={500} />);

    expect(refs[0]).not.toBe(refs[1]);
  });
});
