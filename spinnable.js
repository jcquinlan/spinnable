class Spinnable {
    constructor(el, args) {
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
        this.guid = this.createGUID();
        this.afterSelected = args.afterSelected || function(){};

        this.init();
    }

    init() {
        this.checkForRequired();
        this.renderSpinner();
        this.setElements();
        this.parseData();
        this.renderSections();
        this.setEventListeners();
        this.setTransition();
    }

    checkForRequired() {
        if(!this.data) throw `No data supplied for Spinnable instance: ${ this.guid }`;
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
            `<svg xmlns="http://www.w3.org/2000/svg" data-guid="${ this.guid }" style="display: block; margin: 0 auto;" version="1.1" width="${ this.size }" height="${ this.size }" viewBox="0 0 ${ this.size } ${ this.size }" preserveAspectRatio>
                <circle cx="${ this.size / 2 }" cy="${ this.size / 2 }" r="${ this.size / 2 - 20}" fill="#222222"/>
                <g transform="translate(${ this.size / 2 }, ${ this.size / 2 })">
                    <g class="spinner-group" stroke="#000" stroke-width="0" style="transform: rotate(${ this.rotation }deg)">

                    </g>
                </g>
                <g id="spinner-board"></g>
                <path id="spinner-arrow" d="M ${this.size/2-5} ${this.size/2} L ${this.size/2-5} 70 L ${this.size/2-12} 70 L ${this.size/2} 55 L ${this.size/2+12} 70 L ${this.size/2+5} 70 ${this.size/2+5} ${this.size/2} Z" fill="#EEEEEE" stroke="#222222" style="stroke-width:2px"/>
                <circle cx="${ this.size / 2 }" cy="${ this.size / 2 }" r="18" fill="#444444" stroke="#222222" style="stroke-width:2px"/>
                <circle cx="${ this.size / 2 }" cy="${ this.size / 2 }" r="9" fill="#666666" stroke="#222222" style="stroke-width:2px"/>
            </svg>`;
    }

    setElements() {
        this.spinnerGroup = document.querySelector(`[data-guid='${ this.guid }'] .spinner-group`);
    }

    renderSections() {
        let sections = this.data;
        let sectionWidth = sections[0].endAngle - sections[0].startAngle;

        for(let i = 0; i < sections.length; i++){
            this.spinnerGroup.innerHTML =
                this.spinnerGroup.innerHTML +
                `<g transform="rotate(${  sectionWidth * i })">
                    <path d="${ sections[i].d }" fill="${ sections[i].color }" stroke="#fff" stroke-width="1"/>
                </g>`;
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

        let d = 'M0,0  L' + x1 + ',' + y1 + `  A${ this.size / 2 },${ this.size / 2 } 0 ` +
        (((360 * percentOfWhole) - 0 > 180) ? 1 : 0) + ',1 ' + x2 + ',' + y2 + ' z'

        return { datum, startAngle, endAngle, d, color: this.colors[index] }
      })
    }

    rotateSpinner () {
      if(!this.spinning){
          this.spinning = true;
          const randomDatum = this.data[Math.floor(Math.random() * this.data.length)];
          console.log(randomDatum.color)
          let diff = this.rotation % 360;
          let magnitude = Math.random() + 1;
          this.rotation = this.rotation + ((this.numOfSpins * 360) + (360 - randomDatum.endAngle + Math.floor(Math.random() * ((randomDatum.endAngle - randomDatum.startAngle) / 2) * magnitude)) - 90 - diff);
          this.spinnerGroup.style.transform = `rotate(${ this.rotation }deg)`;

          // Call the function to handle the selected piece of data.
          setTimeout(() => {
              this.afterSelected(randomDatum);
          }, this.delay * 1000);

          // Set spinning bool to false so user can click again.
          setTimeout(() => { this.spinning = false }, this.delay * 1000)
      }
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
