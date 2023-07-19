const axios = require('axios')
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
    console.log("match", match)
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


const getbarData = async (dates, source) => {
    const date = moment("2015/05/17", "YYYY/MM/DD").toDate();
    const upto = moment(date).endOf('day').toDate();
    const query = {

    };

    if (source) {
        query.source = source;
    }
    if (dates) {
        query.dateTime = {
            $gte: dates.start,
            $lt: dates.end,
        }
    }
    const logs = await LogModel.find(query);


    const hours = Array.from({ length: 24 }, (_, i) => i);

    const eventCounts = hours.reduce((acc, hour) => {
        acc[hour] = 0;
        return acc;
    }, {});

    const responseSizesPerHour = hours.reduce((acc, hour) => {
        acc[hour] = 0;
        return acc;
      }, {});
      
      logs.forEach((log) => {
        const logHour = new Date(log.dateTime).getHours();
        const responseSize = parseInt(log.responseSize, 10)/1024;
        responseSizesPerHour[logHour] += isNaN(responseSize) ? 0 : responseSize;
        eventCounts[logHour]++;
      });
      const sizeLabels = Object.keys(responseSizesPerHour);
      const sizeData = Object.values(responseSizesPerHour);
   
        
    const chartLabels = Object.keys(eventCounts);
    const chartDatas = Object.values(eventCounts);
    const lineData = Object.values(responseSizesPerHour);
    return { chartLabels, chartDatas ,sizeData}
}

const getReqCount = async (parameter, match) => {
    const result = await LogModel.aggregate([
        { $match: match },
        { $group: { _id: `$${parameter}`, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    return result
}




const getData = async (req, res) => {
    try {
        let source = ''
        if (req.user != 'admin') {
            console.log("not admin", req.user)
            source = req.user;
        }
        if (req.query.dateFrom && req.query.dateTo) {
            console.log("date", date)
            var dates = { $gte: req.query.dateFrom, $lte: req.query.dateTo }

        }
        const match = source ? { "source": source } : {};
        console.log(match, "match")
        const activeIP = await getMostRepeated('ipAddress', match, dates);
        const commonReq = await getReqCount('httpMethod', match, dates);
        const count = await LogModel.countDocuments(match, { query: dates });
        const chartsData = await getbarData(dates, source);
        const statusData = await getReqCount('httpStatus', match, dates);
        const userAgents = await getReqCount('userAgent',match)
        const responseChart = chartsData.sizeData;
        const barData = {
            chartLabels : chartsData.chartLabels,
            chartData : chartsData.chartDatas
        }

        console.log(chartsData,"asdasd")
        res.status(200).json({
            message : "Success",
            data :  {
            activeIP,
            commonReq,
            count,
            barData,
            statusData,
            userAgents,
            responseChart,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Error",
            error: error.message,
        })
    }
}


const getTableData = async (req, res) => {
    try {

        const page = req.query.page || 1;
        const pageSize = 20;
        let source = ''
        if (req.user != 'admin') {
            console.log("not admin", req.user)
            source = req.user;
        }
        let query = {}
        if (req.date) {
            query = {
                dateTime: {
                    $gte: date,
                    $lt: upto,
                }
            }
        };

        if (source) {
            query.source = source;
        }
        const logData = await LogModel.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            message : "success",
            logData });
    } catch (err) {
        console.log(err, "err")
        res.status(400).json({ error: err.message });
    }

}

module.exports = {
    populateLogs,
    getData,
    getTableData
}