(function(){
      const modules = {"0":"use strict";

var _message = _interopRequireDefault(require("./message.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_message["default"]);,"1":"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _name = require("./name.js");

var _default = "hello ".concat(_name.nickname, "!");

exports["default"] = _default;,"2":"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nickname = void 0;
var nickname = '宝贝儿';
exports.nickname = nickname;,};
      const exec = function (moduleId) {
        const fn = modules[moduleId];
        let exports = {};
        const require = function (filename) {
          const dirname = path.dirname(module.id);
          const absolutePath = path.join(dirname, filename);
          return exec(absolutePath);
        };
        fn(require, exports);
        return exports;
      };
      exec("./index.js");
    })()