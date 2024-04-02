import { useEffect } from 'react';
import AR from './ar/ar-three-rendering.ts';

function App() {
  useEffect(() => {
    if(typeof window === 'undefined') {
      throw new Error('windowが未定義です');
    }else if(typeof navigator === "undefined"){
      throw new Error('navigatorが未定義です');
    } else{
      AR().then(() => console.log('start!'));
    }
  }, []);

  return (
    <>
      <button id="startButton">Start!</button>
      <canvas id="ar-canvas" />
    </>
  );
}

export default App;
