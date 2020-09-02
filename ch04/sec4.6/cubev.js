"use strict";

let gl;

let 顶点数 = 36;
let x轴 = 0, y轴 = 1, z轴 = 2;
let 轴 = 0;
let θ = [0, 0, 0], θ_;

function hex2vec4(x) {
  return vec4(...[x.substr(0, 2), x.substr(2, 2), x.substr(4, 2)].map(b => (parseInt(b, 16) / 256.0)), 1.0);
}

const 顶点列表 = [
  { v: [-0.5, -0.5, 0.5], c: 'cffffe' },
  { v: [-0.5, 0.5, 0.5], c: 'f9f7d9' },
  { v: [0.5, 0.5, 0.5], c: 'fce2ce' },
  { v: [0.5, -0.5, 0.5], c: 'ffc1f3' },
  { v: [-0.5, -0.5, -0.5], c: 'fbecec' },
  { v: [-0.5, 0.5, -0.5], c: '91d18b' },
  { v: [0.5, 0.5, -0.5], c: 'e11d74' },
  { v: [0.5, -0.5, -0.5], c: '440047' },
].map(e => {
  return { v: vec4(...e.v, 1.0), c: hex2vec4(e.c) }
});

const 顶点索引 = [
  1, 0, 3,
  3, 2, 1,
  2, 3, 7,
  7, 6, 2,
  3, 0, 4,
  4, 7, 3,
  6, 5, 1,
  1, 2, 6,
  4, 5, 6,
  6, 7, 4,
  5, 4, 0,
  0, 1, 5
];

window.onload = async function 初始化() {
  let 画布 = document.getElementById('gl-canvas');
  gl = 画布.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(画布);
  if (!gl) alert('WebGL 不可用');

  gl.viewport(0, 0, 画布.clientWidth, 画布.clientHeight);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  let program = await initShaders(gl, 'vshader.glsl', 'fshader.glsl');
  gl.useProgram(program);

  let iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(顶点索引), gl.STATIC_DRAW);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(顶点列表.map(e => e.c)), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(顶点列表.map(e => e.v)), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  θ_ = gl.getUniformLocation(program, 'theta');

  document.getElementById('xButton').onclick = function () {
    轴 = x轴;
  };
  document.getElementById('yButton').onclick = function () {
    轴 = y轴;
  };
  document.getElementById('zButton').onclick = function () {
    轴 = z轴;
  };

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  θ[轴] += 2.0;
  gl.uniform3fv(θ_, θ);

  gl.drawElements(gl.TRIANGLES, 顶点数, gl.UNSIGNED_BYTE, 0);

  window.requestAnimationFrame(render);
}
