"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = js2resx;
var _xml2js = _interopRequireDefault(require("xml2js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var js2resxClb = function js2resxClb(resources, opt, cb) {
  if (!cb && typeof opt === 'function') {
    cb = opt;
    opt = {
      pretty: true,
      indent: '  ',
      newline: '\n'
    };
  }
  opt = opt || {
    pretty: true,
    indent: '  ',
    newline: '\n'
  };
  var builder = new _xml2js.default.Builder({
    rootName: 'root',
    headless: false,
    renderOpts: {
      pretty: opt.pretty !== false,
      indent: opt.indent || '  ',
      newline: opt.newline || '\n'
    },
    xmldec: {
      version: '1.0',
      encoding: 'utf-8'
    }
  });
  var resxJs = {
    $: {},
    'xsd:schema': {
      $: {
        id: 'root',
        xmlns: '',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        'xmlns:msdata': 'urn:schemas-microsoft-com:xml-msdata'
      },
      'xsd:import': {
        $: {
          namespace: 'http://www.w3.org/XML/1998/namespace'
        }
      },
      'xsd:element': {
        $: {
          name: 'root',
          'msdata:IsDataSet': 'true'
        },
        'xsd:complexType': {
          'xsd:choice': {
            $: {
              maxOccurs: 'unbounded'
            },
            'xsd:element': [{
              $: {
                name: 'metadata'
              },
              'xsd:complexType': {
                'xsd:sequence': {
                  'xsd:element': {
                    $: {
                      name: 'value',
                      type: 'xsd:string',
                      minOccurs: '0'
                    }
                  }
                },
                'xsd:attribute': [{
                  $: {
                    name: 'name',
                    use: 'required',
                    type: 'xsd:string'
                  }
                }, {
                  $: {
                    name: 'type',
                    type: 'xsd:string'
                  }
                }, {
                  $: {
                    name: 'mimetype',
                    type: 'xsd:string'
                  }
                }, {
                  $: {
                    ref: 'xml:space'
                  }
                }]
              }
            }, {
              $: {
                name: 'assembly'
              },
              'xsd:complexType': {
                'xsd:attribute': [{
                  $: {
                    name: 'alias',
                    type: 'xsd:string'
                  }
                }, {
                  $: {
                    name: 'name',
                    type: 'xsd:string'
                  }
                }]
              }
            }, {
              $: {
                name: 'data'
              },
              'xsd:complexType': {
                'xsd:sequence': {
                  'xsd:element': [{
                    $: {
                      name: 'value',
                      type: 'xsd:string',
                      minOccurs: '0',
                      'msdata:Ordinal': '1'
                    }
                  }, {
                    $: {
                      name: 'comment',
                      type: 'xsd:string',
                      minOccurs: '0',
                      'msdata:Ordinal': '2'
                    }
                  }]
                },
                'xsd:attribute': [{
                  $: {
                    name: 'name',
                    type: 'xsd:string',
                    use: 'required',
                    'msdata:Ordinal': '1'
                  }
                }, {
                  $: {
                    name: 'type',
                    type: 'xsd:string',
                    'msdata:Ordinal': '3'
                  }
                }, {
                  $: {
                    name: 'mimetype',
                    type: 'xsd:string',
                    'msdata:Ordinal': '4'
                  }
                }, {
                  $: {
                    ref: 'xml:space'
                  }
                }]
              }
            }, {
              $: {
                name: 'resheader'
              },
              'xsd:complexType': {
                'xsd:sequence': {
                  'xsd:element': {
                    $: {
                      name: 'value',
                      type: 'xsd:string',
                      minOccurs: '0',
                      'msdata:Ordinal': '1'
                    }
                  }
                },
                'xsd:attribute': {
                  $: {
                    name: 'name',
                    type: 'xsd:string',
                    use: 'required'
                  }
                }
              }
            }]
          }
        }
      }
    },
    resheader: [{
      $: {
        name: 'resmimetype'
      },
      value: 'text/microsoft-resx'
    }, {
      $: {
        name: 'version'
      },
      value: '2.0'
    }, {
      $: {
        name: 'reader'
      },
      value: 'System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'
    }, {
      $: {
        name: 'writer'
      },
      value: 'System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'
    }],
    data: []
  };
  Object.keys(resources).sort().forEach(function (key) {
    var str = {
      $: {
        name: key,
        'xml:space': 'preserve'
      },
      value: resources[key]
    };
    if (_typeof(resources[key]) === 'object' && resources[key].value) {
      str.value = resources[key].value;
      str.comment = resources[key].comment;
    }
    resxJs.data.push(str);
  });
  var xml = builder.buildObject(resxJs);
  xml = xml.replace('<root>', "<root>\n  <!--\n    Microsoft ResX Schema\n\n    Version 2.0\n\n    The primary goals of this format is to allow a simple XML format\n    that is mostly human readable. The generation and parsing of the\n    various data types are done through the TypeConverter classes\n    associated with the data types.\n\n    Example:\n\n    ... ado.net/XML headers & schema ...\n    <resheader name=\"resmimetype\">text/microsoft-resx</resheader>\n    <resheader name=\"version\">2.0</resheader>\n    <resheader name=\"reader\">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>\n    <resheader name=\"writer\">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>\n    <data name=\"Name1\"><value>this is my long string</value><comment>this is a comment</comment></data>\n    <data name=\"Color1\" type=\"System.Drawing.Color, System.Drawing\">Blue</data>\n    <data name=\"Bitmap1\" mimetype=\"application/x-microsoft.net.object.binary.base64\">\n        <value>[base64 mime encoded serialized .NET Framework object]</value>\n    </data>\n    <data name=\"Icon1\" type=\"System.Drawing.Icon, System.Drawing\" mimetype=\"application/x-microsoft.net.object.bytearray.base64\">\n        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>\n        <comment>This is a comment</comment>\n    </data>\n\n    There are any number of \"resheader\" rows that contain simple\n    name/value pairs.\n\n    Each data row contains a name, and value. The row also contains a\n    type or mimetype. Type corresponds to a .NET class that support\n    text/value conversion through the TypeConverter architecture.\n    Classes that don't support this are serialized and stored with the\n    mimetype set.\n\n    The mimetype is used for serialized objects, and tells the\n    ResXResourceReader how to depersist the object. This is currently not\n    extensible. For a given mimetype the value must be set accordingly:\n\n    Note - application/x-microsoft.net.object.binary.base64 is the format\n    that the ResXResourceWriter will generate, however the reader can\n    read any of the formats listed below.\n\n    mimetype: application/x-microsoft.net.object.binary.base64\n    value   : The object must be serialized with\n            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter\n            : and then encoded with base64 encoding.\n\n    mimetype: application/x-microsoft.net.object.soap.base64\n    value   : The object must be serialized with\n            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter\n            : and then encoded with base64 encoding.\n\n    mimetype: application/x-microsoft.net.object.bytearray.base64\n    value   : The object must be serialized into a byte array\n            : using a System.ComponentModel.TypeConverter\n            : and then encoded with base64 encoding.\n    -->");
  if (cb) cb(null, xml);
  return xml;
};
function js2resx(resources, opt, cb) {
  if (!cb && opt === undefined) {
    return new Promise(function (resolve, reject) {
      return js2resxClb(resources, opt, function (err, ret) {
        return err ? reject(err) : resolve(ret);
      });
    });
  }
  if (!cb && typeof opt !== 'function') {
    return new Promise(function (resolve, reject) {
      return js2resxClb(resources, opt, function (err, ret) {
        return err ? reject(err) : resolve(ret);
      });
    });
  }
  js2resxClb(resources, opt, cb);
}
module.exports = exports.default;