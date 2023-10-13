import * as THREE from 'three';
/**
 * 创建canvas纹理
 * @param canvas
 * @returns {THREE.CanvasTexture}
 */
export function createCanvasTexture(canvas = null) {
  let texture;
  if (canvas) {
    texture = new THREE.CanvasTexture(canvas);
  } else {
    texture = new THREE.CanvasTexture();
  }
  texture.flipY = false; // 纹理映射
  texture.encoding = THREE.sRGBEncoding;
  return texture;
}
