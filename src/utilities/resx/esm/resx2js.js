import xml2js from 'xml2js';
var parser = new xml2js.Parser();
var resx2jsClb = function resx2jsClb(str, withComments, cb) {
  if (!cb && typeof withComments === 'function') {
    cb = withComments;
    withComments = false;
  }
  if (typeof str !== 'string') return cb(new Error('The first parameter was not a string'));
  var result = {};
  parser.parseString(str, function (err, data) {
    if (err) return cb(err);
    if (data && data.root && data.root.data && data.root.data.length > 0) {
      data.root.data.forEach(function (d) {
        if (d && d.$ && d.$.name && d.value && d.value.length > 0) {
          var key = d.$.name;
          var value = d.value[0];
          if (!withComments) {
            result[key] = value;
          } else {
            result[key] = {
              value: value
            };
            if (d.comment) {
              var comment = d.comment[0];
              result[key].comment = comment;
            }
          }
        }
      });
    }
    cb(null, result);
  });
};
export default function resx2js(str, withComments, cb) {
  if (!cb && withComments === undefined) {
    return new Promise(function (resolve, reject) {
      return resx2jsClb(str, withComments, function (err, ret) {
        return err ? reject(err) : resolve(ret);
      });
    });
  }
  if (!cb && typeof withComments !== 'function') {
    return new Promise(function (resolve, reject) {
      return resx2jsClb(str, withComments, function (err, ret) {
        return err ? reject(err) : resolve(ret);
      });
    });
  }
  resx2jsClb(str, withComments, cb);
}