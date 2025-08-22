// utils/authEnv.ts
export const shouldUseRedirect = () => {
  if (window.crossOriginIsolated) return true;
  const ua = navigator.userAgent.toLowerCase();
  if (/safari/.test(ua) && !/chrome/.test(ua)) return true;
  if (/iphone|ipad|ipod/.test(ua)) return true;
  if (import.meta.env.PROD) return true;
  return false;
};
