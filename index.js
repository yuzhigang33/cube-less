var path = require('path');
var less = require('less');
var fs = require('fs');

function LessProcessor(cube) {
  this.cube = cube;
}
LessProcessor.info = {
  type: 'style',
  ext: '.less'
};

LessProcessor.prototype = {
  process: function (file, options, callback) {
    var root = options.root;
    var code = fs.readFileSync(path.join(root, file)).toString();
    var codeRes;
    var lessParser = new(less.Parser)({
      paths: [root]
    });
    var self = this;
    lessParser.parse(code, function (err, tree) {
      if (err) {
        return callback(err);
      }
      codeRes = tree.toCSS({
        compress: options.compress
      });

      var res = {
        source: code,
        code: codeRes
      };

      if (options.moduleWrap) {
        res.wraped = self.cube.wrapStyle(options.qpath, codeRes);
      }
      callback(null, res);
    });
  }
};


module.exports = LessProcessor;