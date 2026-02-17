
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (err) {
  console.error("Critical Render Error:", err);
  rootElement.innerHTML = `<div style="padding: 20px; font-family: sans-serif;">
    <h2 style="color: #A52A2A;">Application Error</h2>
    <p>The application failed to start during the render phase. This is often caused by an incompatible library or missing data.</p>
    <p style="font-size: 11px; color: #666;">Error: ${err instanceof Error ? err.message : String(err)}</p>
  </div>`;
}
