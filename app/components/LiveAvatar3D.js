'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function LiveAvatar3D({
  callState = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  persona = 'chris',   // 'chris' | 'jordan'
  analyserNode = null,
  onClick = () => {}
}) {
  const containerRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. WebGL Support Detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 280;

    // 2. Scene, Camera, and High-Performance Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 3.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 3. Luxurious Executive Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    // Key Light (Warm Key)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    // Foresight Signature Gold Rim Light
    const goldRimLight = new THREE.DirectionalLight(0xd4af37, 3.8);
    goldRimLight.position.set(-3, 2, -2);
    scene.add(goldRimLight);

    // Accent Under-Chin Dynamic Light
    const chinLight = new THREE.PointLight(0xd4af37, 1.5, 5);
    chinLight.position.set(0, -1.2, 1.2);
    scene.add(chinLight);

    // 4. Master Avatar Hierarchy
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Materials Palette (Obsidian Slate + Gold Accent + Semi-Matte Skin)
    const skinColor = persona === 'chris' ? 0x6e473b : 0x8a5a44;
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.58,
      metalness: 0.08
    });

    const suitMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.82,
      metalness: 0.15
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.85
    });

    const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const irisMaterial = new THREE.MeshBasicMaterial({ color: 0x3d2314 });
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const lipMaterial = new THREE.MeshStandardMaterial({
      color: persona === 'chris' ? 0x5a352c : 0x7a4338,
      roughness: 0.45,
      metalness: 0.05
    });

    // --- TORSO / BUST (Executive Blazer) ---
    const torsoGeo = new THREE.CylinderGeometry(0.75, 0.95, 1.2, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, suitMaterial);
    torsoMesh.position.set(0, -1.1, 0);
    avatarGroup.add(torsoMesh);

    // CMI® Gold Lapel / Collar Trim
    const collarGeo = new THREE.TorusGeometry(0.52, 0.045, 16, 32, Math.PI);
    const collarMesh = new THREE.Mesh(collarGeo, goldMaterial);
    collarMesh.position.set(0, -0.48, 0.18);
    collarMesh.rotation.x = Math.PI / 2 + 0.1;
    collarMesh.rotation.z = Math.PI;
    avatarGroup.add(collarMesh);

    // Official Certified Master Inspector Badge on Chest
    const badgeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 32);
    const badgeMesh = new THREE.Mesh(badgeGeo, goldMaterial);
    badgeMesh.position.set(0.42, -0.85, 0.52);
    badgeMesh.rotation.x = Math.PI / 2;
    badgeMesh.rotation.y = -0.3;
    avatarGroup.add(badgeMesh);

    // --- NECK ---
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.45, 32);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.set(0, -0.35, 0);
    avatarGroup.add(neckMesh);

    // --- HEAD GROUP (Tracks mouse, tilts, speaks) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.15, 0);
    avatarGroup.add(headGroup);

    // Cranium / Face Base
    const headGeo = new THREE.SphereGeometry(0.68, 36, 36);
    headGeo.scale(0.92, 1.15, 1.0);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headGroup.add(headMesh);

    // Cheeks & Chin Contours
    const chinGeo = new THREE.SphereGeometry(0.32, 24, 24);
    chinGeo.scale(0.85, 0.95, 0.9);
    const chinMesh = new THREE.Mesh(chinGeo, skinMaterial);
    chinMesh.position.set(0, -0.5, 0.3);
    headGroup.add(chinMesh);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.12, 0.32, 16);
    const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
    noseMesh.position.set(0, -0.05, 0.72);
    noseMesh.rotation.x = 0.25;
    headGroup.add(noseMesh);

    // Hair Structure
    const hairGeo = new THREE.SphereGeometry(0.72, 32, 32);
    hairGeo.scale(0.95, 1.12, 0.98);
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9,
      metalness: 0.05
    });
    const hairMesh = new THREE.Mesh(hairGeo, hairMaterial);
    hairMesh.position.set(0, 0.08, -0.06);
    headGroup.add(hairMesh);

    // --- EYES & EYELIDS (Blinking & Tracking) ---
    const createEye = (isRight = false) => {
      const eyeGroup = new THREE.Group();
      const xOffset = isRight ? 0.26 : -0.26;
      eyeGroup.position.set(xOffset, 0.12, 0.58);

      // Eyeball
      const eyeballGeo = new THREE.SphereGeometry(0.12, 20, 20);
      const eyeball = new THREE.Mesh(eyeballGeo, eyeWhiteMaterial);
      eyeGroup.add(eyeball);

      // Iris
      const irisGeo = new THREE.CircleGeometry(0.065, 20);
      const iris = new THREE.Mesh(irisGeo, irisMaterial);
      iris.position.set(0, 0, 0.118);
      eyeGroup.add(iris);

      // Pupil
      const pupilGeo = new THREE.CircleGeometry(0.035, 20);
      const pupil = new THREE.Mesh(pupilGeo, pupilMaterial);
      pupil.position.set(0, 0, 0.12);
      eyeGroup.add(pupil);

      // Upper Eyelid (Scales to 0 for blinks)
      const eyelidGeo = new THREE.SphereGeometry(0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const eyelid = new THREE.Mesh(eyelidGeo, skinMaterial);
      eyelid.position.set(0, 0.01, 0.01);
      eyelid.rotation.x = -Math.PI / 2;
      eyeGroup.add(eyelid);

      return { eyeGroup, iris, eyelid };
    };

    const leftEye = createEye(false);
    const rightEye = createEye(true);
    headGroup.add(leftEye.eyeGroup);
    headGroup.add(rightEye.eyeGroup);

    // --- MOUTH & ARTICULATED JAW (Direct Speech Viseme Sync) ---
    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, -0.32, 0.38);
    headGroup.add(jawPivot);

    // Upper Lip (Static on head)
    const upperLipGeo = new THREE.BoxGeometry(0.24, 0.045, 0.06);
    const upperLip = new THREE.Mesh(upperLipGeo, lipMaterial);
    upperLip.position.set(0, -0.28, 0.64);
    headGroup.add(upperLip);

    // Lower Lip & Articulated Jaw (Rotates down on speech amplitude)
    const lowerLipGeo = new THREE.BoxGeometry(0.22, 0.055, 0.07);
    const lowerLip = new THREE.Mesh(lowerLipGeo, lipMaterial);
    lowerLip.position.set(0, -0.06, 0.28);
    jawPivot.add(lowerLip);

    // Interior Oral Cavity (Depth)
    const mouthInnerGeo = new THREE.PlaneGeometry(0.2, 0.12);
    const mouthInnerMat = new THREE.MeshBasicMaterial({ color: 0x1f0a08 });
    const mouthInner = new THREE.Mesh(mouthInnerGeo, mouthInnerMat);
    mouthInner.position.set(0, -0.32, 0.62);
    headGroup.add(mouthInner);

    // --- AMBIENT SOUND-REACTIVE BASE RINGS ---
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, -1.65, 0);
    avatarGroup.add(haloGroup);

    const haloGeo1 = new THREE.RingGeometry(1.0, 1.05, 48);
    const haloMat1 = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const halo1 = new THREE.Mesh(haloGeo1, haloMat1);
    halo1.rotation.x = Math.PI / 2;
    haloGroup.add(halo1);

    const haloGeo2 = new THREE.RingGeometry(1.2, 1.23, 48);
    const haloMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const halo2 = new THREE.Mesh(haloGeo2, haloMat2);
    halo2.rotation.x = Math.PI / 2;
    haloGroup.add(halo2);

    // 5. Interactive Mouse & Touch Gaze Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? rect.left + rect.width / 2;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? rect.top + rect.height / 2;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetMouseX = THREE.MathUtils.clamp(normX * 0.25, -0.3, 0.3);
      targetMouseY = THREE.MathUtils.clamp(normY * 0.2, -0.2, 0.2);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 6. Animation State Variables
    let animationFrameId;
    let clock = new THREE.Clock();
    let nextBlinkTime = 2.5;
    let isBlinking = false;
    let blinkStartTime = 0;
    const freqData = new Uint8Array(64);

    // 7. Render Loop (Strict 60 FPS)
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Mouse Tracking
      currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.08);
      currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.08);

      // Natural Idle Breathing Movement
      const breath = Math.sin(elapsedTime * 1.6) * 0.02;
      avatarGroup.position.y = breath;

      // Base Head Rotation (Mouse tracking + gentle sway)
      headGroup.rotation.y = currentMouseX + Math.sin(elapsedTime * 0.8) * 0.03;
      headGroup.rotation.x = -currentMouseY + Math.cos(elapsedTime * 1.2) * 0.02;

      // Dynamic State Posing
      if (callState === 'listening') {
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, -0.06, 0.1); // Attentive tilt
        chinLight.color.setHex(0x10b981); // Emerald ready
        haloMat1.color.setHex(0x10b981);
        haloMat1.opacity = 0.5 + Math.sin(elapsedTime * 4) * 0.2;
      } else if (callState === 'thinking') {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.12, 0.1); // Pondering glance
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -0.08, 0.1);
        chinLight.color.setHex(0x38bdf8);
        haloMat1.color.setHex(0x38bdf8);
      } else if (callState === 'speaking') {
        chinLight.color.setHex(0xd4af37); // Foresight Gold Aura
        haloMat1.color.setHex(0xd4af37);
        haloMat1.opacity = 0.6 + Math.sin(elapsedTime * 8) * 0.3;
      } else {
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.08);
        chinLight.color.setHex(0xd4af37);
        haloMat1.color.setHex(0xd4af37);
        haloMat1.opacity = 0.25;
      }

      // 8. REAL-TIME MOUTH / VISEME AUDIO SYNCHRONIZATION
      let speechVolume = 0;

      if (analyserNode && callState === 'speaking') {
        analyserNode.getByteFrequencyData(freqData);
        // Sample fundamental speech vowel frequencies (bins 2 through 10, approx 150Hz - 800Hz)
        let sum = 0;
        for (let i = 2; i <= 10; i++) {
          sum += freqData[i];
        }
        speechVolume = sum / (9 * 255); // Normalized 0.0 to 1.0
      } else if (callState === 'speaking') {
        // Fallback acoustic cadence generator if analyser node is initializing
        speechVolume = Math.abs(Math.sin(elapsedTime * 14)) * 0.65;
      }

      // Smooth Jaw Opening and Lip Shaping
      const targetJawRotation = THREE.MathUtils.clamp(speechVolume * 0.42, 0, 0.45);
      jawPivot.rotation.x = THREE.MathUtils.lerp(jawPivot.rotation.x, targetJawRotation, 0.32);

      const targetLipSpread = 1 + speechVolume * 0.35;
      lowerLip.scale.x = THREE.MathUtils.lerp(lowerLip.scale.x, targetLipSpread, 0.28);
      upperLip.scale.x = THREE.MathUtils.lerp(upperLip.scale.x, targetLipSpread, 0.28);

      // Micro head nods in sync with speech emphasis
      if (callState === 'speaking') {
        headGroup.position.y = 0.15 - speechVolume * 0.04;
      } else {
        headGroup.position.y = THREE.MathUtils.lerp(headGroup.position.y, 0.15, 0.1);
      }

      // 9. Natural Eye Blinking Logic
      if (!isBlinking && elapsedTime > nextBlinkTime) {
        isBlinking = true;
        blinkStartTime = elapsedTime;
        nextBlinkTime = elapsedTime + 3.0 + Math.random() * 2.5; // Random interval 3.0 - 5.5s
      }

      if (isBlinking) {
        const blinkProgress = (elapsedTime - blinkStartTime) / 0.16; // 160ms blink duration
        if (blinkProgress >= 1) {
          isBlinking = false;
          leftEye.eyelid.scale.y = 0.05;
          rightEye.eyelid.scale.y = 0.05;
        } else {
          // Sine wave blink curve (snap shut, smoothly reopen)
          const eyelidClosure = Math.sin(blinkProgress * Math.PI);
          const lidScale = THREE.MathUtils.lerp(0.05, 1.25, eyelidClosure);
          leftEye.eyelid.scale.y = lidScale;
          rightEye.eyelid.scale.y = lidScale;
        }
      }

      // Halo particle rotation
      halo1.rotation.z = elapsedTime * 0.15;
      halo2.rotation.z = -elapsedTime * 0.22;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 280;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 11. Complete Resource Disposal and Memory Leak Prevention
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [persona, callState, analyserNode]);

  if (!webGlSupported) {
    // Graceful 2D Fallback for older legacy hardware
    return (
      <div 
        onClick={onClick}
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #D4AF37',
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <img
          src={persona === 'jordan' ? '/images/jordan-avatar.webp' : '/images/Christopher_Boykin.webp'}
          alt="Live Concierge Avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '280px',
        height: '280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
      title={callState === 'listening' ? 'Listening... Tap to speak' : callState === 'speaking' ? 'Speaking... Tap to interrupt' : 'Live Concierge'}
    >
      {/* 3D WebGL Canvas Target */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative', 
          zIndex: 2,
          filter: callState === 'speaking' ? 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' : 'none',
          transition: 'filter 0.3s ease'
        }} 
      />

      {/* CMI® Badge Indicator in bottom-right corner */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '18px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#0F172A',
          border: '2px solid #D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
        }}
      >
        <img
          src="/images/cmi_logo.webp"
          alt="Certified Master Inspector"
          style={{ width: '24px', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Status Pill Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: callState === 'speaking' 
            ? 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(184,149,40,0.95))'
            : callState === 'listening'
            ? 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))'
            : 'rgba(15,23,42,0.85)',
          color: callState === 'speaking' ? '#0F172A' : '#FFFFFF',
          border: '1px solid rgba(212,175,55,0.4)',
          borderRadius: '9999px',
          padding: '3px 12px',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: callState === 'speaking' ? '#0F172A' : callState === 'listening' ? '#34D399' : '#D4AF37',
          boxShadow: '0 0 6px currentColor'
        }} />
        <span>{callState === 'speaking' ? 'Speaking...' : callState === 'listening' ? 'Listening...' : callState === 'thinking' ? 'Thinking...' : '3D Live Concierge'}</span>
      </div>
    </div>
  );
}
