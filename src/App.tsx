import { useEffect } from 'react';
import AR from './ar/ar-three-rendering.ts';

function App() {
  useEffect(() => {
    AR().then(() => console.log('start!'));
  }, []);

  return (
    <>
      <button id="startButton">Start!</button>
      <canvas id="ar-canvas" />
    </>
  );
}

export default App;
