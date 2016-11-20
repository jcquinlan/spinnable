class Spinnable {
    constructor(el, args) {
        this.guid = this.createGUID();
        this.el = el;
        this.data = args.data;
        this.size = args.size || 200;
        this.colors = args.colors || ['#FF6138', '#FFFF9D', '#BEEB9F', '#79BD8F', '#00A388', ];
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
        this.afterSelected = args.afterSelected || function(){};
        this.afterAllSelected = args.afterAllSelected || function(){};
        this.trueSize = this.size + this.borderSize;

        this.init();
    }

    init() {
        this.renderSpinner();
        this.setElements();
        this.parseData();
        this.filterAvailableData();
        this.renderSections();
        this.setEventListeners();
        this.setTransition();
    }

    createGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }

    renderSpinner() {
        this.el.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" data-guid="${ this.guid }" style="display: block; margin: 0 auto;" version="1.1" width="${ this.trueSize }" height="${ this.trueSize }" viewBox="0 0 ${ this.trueSize } ${ this.trueSize }" preserveAspectRatio>
                <circle cx="${ this.trueSize / 2 }" cy="${ this.trueSize / 2 }" r="${ this.trueSize / 2 }" fill="${ this.borderColor }"/>
                <g transform="translate(${ this.trueSize / 2 }, ${ this.trueSize / 2 })">
                    <g class="spinner-group" style="transform: rotate(${ this.rotation }deg)">

                    </g>
                </g>
                <g id="spinner-board"></g>
                <path id="spinner-arrow" d="M ${this.trueSize/2-5} ${this.trueSize/2} L ${this.trueSize/2-5} ${ this.trueSize/4} L ${this.trueSize/2-12} ${ this.trueSize/4} L ${this.trueSize/2} ${this.trueSize/4-20} L ${this.trueSize/2+12} ${ this.trueSize/4} L ${this.trueSize/2+5} ${ this.trueSize/4} ${this.trueSize/2+5} ${this.trueSize/2} Z" fill="#EEEEEE" stroke="#222222" style="stroke-width:2px"/>
                <circle cx="${ this.trueSize / 2 }" cy="${ this.trueSize / 2 }" r="18" fill="#444444" stroke="#222222" style="stroke-width:2px"/>
            </svg>`;
    }

    setElements() {
        this.spinnerGroup = document.querySelector(`[data-guid='${ this.guid }'] .spinner-group`);
    }

    renderSections() {
        let svgNS = "http://www.w3.org/2000/svg";
        let sections = this.data;
        let sectionWidth = sections[0].endAngle - sections[0].startAngle;

        for(let i = 0; i < sections.length; i++){
            this.spinnerGroup.innerHTML =
                this.spinnerGroup.innerHTML +
                `<g transform="rotate(${  sectionWidth * i })">
                    <path d="${ sections[i].d }" fill="${ sections[i].color }" stroke="#fff" stroke-width="${ this.stroke || 0}"/>
                </g>`;
        }

        if(this.text) {
            for(let i = 0; i < this.spinnerGroup.children.length; i++){
                let child = this.spinnerGroup.children[i];
                let text = document.createElementNS(svgNS, 'text');
                text.setAttribute('x', this.trueSize / 4);
                text.setAttribute('y', this.trueSize / 4);
                text.innerHTML = this.data[i].datum;
                console.log(text);
                child.appendChild(text)
                console.log(child);
            }
        }
    }

    parseData() {
      let endAngle = 0
      let startAngle = 0
      let percentOfWhole = 1 / this.data.length;
      this.data = this.data.map((datum, index) => {
        startAngle = endAngle
        endAngle = startAngle + (360 * percentOfWhole)

        let x1, x2, y1, y2;

        x1 = parseInt(Math.round((this.size / 2) * Math.cos(Math.PI * 0 / 180)))
        y1 = parseInt(Math.round((this.size / 2) * Math.sin(Math.PI * 0 / 180)))

        x2 = parseInt(Math.round((this.size / 2) * Math.cos(Math.PI * (360 * percentOfWhole) / 180)))
        y2 = parseInt(Math.round((this.size / 2) * Math.sin(Math.PI * (360 * percentOfWhole) / 180)))

        let d = 'M0,0  L' + x1 + ',' + y1 + `  A${ this.trueSize / 2 },${ this.trueSize / 2 } 0 ` +
        (((360 * percentOfWhole) - 0 > 180) ? 1 : 0) + ',1 ' + x2 + ',' + y2 + ' z'

        return { datum, startAngle, endAngle, d, color: this.colors[index] }
      })

      console.log(this.data);
    }

    rotateSpinner () {

      if(!this.spinning){
          this.spinning = true;
          let datum = this.availableData[Math.floor(Math.random() * this.availableData.length)];
          if(!this.repeating) this.updateSelected(datum)
          let diff = this.rotation % 360;
          let magnitude = Math.random() + 1;
          this.rotation = this.rotation + ((this.numOfSpins * 360) + (360 - datum.endAngle + Math.floor(Math.random() * ((datum.endAngle - datum.startAngle) / 2) * magnitude)) - 90 - diff);
          this.spinnerGroup.style.transform = `rotate(${ this.rotation }deg)`;

          // Call the function to handle the selected piece of data.
          setTimeout(() => {
              this.afterSelected(datum);
              if(!this.repeating && this.availableData.length === 0) this.afterAllSelected(datum);
          }, this.delay * 1000);

          // Set spinning bool to false so user can click again.
          setTimeout(() => { this.spinning = false }, this.delay * 1000)
      }
    }

    updateSelected(datum) {
        this.alreadySelected.push(datum);
        this.filterAvailableData();
    }

    filterAvailableData() {
        this.availableData = this.data.filter(datum => {
            return this.alreadySelected.indexOf(datum) === -1;
        });
    }

    setEventListeners() {
        this.spinnerGroup.addEventListener('click', this.rotateSpinner.bind(this));
    }

    setTransition() {
        let elem = this.spinnerGroup;
        elem.style.WebkitTransition = `${ this.delay }s`;
        elem.style.mozTransition = `${ this.delay }s`;
        elem.style.msTransition = `${ this.delay }s`;
        elem.style.oTransition = `${ this.delay }s`;
    }
}
