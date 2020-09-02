"use strict";

let gl;

let 顶点数 = 36;
let points = [];
let colors = [];
let x轴 = 0, y轴 = 1, z轴 = 2;
let 轴 = 0;
let θ = [0, 0, 0], θ_;

window.onload = async function 初始化() {
  let 画布 = document.getElementById('gl-canvas');
  gl = 画布.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(画布);
  if (!gl) alert('WebGL 不可用');

  立方体着色();

  gl.viewport(0, 0, 画布.clientWidth, 画布.clientHeight);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  let program = await initShaders(gl, 'vshader.glsl', 'fshader.glsl');
  gl.useProgram(program);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

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

  gl.drawArrays(gl.TRIANGLES, 0, 顶点数);

  window.requestAnimationFrame(render);
}

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

function 立方体着色() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
  let 索引 = [a, b, c, a, c, d];
  for (let i = 0; i < 索引.length; ++i) {
    points.push(顶点列表[索引[i]].v);
    colors.push(顶点列表[a].c)
  }
}
