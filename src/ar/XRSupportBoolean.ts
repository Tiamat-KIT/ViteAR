export default async function XRSupportBoolean(): Promise<boolean> {
  const isSupported =
    navigator.xr && (await navigator.xr.isSessionSupported('immersive-ar'));
  if (isSupported === undefined) throw new Error('未定義エラーが返されました');
  return isSupported;
}
