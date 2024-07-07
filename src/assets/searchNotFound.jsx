import React from 'react';

const SearchNotFound = ({ searchTerm, postResults }) => {
  if (searchTerm.length === 1) {
    return (
      <div className='search-not-found'>
        <h4>Go on...</h4>
        <p>Be More Specific!</p>
      </div>
    );
  } else if (
    postResults &&
    postResults.searchPost &&
    postResults.searchPost.nbHits === 0
  ) {
    return (
      <div className='search-not-found'>
        <h4>No results</h4>
        <p>Check for spelling errors</p>
        <p>or try different words</p>
      </div>
    );
  } else {
    return null;
  }
};

export default SearchNotFound;
