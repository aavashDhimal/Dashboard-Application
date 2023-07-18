const axios = require('axios')
const logsDB = require('../dbServices/logsDB.js');
const LogModel = require('../models/logsModel.js')
const moment = require('moment');


const parseApacheLogs = (logEntry) => {
    const tokens = logEntry.split(' ');
    console.log(tokens, "toks")
    if (tokens != '') {
        const ipAddress = tokens[0];
        const dateStr = tokens[3]?.slice(1) + ' ' + tokens[4]?.slice(0, -1);
        const dateTime = moment(dateStr, "DD/MMM/YYYY:HH:mm:ss Z");

        const httpStatus = tokens[8] ?? ''
        const responseSize = tokens[9] ?? ''
        const requestTokens = logEntry.match(/"(.*?)"/g);
        const httpMethod = requestTokens[0]?.slice(1, -1).split(' ')[0];
        const url = requestTokens[0]?.slice(1, -1).split(' ')[1];
        const userAgent = tokens[11]?.replace(/"/g, '');


        let uploadData = {
            source: "apache",
            ipAddress,
            dateTime,
            httpMethod,
            url,
            httpStatus,
            responseSize,
            raw: logEntry,
            userAgent,
        }

        return uploadData;
    }
};


const parseNginxLogs = (logEntry) => {
    if (logEntry != '') {
        const tokens = logEntry.split(' ');
        console.log(tokens)
        const ipAddress = tokens[0];
        const dateStr = tokens[3]?.slice(1) + ' ' + tokens[4]?.slice(0, -1);
        const dateTime = moment(dateStr, "DD/MMM/YYYY:HH:mm:ss Z");
        const requestTokens = logEntry.match(/"(.*?)"/g);
        const httpMethod = requestTokens[0]?.slice(1, -1).split(' ')[0];
        const url = requestTokens[0].slice(1, -1).split(' ')[1];
        const httpStatus = tokens[8] ?? '';
        const responseSize = tokens[9] ?? '';
        const userAgent = tokens[11] ?? '';



        let uploadData = {
            source: 'nginx',
            ipAddress,
            dateTime,
            httpMethod,
            url,
            httpStatus,
            responseSize,
            userAgent,
            raw: logEntry
        }

        return uploadData;
    }
};

const populateLogs = async (req, res) => {
    try {
        const apacheLogsUrl = "https://raw.githubusercontent.com/shr-saroj/sample-logs/main/apache_logs";
        const nginxLogsUrl = "https://raw.githubusercontent.com/shr-saroj/sample-logs/main/nginx_logs"

        const nginxLogFile = await axios.get(nginxLogsUrl);
        const apacheLogFile = await axios.get(apacheLogsUrl);

        const apachelogEntries = apacheLogFile.data.split('\n');
        const nginxlogEntries = nginxLogFile.data.split('\n');

        var logEntries = []
        for (entry of apachelogEntries) {
            console.log("entry", entry)
            if (entry != '') {
                let data = parseApacheLogs(entry)
                logEntries.push(data);
            }
        }

        for (entry of nginxlogEntries) {
            if (entry != '') {
                console.log("entry", entry)
                let data = parseNginxLogs(entry)
                logEntries.push(data);
            }
        }
        const result = await LogModel.insertMany(logEntries)

        console.log(logEntries[0], "asdasdasda", logEntries[55000])
        res.status(200).json({
            message: "success",
            results: result
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "errpr",
            error: error.message
        })
    }
}


const getMostRepeated = async (parameter, match) => {
    console.log("match",match)
    const repeatedIP = await LogModel.aggregate([
        { $match: match },
        {
            $group: {
                _id: `$${parameter}`,
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 1
        }
    ]);
    if (repeatedIP.length > 0) {
        const mostRepeated = repeatedIP[0]._id;
        const count = repeatedIP[0].count;
        return { count, mostRepeated }
    }
}


const getbarData = async (selectedDays, source) => {
    const date = moment("2015/05/17", "YYYY/MM/DD").toDate();
    const upto = moment(date).endOf('day').toDate();
    const query = {
        dateTime: {
            $gte: date,
            $lt: upto,
        }
    };

    if (source) {
        query.source = source;
    }

    const logs = await LogModel.find(query);


    const hours = Array.from({ length: 24 }, (_, i) => i);

    const eventCounts = hours.reduce((acc, hour) => {
        acc[hour] = 0;
        return acc;
    }, {});

    logs.forEach((log) => {
        const logHour = new Date(log.dateTime).getHours();
        eventCounts[logHour]++;
    });

    const chartLabels = Object.keys(eventCounts);
    const chartData = Object.values(eventCounts);
    return { chartLabels, chartData }
}

const getReqCount = async (parameter,match) => {
    const result = await LogModel.aggregate([
        { $match:  match},
        { $group: { _id: `$${parameter}`, count: { $sum: 1 } } },
        { $sort: { _id: 1 } } // Optional: Sort the result by status code
    ]);
    return result
}

const getResponseChart = async (selectedDays, source) =>{
const date = moment("2015/05/17", "YYYY/MM/DD").toDate();
const upto = moment(date).endOf('day').toDate();
const query = {
  dateTime: {
    $gte: date,
    $lt: upto,
  }
};

if (source) {
  query.source = source;
}

const logs = await LogModel.find(query);

const hours = Array.from({ length: 24 }, (_, i) => i);

const responseSizesPerHour = hours.reduce((acc, hour) => {
  acc[hour] = 0;
  return acc;
}, {});

logs.forEach((log) => {
  const logHour = new Date(log.dateTime).getHours();
  responseSizesPerHour[logHour] += parseInt(log.responseSize, 10); // Assuming responseSize is stored as a string, convert it to a number.
});

const chartLabels = Object.keys(responseSizesPerHour);
const chartData = Object.values(responseSizesPerHour);
return (chartLabels,chartData);
}


const getData = async (req, res) => {
    try {
        let source = req.query.source ?? ''
        const match = source ? { "source": source } : {};
        console.log(match,"match")
        const activeIP = await getMostRepeated('ipAddress',match);
        const commonReq = await getReqCount('httpMethod',match);
        const count = await LogModel.countDocuments(match);
        const barData = await getbarData('', source);
        const statusData = await getReqCount('httpStatus',match);
        const userAgents = await LogModel.aggregate([
            { $match: match },
            { $group: { _id: '$userAgent' } },
            { $project: { _id: 0, userAgent: '$_id' } } 
          ]);
          const responseChart = await getResponseChart('', source);

        console.log(activeIP, "repIP", commonReq, "count", count, "status", statusData,);
        res.status(200).json({
            activeIP,
            commonReq,
            count,
            barData,
            statusData,
            userAgents,
            responseChart,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Error",
            error: error.message,
        })
    }
}


module.exports = {
    populateLogs,
    getData
}