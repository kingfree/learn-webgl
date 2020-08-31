"use strict";

let gl;
let 点集 = [];
let 色集 = [];

let 划分层数 = 4;

window.onload = async function 初始化() {
  let 画布 = document.getElementById('gl-canvas');
  gl = 画布.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(画布);
  if (!gl) alert('WebGL 不可用');

  let 向量 = [
    vec3(0.0000, 0.0000, -1.0000),
    vec3(0.0000, 0.9428, 0.3333),
    vec3(-0.8165, -0.4714, 0.3333),
    vec3(0.8165, -0.4714, 0.3333)
  ];

  划分四面体(向量[0], 向量[1], 向量[2], 向量[3], 划分层数);

  gl.viewport(0, 0, 画布.clientWidth, 画布.clientHeight);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  let 程序 = await initShaders(gl, 'shaders/vshader41.glsl', 'shaders/fshader41.glsl');
  gl.useProgram(程序);

  let 颜色缓冲 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, 颜色缓冲);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(色集), gl.STATIC_DRAW);

  let 颜色 = gl.getAttribLocation(程序, 'vColor');
  gl.vertexAttribPointer(颜色, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(颜色);

  let 缓冲 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, 缓冲);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(点集), gl.STATIC_DRAW);

  let 位置 = gl.getAttribLocation(程序, 'vPosition');
  gl.vertexAttribPointer(位置, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(位置);

  渲染();
};

const 色板 = [
  [26, 190, 233],
  [196, 113, 237],
  [246, 79, 89],
  [0.0, 0.0, 0.0]
].map(v => vec3(...v.map(c => c / 255.0)));

function 三角形(a, b, c, color) {
  点集.push(a, b, c);
  色集.push(色板[color], 色板[color], 色板[color]);
}

function 四面体(a, b, c, d) {
  三角形(a, c, b, 0);
  三角形(a, c, d, 1);
  三角形(a, b, d, 2);
  三角形(b, c, d, 3);
}

function 划分四面体(a, b, c, d, count) {
  if (count === 0) {
    四面体(a, b, c, d);
  } else {
    let ab = mix(a, b, 0.5);
    let ac = mix(a, c, 0.5);
    let ad = mix(a, d, 0.5);
    let bc = mix(b, c, 0.5);
    let bd = mix(b, d, 0.5);
    let cd = mix(c, d, 0.5);
    --count;
    划分四面体(a, ab, ac, ad, count);
    划分四面体(ab, b, bc, bd, count);
    划分四面体(ac, bc, c, cd, count);
    划分四面体(ad, bd, cd, d, count);
  }
}

function 渲染() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 点集.length);
}
