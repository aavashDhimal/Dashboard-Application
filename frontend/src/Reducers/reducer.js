// reducers.js
const initialState = {
    loading: true,
    data: null,
    error: null,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_DATA_SUCCESS':
        return { loading: false, data: action.payload, error: null };
      case 'GET_DATA_FAILURE':
        return { loading: false, data: null, error: action.payload };
      default:
        return state;
    }
  };
  
  export { reducer, initialState };
  