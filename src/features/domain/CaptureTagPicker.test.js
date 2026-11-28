import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CaptureTagPicker from './CaptureTagPicker';
import { useDomainData } from './DomainContext';
jest.mock('./DomainContext', () => ({ useDomainData: jest.fn() }));
jest.mock('./shared', () => ({ QueryState: () => null }));
const props = {
  organizationId: 'org-a',
  projectId: 'project-a',
  value: [],
  onChange: jest.fn(),
  onPendingChange: jest.fn(),
};
beforeEach(() => {
  jest.clearAllMocks();
  useDomainData.mockReturnValue({
    data: { rows: [{ id: 'tag', name: 'Field survey' }] },
  });
});
it('uses the organization dictionary and optionally narrows suggestions to its project', () => {
  render(<CaptureTagPicker {...props} />);
  expect(useDomainData).toHaveBeenLastCalledWith(
    '/capture-tags',
    expect.objectContaining({ organizationId: 'org-a', projectId: undefined }),
    true,
    true
  );
  fireEvent.click(screen.getByLabelText('Suggest tags used in this project'));
  expect(useDomainData).toHaveBeenLastCalledWith(
    '/capture-tags',
    expect.objectContaining({
      organizationId: 'org-a',
      projectId: 'project-a',
    }),
    true,
    true
  );
  fireEvent.click(screen.getByRole('button', { name: 'Open' }));
  fireEvent.click(screen.getByRole('option', { name: 'Field survey' }));
  expect(props.onChange).toHaveBeenCalledWith(['Field survey']);
});
it('allows a new name and disables the dictionary without an organization', () => {
  const { rerender } = render(<CaptureTagPicker {...props} />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Additional tags' }), {
    target: { value: 'New field label' },
  });
  fireEvent.keyDown(screen.getByRole('textbox', { name: 'Additional tags' }), {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
  });
  expect(props.onChange).toHaveBeenCalledWith(['New field label']);
  rerender(<CaptureTagPicker {...props} organizationId={null} />);
  expect(
    screen.getByRole('textbox', { name: 'Additional tags' })
  ).toBeDisabled();
  expect(useDomainData).toHaveBeenLastCalledWith(
    '/capture-tags',
    expect.objectContaining({ organizationId: null }),
    false,
    true
  );
});
