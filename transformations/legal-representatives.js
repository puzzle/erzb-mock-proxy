function transformLegalRepresentatives(req, data) {
  if (!Array.isArray(data)) {
    return [data];
  }
  return data;
}

module.exports = transformLegalRepresentatives;
