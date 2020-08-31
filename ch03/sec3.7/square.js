"use strict";

let gl;
let 三角形数 = 200;
let 顶点数 = 3 * 三角形数;
let 索引 = 0;

const 色板 = [
  'cffffe', 'f9f7d9', 'fce2ce', 'ffc1f3',
  'fbecec', '91d18b', 'e11d74', '440047'
].map(x => [x.substr(0, 2), x.substr(2, 2), x.substr(4, 2)]).map(a => a.map(b => parseInt(b, 16))).map(v => vec4(...v.map(c => c / 255.0), 1.0));

window.onload = async function 初始化() {
  let 画布 = document.getElementById('gl-canvas');
  gl = 画布.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(画布);
  if (!gl) alert('WebGL 不可用');

  gl.viewport(0, 0, 画布.clientWidth, 画布.clientHeight);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);

  let 程序 = await initShaders(gl, 'vshader.glsl', 'fshader.glsl');
  gl.useProgram(程序);

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * 顶点数, gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(程序, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * 顶点数, gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(程序, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  画布.addEventListener('mousedown', function (event) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    let t = vec2(2 * event.clientX / 画布.clientWidth - 1,
      2 * (画布.clientHeight - event.clientY) / 画布.clientHeight - 1);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * 索引, flatten(t));

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    t = vec4(色板[索引 % 色板.length]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 索引, flatten(t));
    ++索引;
  });

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 索引);

  window.requestAnimationFrame(render);
}
