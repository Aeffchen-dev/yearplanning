import { createRoot } from 'react-dom/client';

console.log('main.tsx is loading');

const root = document.getElementById("root");
console.log('Root element:', root);

if (root) {
  createRoot(root).render(
    <div style={{ backgroundColor: 'blue', height: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', fontSize: '24px' }}>BASIC TEST - React is working!</h1>
    </div>
  );
} else {
  console.error('Root element not found!');
}
