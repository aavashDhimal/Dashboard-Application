import {useState} from "react";
import { useReducer } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import '../assests/Style.css';
import { reducer, initialState } from '../Reducers/reducer';

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
} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import BarChart from "../components/bargraph";
import LineChart from "../components/lineChart";
import PieChart from "../components/pieGraph";
import axios from "axios";

const Dashboard = () => {
  const columns = [
    {
      field: "time",
      name: "Time",
    },
    {
      field: "logData",
      name: "Raw Log Data",
    },
  ];
  const rawData = [
    {
      time: "2023-07-18 12:30:00",
      logData: "Sample log data 1",
    },
    {
      time: "2023-07-18 13:15:00",
      logData: "Sample log data 2",
    },
    // Add more data objects here as needed
  ];

  const [state, dispatch] = useReducer(reducer, initialState);


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

  return (
    <div>
      <div>
        <EuiHeader >
        <EuiText size="s">

          <p style={{fontSize:"20px"}}>Dashboard</p>
        </EuiText>
        </EuiHeader>
    

        <EuiSpacer size="s" />

        <EuiFlexGroup direction="row" style={{maxHeight:"300px"}} >
        <EuiSpacer size="s" />
        <EuiFlexGroup direction="column" style={{ maxWidth: "15%" }}>
        <EuiFlexItem grow={false}>
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
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton
          onClick={() => {
            // Apply the selected filters to your data or perform some action
            console.log("Selected Filters: ", selectedFilters);
          }}
        >
          Apply Filters
        </EuiButton>
      </EuiFlexItem>
          <EuiFlexItem  >
            <EuiPanel paddingSize="s" >
              <div>
                <div div className="total-count" style={{textAlign:"center", justifyContent:"center",}}>
                  <h1 > 63</h1>
                  <h2>Total Entries</h2>
                </div>
              </div>

            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem  >
            <EuiPanel paddingSize="s" >
            <div className="total-count" style={{textAlign:"center", justifyContent:"center", }}>
                <h1> 19.212.5465.1</h1>
                <h2>Most Active IP.</h2>
                Count : 53
              </div>
            </EuiPanel>
          </EuiFlexItem>

        </EuiFlexGroup >
      
        <EuiFlexGroup direction="column" style={{ maxWidth: "20%" }}>
     
          <EuiFlexItem  >

          <EuiPanel paddingSize="s" >
              <div>
                <div div className="total-count" style={{textAlign:"center", justifyContent:"center",}}>
                <PieChart/>
                  <h2>Http Requests</h2>
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
            items={rawData}
            columns={columns}
            tableLayout="auto"
          />

                </div>
              </div>
            </EuiPanel>
          </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem>
          <EuiPanel paddingSize="s">
            <BarChart />
          </EuiPanel>
        </EuiFlexItem>
     
        </EuiFlexGroup>
     
        <EuiSpacer size="l" />
     
        <EuiFlexGroup direction="row">
        <EuiFlexItem style={{maxWidth:"15%"}}>

<EuiBasicTable
style = {{backgroundColor:"black"}}
    items={rawData}
    columns={columns}
    tableLayout="auto"
  />  </EuiFlexItem>
          <EuiFlexItem style={{maxWidth:"35%"}}>
          <LineChart/>
          </EuiFlexItem>
        <EuiFlexItem>

        <EuiBasicTable
        style = {{backgroundColor:"black"}}
            items={rawData}
            columns={columns}
            tableLayout="auto"
          />
          </EuiFlexItem>

        
      
        </EuiFlexGroup>
      </div>
    </div>
  );
};


export default Dashboard;