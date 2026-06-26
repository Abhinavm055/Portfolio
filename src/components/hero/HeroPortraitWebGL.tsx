import { useEffect, useRef } from 'react';

export function HeroPortraitWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      premultipliedAlpha: false,
      antialias: true
    });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Enable blending for correct transparent rendering of silhouette edges
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `;

    // Fragment Shader Source with side-grazing rim lighting formula
    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      
      uniform sampler2D u_texture;   // Original color portrait (profile.png)
      uniform sampler2D u_depthMap;  // Internal depth data (profile_depth.png)
      uniform vec2 u_mouse;
      uniform float u_intensity;

      void main() {
        // Sample color first - discard background
        vec4 color = texture2D(u_texture, v_texCoord);
        if (color.a < 0.01) {
          discard;
        }

        // Texel sizing for depth derivatives
        float texelSizeX = 1.0 / 1122.0;
        float texelSizeY = 1.0 / 1402.0;

        // Sample depth map neighbors
        float d_left = texture2D(u_depthMap, v_texCoord + vec2(-texelSizeX, 0.0)).r;
        float d_right = texture2D(u_depthMap, v_texCoord + vec2(texelSizeX, 0.0)).r;
        float d_up = texture2D(u_depthMap, v_texCoord + vec2(0.0, -texelSizeY)).r;
        float d_down = texture2D(u_depthMap, v_texCoord + vec2(0.0, texelSizeY)).r;

        // Derivative gradients
        float dzdx = (d_right - d_left) * 3.0;
        float dzdy = (d_down - d_up) * 3.0;

        // Surface normal N with compressed Z component for side grazing
        vec3 N = normalize(vec3(-dzdx, -dzdy, 0.14));

        // 2D Normalized light direction vector driven by mouse coordinates
        vec2 lightDir = normalize(u_mouse + vec2(0.001));

        // Evaluate edge-facing illumination
        float edgeFacing = max(dot(normalize(N.xy), lightDir), 0.0);

        // Standard rim mask (only active on high gradients)
        float rim = 1.0 - N.z;
        rim = smoothstep(0.4, 0.9, rim);

        // Apply very low-opacity warm rim light
        vec3 lightColor = vec3(0.96, 0.93, 0.86);

        // Keep maximum rim light contribution extremely low
        float finalIntensity = rim * edgeFacing * u_intensity * 0.08;
        vec3 finalRGB = color.rgb + (lightColor * finalIntensity * color.a);
        
        gl_FragColor = vec4(finalRGB, color.a);
      }
    `;

    // Compile shader helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Clean up compiling shaders
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    // Quad geometry (NDC coordinates)
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTextureLoc = gl.getUniformLocation(program, 'u_texture');
    const uDepthMapLoc = gl.getUniformLocation(program, 'u_depthMap');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity');

    if (uTextureLoc) gl.uniform1i(uTextureLoc, 0);   // Unit 0
    if (uDepthMapLoc) gl.uniform1i(uDepthMapLoc, 1); // Unit 1

    let textureLoaded = false;
    let depthLoaded = false;

    // Load original color texture on Unit 0
    const texture = gl.createTexture();
    const colorImg = new Image();
    colorImg.src = '/profile.png';
    colorImg.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, colorImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      textureLoaded = true;
      requestRender();
    };

    // Load grayscale depth map on Unit 1
    const depthMap = gl.createTexture();
    const depthImg = new Image();
    depthImg.src = '/profile_depth.png';
    depthImg.onload = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, depthMap);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, depthImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      depthLoaded = true;
      requestRender();
    };

    // Interpolation tracks
    let mouseTargetX = 0.0;
    let mouseTargetY = 0.0;
    let mouseCurrentX = 0.0;
    let mouseCurrentY = 0.0;

    let intensityTarget = 0.0;
    let intensityCurrent = 0.0;

    const handleMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2.0;
      const my = (e.clientY / window.innerHeight - 0.5) * 2.0;
      mouseTargetX = mx;
      mouseTargetY = my;

      // Rim light intensity falls off as mouse moves far from screen center
      const dist = Math.sqrt(mx * mx + my * my);
      intensityTarget = Math.max(0.0, 1.0 - dist * 0.7);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1.0, 2.0);

      const physicalWidth = Math.floor(displayWidth * dpr);
      const physicalHeight = Math.floor(displayHeight * dpr);

      if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
        canvas.width = physicalWidth;
        canvas.height = physicalHeight;
        gl.viewport(0, 0, physicalWidth, physicalHeight);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let animationFrameId: number;
    const requestRender = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(render);
    };

    const render = () => {
      animationFrameId = 0;

      if (!textureLoaded || !depthLoaded) {
        requestRender();
        return;
      }

      // Smooth interpolation for mouse position and intensity
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.08;
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.08;
      intensityCurrent += (intensityTarget - intensityCurrent) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Re-bind texture units
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, depthMap);

      // Pass values to uniforms
      gl.uniform2f(uMouseLoc, mouseCurrentX, -mouseCurrentY); // invert Y for WebGL texture coordinates
      gl.uniform1f(uIntensityLoc, intensityCurrent);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const err = gl.getError();
      if (err !== gl.NO_ERROR) {
        console.error('WebGL error:', err);
      }

      // Keep rendering if values haven't fully settled
      if (
        Math.abs(mouseTargetX - mouseCurrentX) > 0.001 || 
        Math.abs(mouseTargetY - mouseCurrentY) > 0.001 ||
        Math.abs(intensityTarget - intensityCurrent) > 0.001
      ) {
        requestRender();
      }
    };

    requestRender();

    const onMoveUpdate = () => {
      requestRender();
    };
    window.addEventListener('mousemove', onMoveUpdate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', onMoveUpdate);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);

      gl.deleteTexture(texture);
      gl.deleteTexture(depthMap);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-portrait-img"
      style={{ display: 'block', background: 'transparent', aspectRatio: '1122 / 1402' }}
    />
  );
}

export default HeroPortraitWebGL;
