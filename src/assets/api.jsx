import axios from 'axios';

const postQuery = [
  {
    operationName: 'getBoardSearchResults',
    variables: {
      boardId: '06084063-2135-44bd-afe5-629aa3e41102',
      title: '',
      text: '',
      postFilter: [],
      limit: 25,
      offsetPosts: 0,
    },
    query:
      'fragment PostDataResponseFragment on PostDataResponse {\n  hits {\n    ...PostDataFragment\n    __typename\n  }\n  nbHits\n  __typename\n}\n\nfragment PostDataFragment on PostData {\n  id\n  pid\n  title\n  trendingScore\n  upvoteCount\n  downvoteCount\n  commentCount\n  statusName\n  __typename\n}\n\nfragment CommentDataResponseFragment on CommentDataResponse {\n  hits {\n    ...CommentDataFragment\n    __typename\n  }\n  nbHits\n  __typename\n}\n\nfragment CommentDataFragment on CommentData {\n  commentId\n  commentText\n  id\n  title\n  pid\n  trendingScore\n  upvoteCount\n  downvoteCount\n  commentCount\n  statusName\n  __typename\n}\n\nquery getBoardSearchResults($boardId: String!, $title: String!, $text: String!, $limit: Int, $offset: Int, $postFilter: [SearchFilter!]) {\n  searchPost(boardId: $boardId, title: $title, limit: $limit, offset: $offset, postFilter: $postFilter, isExpanded: true) {\n    ...PostDataResponseFragment\n    __typename\n  }\n  searchComment(boardId: $boardId, text: $text, limit: 0, offset: $offset) {\n    ...CommentDataResponseFragment\n    __typename\n  }\n  searchBoardUser(boardId: $boardId, text: $text, limit: 0, offset: 0) {\n    total\n    __typename\n  }\n}\n',
  },
];

const commentQuery = [
  {
    operationName: 'getBoardpostResultComments',
    variables: {
      boardId: '06084063-2135-44bd-afe5-629aa3e41102',
      text: '',
      limit: 25,
      offset: 0,
    },
    query: `fragment CommentDataResponseFragment on CommentDataResponse {
      hits {
        ...CommentDataFragment
        __typename
      }
      nbHits
      __typename
    }
    
    fragment CommentDataFragment on CommentData {
      commentId
      commentText
      id
      title
      pid
      trendingScore
      upvoteCount
      downvoteCount
      commentCount
      statusName
      __typename
    }
    
    query getBoardpostResultComments($boardId: String!, $text: String!, $limit: Int, $offset: Int) {
      searchComment(boardId: $boardId, text: $text, limit: $limit, offset: $offset) {
        ...CommentDataResponseFragment
        __typename
      }
    }`,
  },
];

const userQuery = [
  {
    operationName: 'getBoardSearchResultsUsers',
    variables: {
      boardId: '06084063-2135-44bd-afe5-629aa3e41102',
      text: '',
      limit: 25,
      offset: 0,
    },
    query:
      'query getBoardSearchResultsUsers($boardId: String!, $text: String!, $limit: Int, $offset: Int) {\n  searchBoardUser(boardId: $boardId, text: $text, limit: $limit, offset: $offset) {\n    id\n    total\n    team {\n      id\n      name\n      email\n      role\n      color\n      imageUrl\n      userId\n      isInvitationPending\n      __typename\n    }\n    __typename\n  }\n}\n',
  },
];

export const fetchSearchResults = async (
  searchTerm,
  isComment,
  setResults,
  setLoading,
  setHoveredItem,
  isMouseOver,
  setUserResults,
  setShowUsers
) => {
  const boardName = 'test2'; // change the boardName to which the board you want to perform search.
  const url = `https://${boardName}.nolt-staging.com/graphql`;
  const payload = isComment ? commentQuery : postQuery;
  payload[0].variables.text = searchTerm.split(':')[0];
  // console.log(payload[0].variables.text);
  payload[0].variables.title = searchTerm.split(':')[0];
  // console.log(payload[0].variables.title);

  try {
    setLoading(true);
    const response = await axios.post(url, payload);
    let responseData = response.data[0].data;
    // console.log(responseData);
    const filterQuery = searchTerm.split(':')[1];
    if (filterQuery && !isComment && responseData.searchPost) {
      responseData.searchPost.hits = responseData.searchPost.hits.filter(
        (elem) =>
          elem.statusName.toLowerCase().match(filterQuery.toLowerCase().trim())
      );
      responseData.searchPost.nbHits = responseData.searchPost.hits.length;
    }

    setResults(responseData);

    if (
      !isComment &&
      responseData.searchBoardUser &&
      responseData.searchBoardUser.total > 0
    ) {
      userQuery[0].variables.text = searchTerm.split(':')[0];
      const userResponse = await axios.post(url, userQuery);
      const userResponseData = userResponse.data[0].data;

      // Checking if the search term matches user name
      const matchingUser = userResponseData.searchBoardUser.team.find(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email === searchTerm
      );

      // console.log(matchingUser);

      if (matchingUser) {
        setUserResults(userResponseData);
        setShowUsers(true);
        setHoveredItem(matchingUser.id);
      } else {
        setUserResults(null);
        setShowUsers(false);
      }
    } else {
      setUserResults(null);
      setShowUsers(false);
    }

    if (!isMouseOver) {
      if (
        isComment &&
        responseData.searchComment &&
        responseData.searchComment.hits.length > 0
      ) {
        setHoveredItem(responseData.searchComment.hits[0].commentId);
      } else if (
        !isComment &&
        responseData.searchPost &&
        responseData.searchPost.hits.length > 0
      ) {
        setHoveredItem(responseData.searchPost.hits[0].id);
      }
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
  } finally {
    setTimeout(() => setLoading(false), 300);
  }
};
