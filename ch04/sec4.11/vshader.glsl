attribute vec4 vPosition;
attribute vec4 vColor;
varying vec4 fColor;

uniform vec4 r; // 旋转变换的四元数

// 四元数乘法
vec4 multq(vec4 a, vec4 b) {
  return vec4(a.x * b.x - dot(a.yzw, b.yzw), a.x * b.yzw + b.x * a.yzw + cross(b.yzw, a.yzw));
}

// 四元数的逆
vec4 invq(vec4 a) {
  return vec4(a.x, -a.yzw) / dot(a, a);
}

void main() {
  vec4 p = vec4(0, vPosition.xyz); // 输入点的四元数
  p = multq(r, multq(p, invq(r))); // 旋转后的点的四元数, p'=rp(r^-1)
  gl_Position = vec4(p.yzw, 1); // 转回齐次矩阵

  fColor = vColor;
}
