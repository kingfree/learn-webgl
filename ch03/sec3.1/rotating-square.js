"use strict";

let gl;
let 点集 = [];
let 色集 = [];

let theta = 0.0, thetaLoc;

window.onload = async function 初始化() {
  let 画布 = document.getElementById('gl-canvas');
  gl = 画布.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(画布);
  if (!gl) alert('WebGL 不可用');

  gl.viewport(0, 0, 画布.clientWidth, 画布.clientHeight);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  let 程序 = await initShaders(gl, 'vshader.glsl', 'fshader.glsl');
  gl.useProgram(程序);

  let 顶点 = [
    vec2(0, 1),
    vec2(-1, 0),
    vec2(1, 0),
    vec2(0, -1),
  ];

  let bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(顶点), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(程序, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(程序, 'theta');

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  theta += 0.1;
  gl.uniform1f(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  window.requestAnimationFrame(render);
}
