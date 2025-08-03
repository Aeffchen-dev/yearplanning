console.log('App.tsx loading');

const App = () => {
  console.log('App component rendering');
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'purple', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: 'white', fontSize: '32px' }}>App component working</h1>
    </div>
  );
};

export default App;
