import { createRoot } from 'react-dom/client';
import App from '@src/app';
import styles from './styles/index.scss?inline';
import tailwindcssOutput from '@src/tailwind-output.css?inline';

const root = document.createElement('div');
root.id = 'hz-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });
shadowRoot.appendChild(rootIntoShadow);

/** Inject styles into shadow dom */
const globalStyleSheet = new CSSStyleSheet();
globalStyleSheet.replaceSync(tailwindcssOutput + styles);

shadowRoot.adoptedStyleSheets = [globalStyleSheet];
shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(<App />);
