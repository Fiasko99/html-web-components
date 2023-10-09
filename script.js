class AppCommon extends HTMLElement {
  constructor() {
    super()
  }

  async _setContent(pathToContent) {
    const getFileText = async (type) => {
      const types = {
        css: 'style.css',
        html: 'index.html',
        js: 'script.js',
      }
      return await fetch(`${pathToContent}/${types[type]}`)
        .then(res => res.text())
    }

    const styletStr = await getFileText('css')
    const style = document.createElement('style')
    style.innerHTML = styletStr

    const contentStr = await getFileText('html')
    const htmlView = new DOMParser().parseFromString(contentStr, 'text/html')
    const content = htmlView.head.querySelector('template').content.cloneNode(true)
    
    const scriptStr = await getFileText('js')
    const script = document.createElement('script')
    script.innerHTML = scriptStr

    const docFragment = document.createDocumentFragment()
    docFragment.appendChild(style)
    docFragment.appendChild(content)
    docFragment.appendChild(script)
    this.replaceWith(docFragment)
  }
}

class AppSample extends AppCommon {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  async #routing() {
    const { hash } = window.location
    this._setContent(`/src/views${hash ? hash.substring(1) : '/home'}`)
  }

  connectedCallback() {
    this.#routing() 
    window.addEventListener('hashchange', () => this.#routing())
  }
}

class AppComponent extends AppCommon {
  constructor() {
    super()
  }

  connectedCallback() {
    const component = this.getAttribute('html-component')
    this._setContent( `/src${component}`)
  }
}

class AppLink extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      window.location.hash = this.getAttribute('to')
    })
  }
}

customElements.define('app-sample', AppSample)
customElements.define('app-component', AppComponent)
customElements.define('app-link', AppLink)

if (window.location.pathname === '/index.html') window.location.pathname = ''
