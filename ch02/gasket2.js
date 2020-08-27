"use strict";

let gl;
let 点集 = [];

let 划分层数 = 5;

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
  
  划分三角形(向量[0], 向量[1], 向量[2], 划分层数);

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

function 三角形(a, b, c) {
  点集.push(a, b, c);
}

function 划分三角形(a, b, c, count) {
  if (count === 0) {
    三角形(a, b, c);
  } else {
    let ab = mix(a, b, 0.5);
    let ac = mix(a, c, 0.5);
    let bc = mix(b, c, 0.5);
    --count;
    划分三角形(a, ab, ac, count);
    划分三角形(c, ac, bc, count);
    划分三角形(b, bc, ab, count);
  }
}

function 渲染() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 点集.length);
}
