const { getFilterValue } = require('../utils/filter');

function transformPersons(req, data) {
  return filterPersonsById(
    req,
    data.map(person => ({ ...person, PhoneBusiness: '031 123 45 67' }))
  );
}

function filterPersonsById(req, data) {
  const personFilter = getFilterValue(req, 'Id', ';');
  if (personFilter) {
    const ids = personFilter.split(';').map(Number);
    return data.filter(person => ids.indexOf(person.Id) > -1);
  }
  return data;
}

module.exports = transformPersons;
