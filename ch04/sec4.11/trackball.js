"use strict";

let gl;

let 顶点数 = 36;
let points = [];
let colors = [];

let r, r_;
let 角 = 0.0, 轴 = [0, 0, 1];
let 鼠标跟踪中 = false, 轨迹球移动 = false;
let 上个位置 = [0, 0, 0], x当前, y当前, x起始, y起始;

function multq(a, b) {
  let s = vec3(a[1], a[2], a[3]);
  let t = vec3(b[1], b[2], b[3]);
  // vec4(a.x * b.x - dot(a.yzw, b.yzw), a.x * b.yzw + b.x * a.yzw + cross(b.yzw, a.yzw));
  return vec4(a[0] * b[0] - dot(s, t), add(cross(t, s), add(scale(a[0], t), scale(b[0], s))));
}

function trackballView(x, y) {
  let v = [x, y, 0.0];
  let d = v[0] * v[0] + v[1] * v[1];
  if (d < 1.0) {
    v[2] = Math.sqrt(1.0 - d);
  } else {
    v[2] = 0.0;
    let a = 1.0 / Math.sqrt(d);
    v[0] *= a;
    v[1] *= a;
  }
  return v;
}

function mouseMotion(x, y) {
  if (鼠标跟踪中) {
    let 当前位置 = trackballView(x, y);
    let dx = 当前位置[0] - 上个位置[0];
    let dy = 当前位置[1] - 上个位置[1];
    let dz = 当前位置[2] - 上个位置[2];

    if (dx || dy || dz) {
      角 = -0.1 * Math.sqrt(dx * dx + dy * dy + dz * dz);


      轴[0] = 上个位置[1] * 当前位置[2] - 上个位置[2] * 当前位置[1];
      轴[1] = 上个位置[2] * 当前位置[0] - 上个位置[0] * 当前位置[2];
      轴[2] = 上个位置[0] * 当前位置[1] - 上个位置[1] * 当前位置[0];

      上个位置[0] = 当前位置[0];
      上个位置[1] = 当前位置[1];
      上个位置[2] = 当前位置[2];
    }
  }
  render();
}

function startMotion(x, y) {
  鼠标跟踪中 = true;
  x起始 = x;
  y起始 = y;
  x当前 = x;
  y当前 = y;

  上个位置 = trackballView(x, y);
  轨迹球移动 = true;
}

function stopMotion(x, y) {
  鼠标跟踪中 = false;
  if (x起始 != x || y起始 != y) {
  } else {
    角 = 0.0;
    轨迹球移动 = false;
  }
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


window.onload = async function 初始化() {
  let canvas = document.getElementById('gl-canvas');
  gl = canvas.getContext('webgl');
  // gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) alert('WebGL 不可用');

  立方体着色();

  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
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

  r = vec4(1, 0, 0, 0);
  r_ = gl.getUniformLocation(program, 'r');
  gl.uniform4fv(r_, flatten(r));

  function 计算位置(event) {
    let x = 2 * event.clientX / canvas.clientWidth - 1;
    let y = 2 * (canvas.clientHeight - event.clientY) / canvas.clientHeight - 1;
    return [x, y];
  }

  canvas.addEventListener('mousedown', function (event) {
    startMotion(...计算位置(event));
  });
  canvas.addEventListener('mouseup', function (event) {
    stopMotion(...计算位置(event));
  });
  canvas.addEventListener('mousemove', function (event) {
    mouseMotion(...计算位置(event));
  });

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (轨迹球移动) {
    轴 = normalize(轴);
    let c = Math.cos(角 / 2.0), s = Math.sin(角 / 2.0);
    r = multq(r, vec4(c, s * 轴[0], s * 轴[1], s * 轴[2]));
    gl.uniform4fv(r_, flatten(r));
  }

  gl.drawArrays(gl.TRIANGLES, 0, 顶点数);

  window.requestAnimationFrame(render);
}
