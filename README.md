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

### xR処理をかいてｋ処理をかいてｋ