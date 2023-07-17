const db = require('./db');

const uploadBulkData = async( apacheData,nginxData) =>{
   await db.indices.create({
        index: 'apache',
        body: {
          mappings: {
            properties: {
              ipAddress: { type: 'ip' },
              dateTime: { type: 'date', format: 'dd/MM/yyyy:HH:mm:ss Z' },
              httpMethod: { type: 'keyword' },
              url: { type: 'text' },
              httpStatus: { type: 'integer' },
              responseSize: { type: 'integer' },
              raw: { type: 'text' },
            },
          },
        },
      });

    //  await db.indices.create({
    //     index: 'nginx',
    //     body: {
    //       mappings: {
    //         properties: {
    //           ipAddress: { type: 'ip' },
    //           dateTime: { type: 'date', format: 'dd/MM/yyyy:HH:mm:ss Z' },
    //           httpMethod: { type: 'keyword' },
    //           url: { type: 'text' },
    //           httpStatus: { type: 'integer' },
    //           responseSize: { type: 'integer' },
    //           raw: { type: 'text' },
    //         },
    //       },
    //     },
    //   });
    const apacheResponse =  await db.bulk({ refresh: true, body : apacheData });
    const nginxRespone = await db.bulk({refresh : true, body : nginxData});
    console.log(apacheResponse,nginxRespone);
    return {apacheResponse,nginxRespone}
}

const  getTopValue  = async (parameter) => {
  try {
    const response = await db.search({
      index: "apache",
      body: {
        aggs: {
          frequent_ips: {
            terms: {
              field: "doc.ipAddress",
              order: { _count: "desc" }
            },
            aggs: {
              count: {
                cardinality: {
                  field: "doc.ipAddress"
                }
              }
            }
          }
        }
      }
    });
    console.log(response.body,"asd")

    const topBucket = response.body.aggregations.frequent_ips.buckets[0];
    const mostRepeatedIPAddress = topBucket.key;
    const repetitionCount = topBucket.doc_count;
    const uniqueCount = topBucket.count.value;

    console.log(
      `The most repeated IP address in the 'apache' index is '${mostRepeatedIPAddress}' with a count of ${repetitionCount}. (Unique IP count: ${uniqueCount})`
    );
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = {
    uploadBulkData,
    getTopValue
}