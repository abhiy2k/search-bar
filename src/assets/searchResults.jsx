import React from 'react';
import SearchNotFound from './searchNotFound';

const SearchResults = ({
  searchTerm,
  postResults,
  commentResults,
  userResults,
  showComments,
  showUsers,
  setShowComments,
  setShowUsers,
  hoveredItem,
  setHoveredItem,
  setIsMouseOver,
}) => {
  const highlightMatch = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(
      `(${search.split(':')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    return text.replace(regex, '<strong>$1</strong>');
  };

  const handleUserClick = () => {
    setShowUsers(true);
    setShowComments(false);
  };

  const handlePostClick = () => {
    setShowComments(false);
    setShowUsers(false);
  };
  const handleCommentClick = () => {
    setShowComments(true);
    setShowUsers(false);
  };

  const handleMouseEnter = (itemId) => {
    setHoveredItem(itemId);
    setIsMouseOver(true);
  };
  const handleMouseLeave = () => setIsMouseOver(false);

  if (
    searchTerm.length >= 2 &&
    ((postResults &&
      postResults.searchPost &&
      postResults.searchPost.nbHits > 0) ||
      (commentResults &&
        commentResults.searchComment &&
        commentResults.searchComment.nbHits > 0) ||
      (userResults &&
        userResults.searchBoardUser &&
        userResults.searchBoardUser.team.length > 0))
  ) {
    return (
      <div className='search-result-display'>
        <div className='search-result-display-btns'>
          <button
            className={`btn ${!showComments && !showUsers ? 'active' : ''}`}
            onClick={handlePostClick}
          >
            {postResults?.searchPost?.nbHits || 0} posts
          </button>
          <button
            className={`btn ${showComments ? 'active' : ''}`}
            onClick={handleCommentClick}
          >
            {postResults?.searchComment?.nbHits || 0} comments
          </button>
          <button
            className={`btn ${showUsers ? 'active' : ''}`}
            onClick={handleUserClick}
          >
            {postResults?.searchBoardUser?.total || 0} users
          </button>
        </div>
        <div className='search-result-output'>
          {showUsers
            ? userResults?.searchBoardUser?.team.map((user) => (
                <div
                  key={user.id}
                  className={`search-result-item ${
                    hoveredItem === user.id ? 'hovered' : ''
                  }`}
                  onMouseEnter={() => handleMouseEnter(user.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className='search-result-item-content'>
                    <span
                      className='title'
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(user.name, searchTerm),
                      }}
                    ></span>
                  </div>
                  <span className='statusName'>{user.role}</span>
                </div>
              ))
            : showComments
            ? commentResults?.searchComment?.hits.map((comment) => (
                <div
                  key={comment.commentId}
                  className={`search-result-item ${
                    hoveredItem === comment.commentId ? 'hovered' : ''
                  }`}
                  onMouseEnter={() => handleMouseEnter(comment.commentId)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className='search-result-item-content'>
                    <span
                      className='title'
                      style={{ opacity: 0.5 }}
                      dangerouslySetInnerHTML={{
                        __html: comment.title,
                      }}
                    ></span>
                    <span className='pid'>&nbsp;#{comment.pid} - </span>
                    <span
                      className='commentText'
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(comment.commentText, searchTerm),
                      }}
                    ></span>
                  </div>
                  <span className='statusName'>{comment.statusName}</span>
                </div>
              ))
            : postResults?.searchPost?.hits.map((post) => (
                <div
                  key={post.id}
                  className={`search-result-item ${
                    hoveredItem === post.id ? 'hovered' : ''
                  }`}
                  onMouseEnter={() => handleMouseEnter(post.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className='search-result-item-content'>
                    <span
                      className='title'
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(post.title, searchTerm),
                      }}
                    ></span>
                    <span className='pid'>&nbsp;#{post.pid}</span>
                  </div>
                  <span className='statusName'>{post.statusName}</span>
                </div>
              ))}
        </div>
        <hr />
      </div>
    );
  } else {
    return <SearchNotFound searchTerm={searchTerm} postResults={postResults} />;
  }
};

export default SearchResults;
