//This file will be the web component
//It only needs to run, not be imported by main.js

const template = document.createElement('template');
template.innerHTML = `
    <div>
        <h2>Big Bang Theory!</h2>
        <slot name="title">Default text if no title slot used in HTML</slot>
        <slot name="list"></slot>
    </div>
`;

class BigBang extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'closed'});
        //let div = document.createElement('div');
        //div.textContent = 'Big Bang Theory';
        //shadowRoot.append(div);
        let clone = template.content.cloneNode(true);
        shadowRoot.append(clone);
    }
}

window.customElements.define('big-bang', BigBang);
// <big-bang>
