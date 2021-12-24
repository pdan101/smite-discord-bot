const { default: axios } = require('axios');
const MD5 = require('crypto-js/md5');
const moment = require('moment');
const { devId, authKey } = require('./config.json');
const { SMITE_API } = require('./constants.js');

function getTimestamp() {
  return moment.utc().format('YYYYMMDDHHmmss');
}

function generateSignature(requestName) {
  let timestamp = getTimestamp();
  let str = devId + requestName + authKey + timestamp;
  return MD5(str).toString();
}

//make request to get session_id, store in variable
async function getSessionIdPromise() {
  const signature = generateSignature('createsession');
  const response = await axios.get(
    `${SMITE_API}createsessionJson/${devId}/${signature}/${getTimestamp()}`
  );
  return response.data.session_id;
}

const sessionId = getSessionIdPromise();
sessionId.then((val) => {
  console.log(val);
});

function makeRequest(endpoint, args = []) {
  let signature = generateSignature(endpoint);
  let timestamp = getTimestamp();
  let argsString = args.join('/');
  sessionId.then((sessionid) => {
    axios
      .get(
        `${SMITE_API}${endpoint}Json/${devId}/${signature}/${sessionid}/${timestamp}/${argsString}`
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.data);
      });
  });
}

//makeRequest("getplayer", ["Shinecune101"]);

module.exports = {
  makeRequest: makeRequest,
};