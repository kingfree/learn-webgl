"use strict";

let gl;
let 点集;

let 点数 = 5000;

window.onload = async function 初始化() {
  let 画布 = document.getElementById('gl-canvas');
  gl = 画布.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(画布);
  if (!gl) alert('WebGL 不可用');

  let 向量 = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
  ];
  let u = add(向量[0], 向量[1]);
  let v = add(向量[0], 向量[2]);
  let p = scale(0.25, add(u, v));
  点集 = [p];

  for (let i = 0; 点集.length < 点数; ++i) {
    let j = Math.floor(Math.random() * 3);
    p = add(点集[i], 向量[j]);
    p = scale(0.5, p);
    点集.push(p);
  }

  gl.viewport(0, 0, 画布.clientWidth, 画布.clientHeight);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  let 程序 = await initShaders(gl, 'shaders/vshader21.glsl', 'shaders/fshader21.glsl');
  gl.useProgram(程序);

  let 缓冲 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, 缓冲);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(点集), gl.STATIC_DRAW);

  let 位置 = gl.getAttribLocation(程序, 'vPosition');
  gl.vertexAttribPointer(位置, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(位置);

  渲染();
};

function 渲染() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 点集.length);
}
