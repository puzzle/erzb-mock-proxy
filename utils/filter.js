function getFilterValue(req, field, operator) {
  const paramValue = req.query[`filter.${field}`];
  const matches = paramValue.match(`${operator}(.*)`);
  return (matches && matches[1]) || null;
}

module.exports = {
  getFilterValue
};
