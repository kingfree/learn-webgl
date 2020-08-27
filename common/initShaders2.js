// Get a file as a string using  AJAX
async function loadFileAJAX(name) {
  return (await fetch(name)).text()
  // var xhr = new XMLHttpRequest(),
  //   okStatus = document.location.protocol === "file:" ? 0 : 200;
  // xhr.open('GET', name, false);
  // xhr.send(null);
  // return xhr.status == okStatus ? xhr.responseText : null;
};


async function initShaders(gl, vShaderName, fShaderName) {
  async function getShader(gl, shaderName, type) {
    var shader = gl.createShader(type),
      shaderScript = await loadFileAJAX(shaderName);
    if (!shaderScript) {
      alert("Could not find shader source: " + shaderName);
    }
    let h2 = document.createElement('h5')
    h2.textContent = shaderName
    document.body.appendChild(h2)
    let pre = document.createElement('pre')
    pre.textContent = shaderScript
    document.body.appendChild(pre)

    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
  var vertexShader = await getShader(gl, vShaderName, gl.VERTEX_SHADER),
    fragmentShader = await getShader(gl, fShaderName, gl.FRAGMENT_SHADER),
    program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
    return null;
  }


  return program;
};

