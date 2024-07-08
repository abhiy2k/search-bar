import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import useDebounce from '../assets/useDebounce';
import { fetchSearchResults } from '../assets/api';
import SearchResults from '../assets/searchResults';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState(''); // state to track Input text
  const [postResults, setPostResults] = useState(null); // stores the data from postQuery
  const [commentResults, setCommentResults] = useState(null); // stores the data from commentQuery
  const [showComments, setShowComments] = useState(false); // for toggling
  const [hoveredItem, setHoveredItem] = useState(null); // items to hover
  const [isMouseOver, setIsMouseOver] = useState(false); // keep track of mouse hover
  const [loading, setLoading] = useState(false); // loading
  const [userResults, setUserResults] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // use of debounce hook for delay 200ms

  useEffect(() => {
    if (debouncedSearchTerm) {
      if (!showComments && !postResults) {
        fetchSearchResults(
          debouncedSearchTerm,
          false,
          setPostResults,
          setLoading,
          setHoveredItem,
          isMouseOver,
          setUserResults,
          setShowUsers
        );
      } else if (showComments && !commentResults) {
        fetchSearchResults(
          debouncedSearchTerm,
          true,
          setCommentResults,
          setLoading,
          setHoveredItem,
          isMouseOver,
          setUserResults,
          setShowUsers
        );
      }
    } else {
      setPostResults(null);
      setCommentResults(null);
      setUserResults(null);
      setHoveredItem(null);
      setShowUsers(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (
      showComments &&
      !commentResults &&
      postResults.searchComment.nbHits > 0 &&
      debouncedSearchTerm
    ) {
      fetchSearchResults(
        debouncedSearchTerm,
        true,
        setCommentResults,
        setLoading,
        setHoveredItem,
        isMouseOver,
        setUserResults,
        setShowUsers
      );
    } else if (!showComments && !postResults && debouncedSearchTerm) {
      fetchSearchResults(
        debouncedSearchTerm,
        false,
        setPostResults,
        setLoading,
        setHoveredItem,
        isMouseOver,
        setUserResults,
        setShowUsers
      );
    }
  }, [showComments]);

  useEffect(() => {
    if (showComments && commentResults?.searchComment?.hits.length > 0) {
      setHoveredItem(commentResults.searchComment.hits[0].commentId);
    } else if (!showComments && postResults?.searchPost?.hits.length > 0) {
      setHoveredItem(postResults.searchPost.hits[0].id);
    }
  }, [showComments, postResults, commentResults]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowComments(false);
    setShowUsers(false);
    setPostResults(null);
    setCommentResults(null);
    setUserResults(null);
  };

  const handleToggleComments = (showComments) => {
    setShowComments(showComments);
    setIsMouseOver(false);
  };

  return (
    <div className='modal'>
      <div className='container'>
        <div className='container1'>
          <div className='container2'>
            <div className='searchbar'>
              <div className='search-handler'>
                <span className='search-handler-leftside'></span>
                <input
                  type='text'
                  placeholder='Search..'
                  className='search-input'
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <span className='search-handler-rightside'>
                  {loading && <div className='spinner'></div>}
                </span>
                {!loading && searchTerm.length > 0 && (
                  <SearchResults
                    searchTerm={searchTerm}
                    postResults={postResults}
                    commentResults={commentResults}
                    userResults={userResults}
                    showComments={showComments}
                    showUsers={showUsers}
                    setShowComments={handleToggleComments}
                    setShowUsers={setShowUsers}
                    hoveredItem={hoveredItem}
                    setHoveredItem={setHoveredItem}
                    setIsMouseOver={setIsMouseOver}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
