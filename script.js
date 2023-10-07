function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script"))
    .forEach(oldScriptEl => {
      const newScriptEl = document.createElement("script");
      Array.from(oldScriptEl.attributes).forEach( attr => {
        newScriptEl.setAttribute(attr.name, attr.value)
      });
      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);
      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}

function main() {
  class AppCommon extends HTMLElement {
    constructor() {
      super();
    };

    _getPage(path) {
      return new Promise((res, rej) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            res(this.responseText);
          } 
        };
        xhttp.open("GET", path);
        xhttp.send();
      })
    }
  }
  class AppSample extends AppCommon{
    #view = '/home';
    #pathToViews = '/views'

    constructor() {
      super();
    };

    async #routing() {
      const { hash } = window.location;
      this.#view = hash.substring(1);
      const pathToView = `/src${this.#pathToViews}${this.#view}/index.htv`;
      const contentStr = await this._getPage(pathToView);
      const template = new DOMParser().parseFromString(contentStr, 'text/html').head.firstChild;
      template.content.children.default.append(...this.children);
      const content = template.content.cloneNode(true);
      this.parentElement.replaceChild(content, this)
    }

    connectedCallback() {
      window.location.hash && this.#routing();
      window.addEventListener('hashchange', () => this.#routing());
    };
  };
  class AppComponent extends AppCommon{
    constructor() {
      super();
    }

    connectedCallback() {

    }
  };
  class AppLink extends AppCommon{
    constructor() {
      super();
    }

    connectedCallback() {
      this.addEventListener('click', (e) => {
        const path = this.getAttribute('to')
        history.pushState(null, null, `#${path}`)
      })
    }
  };
  customElements.define('app-sample', AppSample)
  customElements.define('app-component', AppComponent)
  customElements.define('app-link', AppLink)
  
}
if (window.location.pathname === '/index.html') window.location.pathname = '';
main()