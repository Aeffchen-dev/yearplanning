import { createRoot } from 'react-dom/client'
import './index.css'

console.log('main.tsx loading');

const TestApp = () => {
  console.log('TestApp rendering');
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'green', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: 'white', fontSize: '32px' }}>Direct Test App Working</h1>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<TestApp />);
