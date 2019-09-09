function setQueryDSL(search, searchBy, sort, sortBy) {
  const queryDSL = {};

  if (sortBy) {
    switch (sortBy) {
      case 'title':
      case 'author':
      case 'description':
      case 'image':
        queryDSL.sort = [
          {
            [`${sortBy}.keyword`]: sort || 'ASC', // not analyzed title, author, description and image
          },
        ];
        break;
      case 'id':
      case 'date':
        queryDSL.sort = [
          {
            [sortBy]: sort || 'ASC',
          },
        ];
        break;
      default:
        queryDSL.sort = [
          {
            id: 'DESC',
          },
        ];
    }
  }

  if (search && searchBy) {
    queryDSL.query = {
      match: {
        [searchBy]: search,
      },
    };
  }
  return queryDSL;
}

module.exports = {
  setQueryDSL,
};
