const countToLocaleString = (num) => {
  if (!num?.toLocaleString || typeof num !== 'number') return num;
  let formatedNumber = num.toLocaleString();
  return formatedNumber;
};

export { countToLocaleString };
