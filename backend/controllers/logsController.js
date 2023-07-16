const axios = require('axios')
// const logsDB = require('../dbServices/logsDB.js');


const parseApacheLogs = (logEntry) => {
    const tokens = logEntry.split(' ');
    console.log(tokens, "toks")
    if (tokens != '') {
        const ipAddress = tokens[0];
        const dateTime = tokens[3]?.slice(1) + ' ' + tokens[4]?.slice(0, -1);
        const httpStatus = tokens[8] ?? ''
        const responseSize = tokens[9] ?? ''
        const requestTokens = logEntry.match(/"(.*?)"/g);
        const httpMethod = requestTokens[0]?.slice(1, -1).split(' ')[0];
        const url = requestTokens[0]?.slice(1, -1).split(' ')[1];
        let data = {
            ipAddress,
            dateTime,
            httpMethod,
            url,
            httpStatus,
            responseSize,
        };
        console.log(data)
        console.log(tokens, "toks")

        return data;
    }
};


const parseNginxLogs = (logEntry) => {
    if (logEntry!= ''){
    const tokens = logEntry.split(' ');
    console.log(tokens)
    const ipAddress = tokens[0];
    const dateTime = tokens[3]?.slice(1) + ' ' + tokens[4]?.slice(0, -1);
    const requestTokens = logEntry.match(/"(.*?)"/g);
    const httpMethod = requestTokens[0]?.slice(1, -1).split(' ')[0];
    const url = requestTokens[0].slice(1, -1).split(' ')[1];
    const httpStatus = tokens[8] ?? '';
    const responseSize = tokens[9] ?? '';
  
    return {
      ipAddress,
      dateTime,
      httpMethod,
      url,
      httpStatus,
      responseSize,
    };
}
  };
  
const populateLogs = async (req, res) => {

    const apacheLogsUrl = "https://raw.githubusercontent.com/shr-saroj/sample-logs/main/apache_logs";
    const nginxLogsUrl = "https://raw.githubusercontent.com/shr-saroj/sample-logs/main/nginx_logs"

    const nginxLogFile = await axios.get(nginxLogsUrl);
    const apacheLogFile = await axios.get(apacheLogsUrl);

    const apachelogEntries = apacheLogFile.data.split('\n');
    const nginxlogEntries = nginxLogFile.data.split('\n');

    var apacheEntries = []
    var nginxEntries = []
    for (entry of apachelogEntries) {
        console.log("entry", entry)
        if (entry != ''){
        let data = parseApacheLogs(entry)
        data.raw = entry
        apacheEntries.push(data);
        }
    }

    for (entry of nginxlogEntries) {
        if(entry != ''){
        console.log("entry", entry)
        let data = parseNginxLogs(entry)
        nginxEntries.push(data);
        }
    }

    console.log(nginxEntries,"entroies nginx")
}

module.exports = {
    populateLogs
}