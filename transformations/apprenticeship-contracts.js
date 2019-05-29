function transformApprenticeshipContracts(req, data) {
  return data.map(contract => ({
    ...contract,
    ContractDateTo: contract.ApprenticeshipDateTo,
    ContractDateFrom: contract.ApprenticeshipDateFrom
  }));
}

module.exports = transformApprenticeshipContracts;
