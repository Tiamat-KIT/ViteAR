import * as Three from 'three';
import InnerSize from '../hooks/inner-size';

// https://www.codegrid.net/articles/2020-webxr-1/
// https://github.com/pmndrs/react-xr

export default async function AR() {
  const { width, height } = InnerSize();
  const StartButton = document.getElementById(
    'startButton'
  ) as HTMLButtonElement;
  const ARCanvas = document.getElementById('ar-canvas') as HTMLCanvasElement;
  const isArSupported =
    navigator.xr && (await navigator.xr.isSessionSupported('immersive-ar'));
  if (isArSupported === undefined)
    throw new Error('isARSupported is Undifined');
  StartButton.disabled = !isArSupported;
  StartButton.addEventListener('click', onEnterAR);
  async function onEnterAR() {
    StartButton.style.display = 'none';
    const xRSession = await (navigator.xr as XRSystem).requestSession(
      'immersive-ar'
    );
    const renderer = new Three.WebGLRenderer({
      canvas: ARCanvas, // HTMLCanvas
    });
    renderer.autoClear = false;
    renderer.setSize(width, height);

    const gl = renderer.getContext();

    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera();

    scene.add(new Three.GridHelper(100, 100));

    const box = new Three.Mesh(
      new Three.BoxGeometry(0.2, 0.2, 0.2),
      new Three.MeshNormalMaterial()
    );
    scene.add(box);
    const xrWebGLLayer = new XRWebGLLayer(xRSession, gl);
    xRSession.updateRenderState({
      baseLayer: xrWebGLLayer,
    });

    const referenceSpace = await xRSession.requestReferenceSpace('local');

    xRSession.requestAnimationFrame(onDrawFrame);

    function onDrawFrame(_timestamp: DOMHighResTimeStamp, xRFrame: XRFrame) {
      xRSession.requestAnimationFrame(onDrawFrame);

      const pose = xRFrame.getViewerPose(referenceSpace);

      gl.bindFramebuffer(gl.FRAMEBUFFER, xrWebGLLayer.framebuffer);

      if (!pose) return;

      pose.views.forEach((view) => {
        const viewport = xrWebGLLayer.getViewport(view);
        if (viewport === undefined) {
          throw new Error('Viewportが未定義です');
        }
        renderer.setSize(viewport.width, viewport.height);

        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);

        renderer.clearDepth();
        renderer.render(scene, camera);
      });
    }
  }
}
