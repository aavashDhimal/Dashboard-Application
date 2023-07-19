const initialState = {
  loading: true,
  tableLoading : true,
    data :  {
      activeIP : {
        mostRepeated : '',
        count : ''
      },
      commonReq : [],
      count :'',
      barData : [],
      statusData : [],
      userAgents : [],
      responseChart : [],
      },
    tableData : [],
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA_SUCCESS':
      return { ...state,loading: false, data: action.payload.data, error: null };
    case 'FETCH_DATA_FAILURE':
      return { ...state,loading: false, data: null, error: action.payload };
      case 'FETCH_TABLE_SUCCESS':
        return {  ...state,tableLoading : false, tableData: action.payload.logData, error: null };
      case 'FETCH_TABLE_FAILURE':
        return {  ...state,   tableLoading : false, tableData: null, error: action.payload };
    default:
      return state;
  }
};

export  {reducer, initialState}
