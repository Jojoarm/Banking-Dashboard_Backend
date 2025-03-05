const accountNumberGenerator = () => {
  let acctNumber = [];
  for (let i = 0; i < 10; i++) {
    acctNumber.push(Math.floor(Math.random() * 10));
  }

  return acctNumber.toString().replace(/\,/g, '');
};

export default accountNumberGenerator;
