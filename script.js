class AppCommon extends HTMLElement {
  constructor() {
    super();
  };

  async _setContent(pathToView) {
    const contentStr = await fetch(pathToView).then(res => res.text());
    const htmlView = new DOMParser().parseFromString(contentStr, 'text/html');
    return htmlView.head.firstChild.content;
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
    const content = await this._setContent(pathToView);
    this.shadowRoot.replaceChildren(content);
  }

  connectedCallback() {
    this.#routing(); 
    window.addEventListener('hashchange', () => this.#routing());
  };
};

class AppComponent extends AppCommon {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const component = this.getAttribute('html-component');
    const pathToComponent = `/src${component}/index.html`;
    this.shadowRoot.appendChild(await this._setContent(pathToComponent));
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
