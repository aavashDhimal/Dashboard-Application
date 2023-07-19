import {useState,useEffect,useRef} from "react";
import { useReducer } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import '../assests/Style.css';
import { reducer, initialState } from '../Reducers/reducer';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiSpacer,
  EuiButton,
  EuiDatePicker,
  EuiSearchBar,
  EuiHeader,
  EuiFilterButton,
  EuiFilterGroup,
  EuiBasicTable,
  EuiModal,
  EuiModalHeaderTitle,
  EuiModalHeader,
} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import BarChart from "../components/bargraph";
import LineChart from "../components/lineChart";
import PieChart from "../components/pieGraph";
import axios from "axios";

const Dashboard = () => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const [tableLoading,setTableLoading] = useState(false);
  const [page,setPage] = useState(1);
  const tableRef = useRef(null);

  const [rawData,setrawData] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    console.log('i fire once');

    const token = localStorage.getItem('auth_token');
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get('http://localhost:4040/api/get_data',axiosConfig)
      .then(response => {
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
      })
      .catch(error => {
        dispatch({ type: 'FETCH_DATA_ERROR', payload: error.message });
      });
  
      return () => {
        dispatch({type : "CLEAR_STATE"});
      };
    }, []); 
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page
      }
    };
    setTableLoading(true)
    axios.get('http://localhost:4040/api/get_table_data',axiosConfig,
   )
      .then(response => {
        setTableLoading(false)

        dispatch({ type: 'FETCH_TABLE_SUCCESS', payload: response.data });
      })
      .catch(error => {
        dispatch({ type: 'FETCH_TABLE_ERROR', payload: error.message });
      });
  }
  , [page]); 


  
  const MethodColumns = [
    {
      field: "_id",
      name: "Response Status",
    },
    {
      field: "count",
      name: "Count",
    },
  ];


  const agentColumns = [
    {
      field: "_id",
      name: "Agent",
    },
    {
      field: "count",
      name: "Count",
    },
  ];

  const rawTablecolumns =   [{
    field: "dateTime",
    name: " Time",
  },
  {
    field: "raw",
    name: "Raw",
  },
];

  const columns = [
    {
      field: "-id",
      name: "Method",
    },
    {
      field: "Count",
      name: "count",
    },
  ];

  let newRawData = []

useEffect(()=>{
  console.log("data21")

  if (state.tableData.length > 0) {
    console.log("data2")

    state.tableData.forEach((obj) => {

      const parsedDate = moment(obj.dateTime);
      const formattedDate = parsedDate.format("MMMM Do YYYY - HH:mm:ss");
      console.log(formattedDate, "fd");
  
      newRawData.push({
        dateTime: formattedDate,
        raw: obj.raw
      });
    });
    setrawData([...rawData, ...newRawData]);
  }
},[state.tableData])
  
  console.log("rawData",rawData)

const handleScroll = () =>{
  const tableElement = tableRef.current;
  if(tableLoading ){
    console.log("table loading")
  }else if (
    tableElement.scrollTop + tableElement.clientHeight >=  tableElement.scrollHeight 
  ){
    console.log("set page")
    setPage(page+1);
  }

}

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterClick = (option) => {
    console.log("option",option)
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== option));
    } else {
      setSelectedFilters([option]);
    }
    console.log(selectedFilters,"sf")
  };

  if(state.error){
    return(
      <EuiModal >
  <EuiModalHeader>
    <EuiModalHeaderTitle>{state.error}</EuiModalHeaderTitle>
  </EuiModalHeader>
  </EuiModal>
    )
  }
  const username =localStorage.getItem("dash_user");

  console.log("store",state)
  return (
    <div>

      <div>
        <EuiHeader >
        <EuiText size="s">

          <p style={{fontSize:"20px", marginTop:"5px"}}>Dashboard/ {username}</p>
        </EuiText>
        <EuiButton onClick={()=>navigate('/login')}style={{justifyContent:"flex-end"}}>Logout</EuiButton>

        </EuiHeader>
    

        <EuiSpacer size="s" />

        <EuiFlexGroup direction="row" style={{maxHeight:"300px"}} >
        <EuiSpacer size="s" />
        <EuiFlexGroup direction="column" style={{ maxWidth: "15%" }}>
        {/* <EuiFlexItem grow={false}>
        <EuiFilterGroup style = {{backgroundColor:"black"}}>
        
          <EuiFilterButton
            hasActiveFilters={false}
            onClick={() => handleFilterClick("Option 1")}
          >
            IpAddress
          </EuiFilterButton>
          <EuiFilterButton
            color="black"
            hasActiveFilters= {true}
            onClick={() => handleFilterClick("Option 2")}
          >
            Date
          </EuiFilterButton>
     
        </EuiFilterGroup>
      </EuiFlexItem> */}
      {/* <EuiFlexItem grow={false}>
        <EuiButton
          onClick={() => {
            // Apply the selected filters to your data or perform some action
            console.log("Selected Filters: ", selectedFilters);
          }}
        >
          Apply Filters
        </EuiButton>
      </EuiFlexItem> */}
          <EuiFlexItem  >
            <EuiPanel paddingSize="s" >
              <div>
                <div div className="total-count" style={{textAlign:"center", justifyContent:"center",}}>
                  <h1 >  {state.data?.count ?? ''}</h1>
                  <h2>Total Entries</h2>
                </div>
              </div>

            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem  >
            <EuiPanel paddingSize="s" >
            <div className="total-count" style={{textAlign:"center", justifyContent:"center", }}>
                <h1> {state.data.activeIP?.mostRepeated ?? ''}</h1>
                <h2>Most Active IP.</h2>
                Count : {state.data.activeIP?.count }
              </div>
            </EuiPanel>
          </EuiFlexItem>

        </EuiFlexGroup >
      
        <EuiFlexGroup direction="column" style={{ maxWidth: "20%" }}>
     
          <EuiFlexItem  >

          <EuiPanel paddingSize="s" >
              <div>
                <div div className="total-count" style={{textAlign:"center", justifyContent:"center", }}>
                <PieChart data={state.data.commonReq}/>
                  <h2 style={{paddingTop:"20px"}}>Http Requests</h2>
                </div>
              </div>
            </EuiPanel>
          </EuiFlexItem>
          </EuiFlexGroup>
         
          <EuiFlexGroup direction="column" style={{ maxWidth: "15%" }}>
      
          <EuiFlexItem  >

          <EuiPanel paddingSize="s" >
              <div>
                <div div className="total-count" style={{textAlign:"center", justifyContent:"center", paddingTop:"13px"}}>
                <EuiBasicTable
        style = {{backgroundColor:"black"}}
        className="response-table"
            items={state.data.statusData}
            columns={MethodColumns}
            tableLayout="auto"
          />

                </div>
              </div>
            </EuiPanel>
          </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem>
          <EuiPanel paddingSize="s">
            <BarChart  data={state.data.barData.chartData}/>
          </EuiPanel>
        </EuiFlexItem>
     
        </EuiFlexGroup>
        <EuiSpacer size="l" />
     
        <EuiFlexGroup direction="row">
        <EuiFlexItem style={{maxWidth:"15%"}}>

<EuiBasicTable
style = {{backgroundColor:"black"}}
    items={state.data.userAgents}
    columns={agentColumns}
    tableLayout="auto"
    pagination={false}
  />  </EuiFlexItem>
          <EuiFlexItem style={{maxWidth:"35%"}}>
          <LineChart data={state.data.responseChart}/>
          </EuiFlexItem>
          <EuiFlexItem>
        <div
          className="euiTableContainer"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
          ref={tableRef}
          onScroll={handleScroll}
        >
          <EuiBasicTable
            compressed
            style={{ backgroundColor: 'black' }}
            items={rawData}
            columns={rawTablecolumns}
            tableLayout="auto"
            tableCaption="Raw Data"
          />
                {state.tableLoading ? (<div className="loading">Loading...</div>) : (       ''        )}

        </div>
      </EuiFlexItem>

        
      
        </EuiFlexGroup>
      </div>
      {state.loading ? (<div className="loading">Loading...</div>) : (       ''        )}

    </div>

  );
};


export default Dashboard;