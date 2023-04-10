import React, { useContext, useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { GrowerContext } from 'context/GrowerContext';
import { Autocomplete } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { ALL_WALLETS } from 'models/Filter';

function SelectWallet({
  classes,
  wallet,
  walletSearchString,
  handleChangeWallet,
  handleChangeWalletSearchString,
}) {
  const growerContext = useContext(GrowerContext);
  const filterOptionAll = 'All';
  const filterLoadMore = 'LOAD_MORE';
  const [walletPage, setWalletPage] = useState(0);
  const [walletsLoadedData, setWalletsLoadedData] = useState([]);

  // Is called when page loads and when user starts to type in a 'Wallet' filter
  useEffect(() => {
    const getWallets = async () => {
      setWalletPage(0);

      const response = await growerContext.getWallets(walletSearchString);
      if (!response) {
        console.log('No response from getWallets');
        return;
      }

      const total = response.total;
      const wallets = response.wallets;
      const addLoadMoreButton = wallets.length < total;

      addLoadMoreButtonToWallets([...wallets], addLoadMoreButton);
    };

    getWallets();
  }, [walletSearchString]);

  // Is called when user click 'Load More' button in Wallet autocomplete
  useEffect(() => {
    const getWallets = async () => {
      if (walletPage === 0) {
        return;
      }

      const response = await growerContext.getWallets(
        walletSearchString,
        walletPage
      );

      const total = response.total;
      const wallets = response.wallets;
      const addLoadMoreButton =
        wallets.length + walletsLoadedData.length < total;

      addLoadMoreButtonToWallets(
        [...walletsLoadedData, ...wallets],
        addLoadMoreButton
      );
    };

    getWallets();
  }, [walletPage]);

  const addLoadMoreButtonToWallets = (data, addMoreData) => {
    const dataToShow = data;
    if (addMoreData) {
      dataToShow.push(filterLoadMore);
    }
    setWalletsLoadedData(dataToShow);
  };

  const handleWalletRenderOption = (option) => {
    if (option === filterLoadMore) {
      return (
        <Button onClick={handleLoadMoreWallets} color="primary">
          Load more
        </Button>
      );
    }

    return option && option.name ? option.name : option;
  };

  const handleLoadMoreWallets = async (event) => {
    event.stopPropagation();
    setWalletPage(walletPage + 1);

    // 'Load more' button should be removed from the list of options
    walletsLoadedData.pop();
    setWalletsLoadedData([...walletsLoadedData]);
  };

  return (
    <Autocomplete
      data-testid="wallet-dropdown"
      label="Wallet"
      htmlFor="wallet"
      id="wallet"
      classes={{
        inputRoot: classes.autocompleteInputRoot,
      }}
      options={[
        {
          id: ALL_WALLETS,
          name: filterOptionAll,
          isPublic: true,
          status: 'active',
          owner_id: null,
        },
        ...walletsLoadedData,
      ]}
      value={wallet}
      defaultValue={filterOptionAll}
      getOptionLabel={(wallet) => {
        if (wallet === filterLoadMore) {
          return walletSearchString;
        }

        return wallet.name !== undefined ? wallet.name : wallet;
      }}
      loading={walletsLoadedData.length === 1}
      loadingText={'Loading..'}
      onChange={(_oldVal, newVal) => {
        // event is triggered by onInputChange
        if (newVal === filterLoadMore) return;

        if (newVal && newVal.name === filterOptionAll) {
          handleChangeWallet(filterOptionAll);
          return;
        }

        handleChangeWallet(newVal);
      }}
      onInputChange={(_oldVal, newVal) => {
        // Do not select 'LOAD_MORE' as an autocomplete value
        if (newVal === filterLoadMore) {
          handleChangeWalletSearchString(walletSearchString);
          return;
        }

        newVal === filterOptionAll
          ? handleChangeWalletSearchString('')
          : handleChangeWalletSearchString(newVal);
      }}
      renderInput={(params) => {
        return <TextField {...params} label="Wallet" />;
      }}
      renderOption={handleWalletRenderOption}
      getOptionSelected={(option, value) => {
        return option.name !== undefined
          ? option.name === value
          : option === value;
      }}
    />
  );
}

export default SelectWallet;
