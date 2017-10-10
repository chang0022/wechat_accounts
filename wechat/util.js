'use strict'

const xml2js = require('xml2js');

exports.parseXMLAsync = (xml) => (
  new Promise((reslove, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if(err) reject(err)
      else reslove(content)
    })
  })
)

function formatMessage(result) {
  const message = {};
  if(typeof result === 'object') {
    const keys = Object.keys(result);

    for (let i = 0; i < keys.length; i++) {
      const item = result[keys[i]];
      const key = keys[i];

      if(!(item instanceof Array) || item.length === 0) {
        continue;
      }

      if(item.length === 1) {
        const val = item[0];

        if(typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];

        for (let j = 0, k = item.length; j < k; j++) {
          message[key].push(formatMessage(item[j]));
        }
      }
    }
  }

  return message;
}

exports.formatMessage = formatMessage;