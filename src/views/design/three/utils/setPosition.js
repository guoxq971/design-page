/**
 * 设置鼠标坐标
 * @param {MouseEvent} evt 鼠标事件
 * @param {Object} uv uv坐标(值域[0, 1])
 * @param {fabric.Canvas} fabricCanvas fabric canvas对象
 * @param {CanvasTexture} texture 纹理对象
 */
export function setPosition(evt, uv, fabricCanvas, texture) {
  if (evt) {
    // 映射到画布的坐标
    const dom = fabricCanvas.canvas.lowerCanvasEl;
    const rect = dom.getBoundingClientRect();
    const xCross = uv.x * (rect.right - rect.left) + rect.left;
    const yCross = uv.y * (rect.bottom - rect.top) + rect.top;

    // 模拟鼠标事件.
    const event = new MouseEvent(evt.type, {
      bubbles: true, // 是否冒泡
      clientX: xCross,
      clientY: yCross,
    });

    // upperCanvasEl, lowerCanvasEl, wrapperEl
    // 在canvas上触发event事件
    fabricCanvas.canvas.upperCanvasEl.dispatchEvent(event);

    // 更新纹理
    texture.needsUpdate = true;
  }
}
