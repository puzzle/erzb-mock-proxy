function transformStudents(req, data) {
  return data.map(student => {
    const { AdressLine2, ...rest } = student;
    return {
      ...rest,
      AddressLine2: AdressLine2
    };
  });
}

module.exports = transformStudents;
