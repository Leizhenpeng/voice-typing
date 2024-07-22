import { createRoot } from 'react-dom/client';
import App from '@src/app';
import styles from './styles/index.scss?inline';
import tailwindcssOutput from '@src/tailwind-output.css?inline';
import { createShadowRootUI } from 'content-ui-inject';

async function loadApp() {
  const app = await createShadowRootUI({
    name: 'react-boilerplate',
    position: 'modal',
    zIndex: 9999,

    injectAnchor: 'body',
    injectMode: 'before',
    eventIsolation: false,
    styleOptions: {
      textContent: tailwindcssOutput + styles,
    },
    onCustomize: (uiContainer, shadowHost) => {
      shadowHost.style.zIndex = '9999';
      shadowHost.id = 'hz-root';

      uiContainer.style.height = '0';
      uiContainer.style.width = '0';

      uiContainer.parentElement!.style.height = '0';
      uiContainer.parentElement!.style.width = '0';
    },
    onMount: uiContainer => {
      createRoot(uiContainer).render(<App />);
    },
  });
  app.mount();
}

loadApp();
