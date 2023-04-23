import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { ANY_CAPTURES_AMOUNT } from 'models/FilterGrower';

const SelectCapturesAmount = ({ capturesAmountRange, handleSelection }) => {
  const capturesFitlerList = [
    {
      id: ANY_CAPTURES_AMOUNT,
      name: 'All',
      value: ANY_CAPTURES_AMOUNT,
    },
    {
      id: 'new_grower',
      name: '0',
      value: {
        min: 0,
        max: 0,
      },
    },
    {
      id: 'beginner_grower',
      name: '1-25',
      value: {
        min: 1,
        max: 25,
      },
    },
    {
      id: 'regular_grower',
      name: '25+',
      value: {
        min: 25,
      },
    },
  ];

  const handleChange = (e) => {
    const selectedRange = [...capturesFitlerList].find(
      (c) => c.id === e.target.value
    );

    handleSelection(selectedRange);
  };

  return (
    <TextField
      select
      data-testid="captures-amount-dropdown"
      htmlFor="captures-amount"
      id="captures-amount"
      label="Captures Amount"
      name="downloaded captures amount"
      value={
        typeof capturesAmountRange === 'string'
          ? ANY_CAPTURES_AMOUNT
          : capturesAmountRange.id
      }
      onChange={handleChange}
    >
      {capturesFitlerList.map((filter) => (
        <MenuItem
          data-testid="captures-amount"
          key={filter.id}
          value={filter.id}
        >
          {filter.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectCapturesAmount;
