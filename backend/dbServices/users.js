const db = require('./db');


const checkUser = async (username) =>{

  const response = await db.search({
    index: 'users',
    body: {
      query: {
        match: {
          username: {
            query: username,
            operator: 'and'
          }
        }
      }
    }
  });

  const hits = response.body.hits.hits;
  console.log(hits,"hits")
  return hits;
}

const registerUser = async (user) => {
  const { body } = await db.index({
    index: 'users',
    body: user,
  });
  console.log("body",body);
    return body;

};


module.exports = {
  registerUser,
  checkUser
}
