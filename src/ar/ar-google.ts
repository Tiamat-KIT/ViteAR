import * as Three from 'three';

export default async function ExampleGoogleAR(): Promise<void>{
    if(navigator.xr === undefined) {
        const message = document.createElement('div');
        message.textContent = 'WebXR非対応です';
        document.body.appendChild(message);
        return;
    }else {
        const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (isARSupported){
            throw new Error('ARSupported is Undifined');
        }
        (document.getElementById("enter-ar") as HTMLButtonElement).addEventListener("click",activateAR)
    }
}

class ARApp {
    xRSession: XRSession | null;
    canvas: HTMLCanvasElement | null;
    gl: WebGLRenderingContext | null;
    localReferenceSpace: XRReferenceSpace | XRBoundedReferenceSpace | undefined;
    renderer: Three.WebGLRenderer | null;
    camera: Three.PerspectiveCamera | null;
    scene: Three.Scene | null;
    light: Three.DirectionalLight | Three.HemisphereLight | Three.AmbientLight | null;

    constructor(){
        this.xRSession = null;
        this.canvas = null;
        this.gl = null;
        this.localReferenceSpace = undefined;
        this.renderer = null;
        this.camera = null;
        this.scene = null;

        this.scene = new Three.Scene();
        this.camera = new Three.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            20
        );

        this.light = new Three.HemisphereLight(0xffffff, 0xbbbbff, 3);
        this.light.position.set(0.5, 1, 0.25);
        this.scene.add(this.light);
    }



    async activateAR(){
        try {
            this.xRSession = await (navigator.xr as XRSystem).requestSession('immersive-ar');
            this.createXRCanvas();
            await this.onSessionStarted();
        }catch(e){
            console.error(e);
            return;
        }
    }

    createXRCanvas(){
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.gl = this.canvas.getContext("webgl",{XRCompatible: true}) as WebGLRenderingContext;
        if(this.gl === null){
            throw new Error('WebGLコンテキストの取得に失敗しました');
        }
        this.xRSession?.updateRenderState({
            baseLayer: new XRWebGLLayer(this.xRSession, this.gl as WebGLRenderingContext)
        })
    }

    async onSessionStarted(){
        document.body.classList.add('ar');
        this.setUpThreejs();
        this.localReferenceSpace = await this.xRSession?.requestReferenceSpace('local');
        this.xRSession?.requestAnimationFrame(this.onXRFrame);
    }

    onXRFrame(time: DOMHighResTimeStamp, frame: XRFrame){
        this.xRSession?.requestAnimationFrame(this.onXRFrame);

        const framebuffer = this.xRSession?.renderState.baseLayer?.framebuffer;
        this.gl?.bindFramebuffer(this.gl?.FRAMEBUFFER, framebuffer as WebGLFramebuffer);
        this.renderer?.set // setFramebuffer(framebuffer);

        const pose = frame.getViewerPose(this.localReferenceSpace as XRReferenceSpace);
        if(pose) {
            const view = pose.views[0];
            const viewport = this.xRSession?.renderState.baseLayer?.getViewport(view);
            if(viewport === undefined){
                throw new Error('Viewportが未定義です');
            }
            this.renderer?.setSize(viewport.width, viewport.height);
            if(this.camera === null || this.scene === null || this.renderer === null){
                throw new Error('Three.jsの初期化に失敗しています');
            }
            this.camera.matrix.fromArray(view.transform.matrix);
            this.camera.projectionMatrix.fromArray(view.projectionMatrix);
            this.camera.updateMatrixWorld(true);

            this.renderer?.render(this.scene, this.camera);
        }
        
    }

    setUpThreejs(){
        this.renderer = new Three.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
            canvas: this.canvas!,
            context: this.gl as WebGLRenderingContext,
        });
        this.renderer.autoClear = false;

        this.scene?.add(new Three.GridHelper(100,100));
        this.camera?.matrixAutoUpdate = false;
    }
}

window.app = new ARApp();