'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _detail = require('../../db/models/detail');

var _detail2 = _interopRequireDefault(_detail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Detail = {
  image: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argDetail) {
      var detail;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _detail2.default.findById(argDetail.id);

            case 3:
              detail = _context.sent;
              _context.next = 6;
              return detail.getImage();

            case 6:
              return _context.abrupt('return', _context.sent);

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](0);

              console.error(_context.t0);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 9]]);
    }));

    function image(_x) {
      return _ref.apply(this, arguments);
    }

    return image;
  }(),
  additionalImages: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argDetail) {
      var detail;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _detail2.default.findById(argDetail.id);

            case 3:
              detail = _context2.sent;
              _context2.next = 6;
              return detail.getAdditionalImages();

            case 6:
              return _context2.abrupt('return', _context2.sent);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2['catch'](0);

              console.error(_context2.t0);

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 9]]);
    }));

    function additionalImages(_x2) {
      return _ref2.apply(this, arguments);
    }

    return additionalImages;
  }()
};

exports.default = Detail;