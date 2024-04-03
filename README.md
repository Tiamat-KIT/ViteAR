# 研究用リポジトリ

## 最初にXRのAPIを使えるようにする

### 最初に行う処理

#### そもそもそのブラウザでAR開発ができるかどうか

```ts
const isxR = "xr" in window.navigator ? true : false
const isAR = await navigator.xr.inSessionSupported("immersive-ar")

if(!(isxR)){
  throw new Error("xR機能に未対応")
}else if(!(isAR)){
  throw new Error("AR機能に未対応")
}else {
  // ここならAR動作はするよ
}
```

### xR処理をかいていく
#### xR処理をはじめる

```ts
// xRセッションが始まっているかどうかをチェックする

if(!xRSession){
  navigator.xr.requestSession("immersive-ar").then((session) => {
    // ここにセッション開始用の関数を書いておくらしい
  })
}else {
  xrSession.end().then(() => {
    // 終了イベントが正常に送信されない可能性があるので、ハンドラも定義しておく
  })
}
```


### 使用方法がまだよくわかってないもの
- [`XRSystem.requestSession(): Promise<XRSession>`](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession)

  引数
    - mode

      XRSessionModeを確定させるもの。以下のものをサポートしている

      - immersive-ar

        ARとして扱う
        HMD?(没入型デバイスって書いてある)への排他的アクセスが与えられるが、レンダリングされるコンテンツは現実世界環境とブレンドされる
        セッションの[enviromentBlendMode](https://developer.mozilla.org/en-US/docs/Web/API/XRSession/environmentBlendMode)はコンテンツをブレンドするために使用される方法を示す

      - immersive-vr

        レンダリングされたセッションがVRモードで没入型XRデバイスを使用して表示されることを示す
        環境ブレンドモード([enviromentBlendMode](https://developer.mozilla.org/en-US/docs/Web/API/XRSession/environmentBlendMode))は、可能であれば不透明であることが期待されるが、ハードウェアの要求によっては加算的なものを必要とされる場合がある

      - inline
        特に使用するつもりがないので記載しない
        でも簡単にいうとHTML内の要素の中に埋め込むんだってさ

    
    - options

      XRSessionを設定するオブジェクト、渡されなかった場合は、デバイスは全オプションに対してデフォルト値を使用

      - requiredFeatures

        返されるXRSessionがサポートしないといけない値の配列を指定（[Session features](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession#session_features)を参照）
        
      - 
      - 
      - 



