'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spinnable = function () {
    function Spinnable(el, args) {
        _classCallCheck(this, Spinnable);

        this.guid = this.createGUID();
        this.el = el;
        this.data = args.data;
        this.size = args.size || 200;
        this.colors = args.colors || ['#FF6138', '#FFFF9D', '#BEEB9F', '#79BD8F', '#00A388'];
        this.delay = args.delay || 2;
        this.numOfSpins = args.numOfSpins || 2;
        this.repeat = args.repeat || true;
        this.rotation = -90;
        this.value = null;
        this.spinning = false;
        this.repeating = args.repeating;
        this.alreadySelected = [];
        this.availableData = [];
        this.stroke = args.stroke;
        this.borderSize = args.borderSize || 0;
        this.borderColor = args.borderColor || 'transparent';
        this.centerCircleSize = args.centerCircleSize || 20;
        this.centerCircleColor = args.centerCircleColor || '#fff';
        this.arrowColor = args.arrowColor || '#fff';
        this.afterSelected = args.afterSelected || function () {};
        this.afterAllSelected = args.afterAllSelected || function () {};
        this.trueSize = this.size + this.borderSize;

        this.init();
    }

    _createClass(Spinnable, [{
        key: 'init',
        value: function init() {
            this.renderSpinner();
            this.setElements();
            this.parseData();
            this.filterAvailableData();
            this.renderSections();
            this.setEventListeners();
            this.setTransition();
        }
    }, {
        key: 'createGUID',
        value: function createGUID() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4();
        }
    }, {
        key: 'renderSpinner',
        value: function renderSpinner() {
            this.el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" data-guid="' + this.guid + '" style="display: block; margin: 0 auto;" version="1.1" width="' + this.trueSize + '" height="' + this.trueSize + '" viewBox="0 0 ' + this.trueSize + ' ' + this.trueSize + '" preserveAspectRatio>\n                <circle cx="' + this.trueSize / 2 + '" cy="' + this.trueSize / 2 + '" r="' + this.trueSize / 2 + '" fill="' + this.borderColor + '"/>\n                <g transform="translate(' + this.trueSize / 2 + ', ' + this.trueSize / 2 + ')">\n                    <g class="spinner-group" style="transform: rotate(' + this.rotation + 'deg)">\n\n                    </g>\n                </g>\n                <g id="spinner-board"></g>\n                <path id="spinner-arrow" d="M ' + (this.trueSize / 2 - 5) + ' ' + this.trueSize / 2 + ' L ' + (this.trueSize / 2 - 5) + ' ' + this.trueSize / 4 + ' L ' + (this.trueSize / 2 - 12) + ' ' + this.trueSize / 4 + ' L ' + this.trueSize / 2 + ' ' + (this.trueSize / 4 - 20) + ' L ' + (this.trueSize / 2 + 12) + ' ' + this.trueSize / 4 + ' L ' + (this.trueSize / 2 + 5) + ' ' + this.trueSize / 4 + ' ' + (this.trueSize / 2 + 5) + ' ' + this.trueSize / 2 + ' Z" fill="' + this.arrowColor + '" stroke="#222222" style="stroke-width:2px"/>\n                <circle id="spinner-center" cx="' + this.trueSize / 2 + '" cy="' + this.trueSize / 2 + '" r="' + this.centerCircleSize + '" fill="' + this.centerCircleColor + '" stroke="#222222" style="stroke-width:2px"/>\n            </svg>';
        }
    }, {
        key: 'setElements',
        value: function setElements() {
            this.spinnerGroup = document.querySelector('[data-guid=\'' + this.guid + '\'] .spinner-group');
            this.spinnerArrow = document.querySelector('[data-guid=\'' + this.guid + '\'] #spinner-arrow');
            this.spinnerCenter = document.querySelector('[data-guid=\'' + this.guid + '\'] #spinner-center');
        }
    }, {
        key: 'renderSections',
        value: function renderSections() {
            var svgNS = "http://www.w3.org/2000/svg";
            var sections = this.data;
            var sectionWidth = sections[0].endAngle - sections[0].startAngle;

            for (var i = 0; i < sections.length; i++) {
                this.spinnerGroup.innerHTML = this.spinnerGroup.innerHTML + ('<g transform="rotate(' + sectionWidth * i + ')">\n                    <path d="' + sections[i].d + '" fill="' + sections[i].color + '" stroke="#fff" stroke-width="' + (this.stroke || 0) + '"/>\n                </g>');
            }

            if (this.text) {
                for (var _i = 0; _i < this.spinnerGroup.children.length; _i++) {
                    var child = this.spinnerGroup.children[_i];
                    var text = document.createElementNS(svgNS, 'text');
                    text.setAttribute('x', this.trueSize / 4);
                    text.setAttribute('y', this.trueSize / 4);
                    text.innerHTML = this.data[_i].datum;
                    console.log(text);
                    child.appendChild(text);
                    console.log(child);
                }
            }
        }
    }, {
        key: 'parseData',
        value: function parseData() {
            var _this = this;

            var endAngle = 0;
            var startAngle = 0;
            var percentOfWhole = 1 / this.data.length;
            this.data = this.data.map(function (datum, index) {
                startAngle = endAngle;
                endAngle = startAngle + 360 * percentOfWhole;

                var x1 = void 0,
                    x2 = void 0,
                    y1 = void 0,
                    y2 = void 0;

                x1 = parseInt(Math.round(_this.size / 2 * Math.cos(Math.PI * 0 / 180)));
                y1 = parseInt(Math.round(_this.size / 2 * Math.sin(Math.PI * 0 / 180)));

                x2 = parseInt(Math.round(_this.size / 2 * Math.cos(Math.PI * (360 * percentOfWhole) / 180)));
                y2 = parseInt(Math.round(_this.size / 2 * Math.sin(Math.PI * (360 * percentOfWhole) / 180)));

                var d = 'M0,0  L' + x1 + ',' + y1 + ('  A' + _this.size / 2 + ',' + _this.size / 2 + ' 0 ') + (360 * percentOfWhole - 0 > 180 ? 1 : 0) + ',1 ' + x2 + ',' + y2 + ' z';

                return { datum: datum, startAngle: startAngle, endAngle: endAngle, d: d, color: _this.colors[index] };
            });

            console.log(this.data);
        }
    }, {
        key: 'rotateSpinner',
        value: function rotateSpinner() {
            var _this2 = this;

            if (!this.spinning) {
                (function () {
                    _this2.spinning = true;
                    var datum = _this2.availableData[Math.floor(Math.random() * _this2.availableData.length)];
                    if (!_this2.repeating) _this2.updateSelected(datum);
                    var diff = _this2.rotation % 360;
                    var magnitude = Math.random() + 1;
                    _this2.rotation = _this2.rotation + (_this2.numOfSpins * 360 + (360 - datum.endAngle + Math.floor(Math.random() * ((datum.endAngle - datum.startAngle) / 2) * magnitude)) - 90 - diff);
                    _this2.spinnerGroup.style.transform = 'rotate(' + _this2.rotation + 'deg)';

                    // Call the function to handle the selected piece of data.
                    setTimeout(function () {
                        _this2.afterSelected(datum);
                        if (!_this2.repeating && _this2.availableData.length === 0) _this2.afterAllSelected(datum);
                    }, _this2.delay * 1000);

                    // Set spinning bool to false so user can click again.
                    setTimeout(function () {
                        _this2.spinning = false;
                    }, _this2.delay * 1000);
                })();
            }
        }
    }, {
        key: 'updateSelected',
        value: function updateSelected(datum) {
            this.alreadySelected.push(datum);
            this.filterAvailableData();
        }
    }, {
        key: 'filterAvailableData',
        value: function filterAvailableData() {
            var _this3 = this;

            this.availableData = this.data.filter(function (datum) {
                return _this3.alreadySelected.indexOf(datum) === -1;
            });
        }
    }, {
        key: 'setEventListeners',
        value: function setEventListeners() {
            this.spinnerGroup.addEventListener('click', this.rotateSpinner.bind(this));
            this.spinnerArrow.addEventListener('click', this.rotateSpinner.bind(this));
            this.spinnerCenter.addEventListener('click', this.rotateSpinner.bind(this));
        }
    }, {
        key: 'setTransition',
        value: function setTransition() {
            var elem = this.spinnerGroup;
            elem.style.WebkitTransition = this.delay + 's';
            elem.style.mozTransition = this.delay + 's';
            elem.style.msTransition = this.delay + 's';
            elem.style.oTransition = this.delay + 's';
        }
    }]);

    return Spinnable;
}();