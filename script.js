class AppCommon extends HTMLElement {
  constructor() {
    super();
  };

  async _setContent(pathToContent) {
    const contentStr = await fetch(pathToContent).then(res => res.text());
    const htmlView = new DOMParser().parseFromString(contentStr, 'text/html');
    const content = {
      style: htmlView.head.querySelector('style'),
      html: htmlView.head.querySelector('template').content.cloneNode(true),
    }
    const script = document.createElement('script');
    script.innerHTML = htmlView.head.querySelector('script').innerHTML;
    const docFragment = document.createDocumentFragment();
    docFragment.appendChild(content.style);
    docFragment.appendChild(content.html);
    docFragment.appendChild(script);
    this.replaceWith(docFragment);
  };
}

class AppSample extends AppCommon {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  };

  async #routing() {
    const { hash } = window.location;
    const view = hash ? hash.substring(1) : '/home';
    const pathToView = `/src/views${view}/index.html`;
    this._setContent(pathToView);
  }

  connectedCallback() {
    this.#routing(); 
    window.addEventListener('hashchange', () => this.#routing());
  };
};

class AppComponent extends AppCommon {
  constructor() {
    super();
  }

  connectedCallback() {
    const component = this.getAttribute('html-component');
    const pathToComponent = `/src${component}/index.html`;
    this._setContent(pathToComponent);
  }
};

class AppLink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      window.location.hash = this.getAttribute('to');
    })
  }
};

customElements.define('app-sample', AppSample)
customElements.define('app-component', AppComponent)
customElements.define('app-link', AppLink)

if (window.location.pathname === '/index.html') window.location.pathname = '';
