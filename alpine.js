window.Alpine = {
  directives: {
    'x-text': (el, value) => {
      el.innerText = value;
    },
    'x-show': (el, value) => {
      el.style.display = value ? 'block' : 'none';
    },
  },

  start() {
    this.root = document.querySelector('[x-data]');
    this.rawData = this.getInitialData();
    this.data = this.observe(this.rawData);

    this.registerListeners();
    this.refreshDOM();
  },

  getInitialData() {
    let dataString = this.root.getAttribute('x-data');

    return eval(`(${dataString})`);
  },

  observe(data) {
    let self = this;

    return new Proxy(data, {
      set(target, prop, value) {
        target[prop] = value;

        self.refreshDOM();

        return true;
      }
    });
  },

  registerListeners() {
    this.walkDOM(this.root, el => {
      Array.from(el.attributes).forEach(attribute => {
        if (!attribute.name.startsWith('@')) return;

        let event = attribute.name.replace('@', '');
        let expression = attribute.value;

        el.addEventListener(event, () => {
          eval(`(this.data.${expression})`);
        });
      });
    });
  },

  refreshDOM() {
    this.walkDOM(this.root, el => {
      Array.from(el.attributes).forEach(attribute => {
        if (!Object.keys(this.directives).includes(attribute.name)) return;

        this.directives[attribute.name](el, eval(`(this.data.${attribute.value})`));
      });
    });
  },

  walkDOM(el, callback) {
    callback(el);

    el = el.firstElementChild;

    while (el) {
      this.walkDOM(el, callback);

      el = el.nextElementSibling;
    }
  },
};

window.Alpine.start();
