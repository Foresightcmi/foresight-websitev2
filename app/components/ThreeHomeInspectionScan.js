'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export default function ThreeHomeInspectionScan() {
  const mountRef = useRef(null);
  const [activeMode, setActiveMode] = useState('visual');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  const hotspots = [
    {
      id: 'roof',
      title: '4K Aerial Drone Roof Scan',
      pos: [0, 2.8, 0],
      icon: '🚁',
      category: 'Exterior & Envelope',
      tech: 'High-Resolution 4K Aerial Drone + Telemetry',
      summary: 'Autonomous aerial sweep evaluating ridge vents, flashing integrity, missing architectural shingles, and masonry chimney crowns that cannot be safely walked.',
      protection: 'Included in $10K Warranty (Roof Leak Coverage up to $1,000)'
    },
    {
      id: 'attic',
      title: 'Attic & Thermal Envelope Diagnostics',
      pos: [0, 1.8, 0.8],
      icon: '🔍',
      category: 'Insulation & Ventilation',
      tech: 'FLIR E8 Infrared Thermal Imaging + Laser Temp',
      summary: 'Infrared sweep of roof rafters, blown-in R-38 fiberglass depth, soffit airflow, and hidden HVAC condensation duct leaks before moisture rots roof decking.',
      protection: 'Zero-deductible coverage for HVAC, insulation & moisture barrier'
    },
    {
      id: 'electrical',
      title: '200A Electrical Main Service Panel',
      pos: [1.6, 0.6, 0.5],
      icon: '⚡',
      category: 'Electrical Safety',
      tech: 'Infrared Thermal Load Scan + Ground-Fault Tester',
      summary: 'Complete audit for hazardous Federal Pacific Stab-Lok, Zinsco panels, aluminum branch wiring, double-tapped breakers, and dangerous overheating bus bars.',
      protection: 'Tested and certified safe under Georgia InterNACHI standards'
    },
    {
      id: 'foundation',
      title: 'Structural Slab & Crawlspace Leveling',
      pos: [-1.4, -0.6, 0.8],
      icon: '🧱',
      category: 'Structural Integrity',
      tech: 'Digital Precision Laser Level + Electronic Moisture Scanner',
      summary: 'Differential settlement analysis, foundation stem wall step-cracking detection, crawlspace 6-mil poly vapor barriers, and subterranean termite mud tube inspection.',
      protection: 'Backed by $10,000 Master Warranty structural integrity guarantee'
    },
    {
      id: 'plumbing',
      title: 'HD Underground Sewer Scope Camera',
      pos: [0.8, -1.3, -0.8],
      icon: '🚰',
      category: 'Main Drain Line',
      tech: 'Fiber-Optic Color Self-Leveling Lateral Sewer Camera',
      summary: 'Continuous 100-foot fiber optic push evaluating clay, cast iron, and PVC main lines for tree root intrusion, low belly pooling, offset joints, and collapse risks.',
      protection: 'High-liability lateral line defense preventing $8K-$15K excavation surprises'
    }
  ];

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(5.5, 4.2, 6.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(8, 12, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    blueRimLight.position.set(-8, -4, -6);
    scene.add(blueRimLight);

    const goldAccent = new THREE.PointLight(0xd4af37, 1.2, 10);
    goldAccent.position.set(0, 3, 2);
    scene.add(goldAccent);

    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    const gridHelper = new THREE.GridHelper(12, 24, 0xd4af37, 0x1e293b);
    gridHelper.position.y = -1.4;
    scene.add(gridHelper);

    const radarRingGeo = new THREE.RingGeometry(2.8, 3.0, 48);
    const radarRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const radarRing = new THREE.Mesh(radarRingGeo, radarRingMat);
    radarRing.rotation.x = Math.PI / 2;
    radarRing.position.y = -1.35;
    scene.add(radarRing);

    const getMaterials = (mode) => {
      if (mode === 'thermal') {
        return {
          wall: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.1 }),
          accentWall: new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.2 }),
          roof: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }),
          foundation: new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 }),
          glass: new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }),
          chimney: new THREE.MeshStandardMaterial({ color: 0xd97706 }),
          door: new THREE.MeshStandardMaterial({ color: 0xf43f5e })
        };
      } else if (mode === 'xray') {
        return {
          wall: new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.75 }),
          accentWall: new THREE.MeshStandardMaterial({ color: 0xd4af37, wireframe: true }),
          roof: new THREE.MeshStandardMaterial({ color: 0x60a5fa, wireframe: true }),
          foundation: new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true }),
          glass: new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true }),
          chimney: new THREE.MeshStandardMaterial({ color: 0xef4444, wireframe: true }),
          door: new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true })
        };
      } else {
        return {
          wall: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }),
          accentWall: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 }),
          roof: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }),
          foundation: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 }),
          glass: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.65 }),
          chimney: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 }),
          door: new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.3 })
        };
      }
    };

    const currentMats = getMaterials(activeMode);

    const fGeo = new THREE.BoxGeometry(3.6, 0.4, 3.2);
    const foundation = new THREE.Mesh(fGeo, currentMats.foundation);
    foundation.position.set(0, -1.2, 0);
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    houseGroup.add(foundation);

    const mainGeo = new THREE.BoxGeometry(3.2, 1.2, 2.8);
    const mainBody = new THREE.Mesh(mainGeo, currentMats.wall);
    mainBody.position.set(0, -0.4, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    houseGroup.add(mainBody);

    const upperGeo = new THREE.BoxGeometry(2.4, 1.0, 2.4);
    const upperBody = new THREE.Mesh(upperGeo, currentMats.accentWall);
    upperBody.position.set(-0.3, 0.7, 0);
    upperBody.castShadow = true;
    upperBody.receiveShadow = true;
    houseGroup.add(upperBody);

    const roofGeo = new THREE.ConeGeometry(2.1, 1.1, 4);
    const roof = new THREE.Mesh(roofGeo, currentMats.roof);
    roof.position.set(-0.3, 1.75, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    const chGeo = new THREE.BoxGeometry(0.35, 1.0, 0.35);
    const chimney = new THREE.Mesh(chGeo, currentMats.chimney);
    chimney.position.set(0.6, 1.8, -0.4);
    chimney.castShadow = true;
    houseGroup.add(chimney);

    const doorGeo = new THREE.BoxGeometry(0.5, 0.8, 0.05);
    const door = new THREE.Mesh(doorGeo, currentMats.door);
    door.position.set(0.2, -0.6, 1.42);
    houseGroup.add(door);

    const winGeo = new THREE.BoxGeometry(0.6, 0.5, 0.05);
    const win1 = new THREE.Mesh(winGeo, currentMats.glass);
    win1.position.set(-0.8, -0.4, 1.42);
    houseGroup.add(win1);

    const win2 = new THREE.Mesh(winGeo, currentMats.glass);
    win2.position.set(-0.3, 0.7, 1.22);
    houseGroup.add(win2);

    const beaconGroup = new THREE.Group();
    houseGroup.add(beaconGroup);

    const beaconMeshes = [];
    hotspots.forEach((spot) => {
      const bGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0xd4af37,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(bGeo, bMat);
      mesh.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
      mesh.userData = { hotspotId: spot.id };
      beaconGroup.add(mesh);
      beaconMeshes.push(mesh);

      const haloGeo = new THREE.RingGeometry(0.16, 0.22, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
      halo.lookAt(camera.position);
      mesh.add(halo);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(beaconMeshes);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.hotspotId;
        const targetSpot = hotspots.find(h => h.id === hitId);
        if (targetSpot) {
          setSelectedHotspot(targetSpot);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      houseGroup.rotation.y += deltaX * 0.008;
      houseGroup.rotation.x = Math.max(-0.4, Math.min(0.6, houseGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      houseGroup.rotation.y += deltaX * 0.008;
      houseGroup.rotation.x = Math.max(-0.4, Math.min(0.6, houseGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        houseGroup.rotation.y += 0.003;
      }

      beaconMeshes.forEach((b, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 4 + idx) * 0.2;
        b.scale.set(scale, scale, scale);
      });

      radarRing.scale.set(
        1 + (elapsedTime % 2.5) * 0.35,
        1 + (elapsedTime % 2.5) * 0.35,
        1
      );
      radarRingMat.opacity = Math.max(0, 0.7 - ((elapsedTime % 2.5) / 2.5) * 0.7);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeMode, isRotating]);

  return (
    <section className="section bg-dark text-white" style={{ position: 'relative', overflow: 'hidden', padding: '5rem 0' }}>
      <div className="container">
        <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            🛰️ Interactive 3D Property Diagnostic Explorer
          </span>
          <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800 }}>
            Inspect A Home In 3D: See What Our 2-Inspector Team Evaluates
          </h2>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '780px', margin: '0.5rem auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Drag to rotate the 3D property model. Click any pulsing beacon to inspect critical structural zones, thermal imaging layers, and drone diagnostic pathways.
          </p>
        </div>

        {/* Mode Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveMode('visual')}
            className={activeMode === 'visual' ? 'btn btn-gold' : 'btn btn-outline-light'}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px' }}
          >
            🏛️ 3D Architectural Visual
          </button>
          <button
            onClick={() => setActiveMode('thermal')}
            className={activeMode === 'thermal' ? 'btn btn-primary' : 'btn btn-outline-light'}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px' }}
          >
            🔥 FLIR Infrared Heat-Map
          </button>
          <button
            onClick={() => setActiveMode('xray')}
            className={activeMode === 'xray' ? 'btn btn-outline' : 'btn btn-outline-light'}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px', borderColor: activeMode === 'xray' ? '#38bdf8' : undefined, color: activeMode === 'xray' ? '#38bdf8' : undefined }}
          >
            ⚡ X-Ray Wireframe Diagnostics
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="btn btn-outline-light"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '50px' }}
            title="Toggle Auto Rotation"
          >
            {isRotating ? '⏸️ Pause Spin' : '▶️ Resume Spin'}
          </button>
        </div>

        {/* 3D Canvas & Interactive HUD Overlay */}
        <div style={{ position: 'relative', width: '100%', height: '520px', background: 'radial-gradient(circle at center, #1e293b 0%, #0a0f1d 100%)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}>
          
          <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

          <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#94a3b8', pointerEvents: 'none' }}>
            🖱️ <em>Click &amp; drag to rotate | Tap gold beacons to inspect systems</em>
          </div>

          {selectedHotspot ? (
            <div style={{ position: 'absolute', top: '16px', right: '16px', maxWidth: '360px', width: 'calc(100% - 32px)', background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(212, 175, 55, 0.5)', borderRadius: 'var(--radius-md)', padding: '1.5rem', zIndex: 10, boxShadow: '0 12px 35px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700 }}>
                  {selectedHotspot.category}
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
                  aria-label="Close hotspot info"
                >
                  ✕
                </button>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                {selectedHotspot.icon} {selectedHotspot.title}
              </h3>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.75rem', borderLeft: '3px solid #38bdf8' }}>
                🛠️ <strong>Diagnostic Gear:</strong> {selectedHotspot.tech}
              </div>

              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: '1rem' }}>
                {selectedHotspot.summary}
              </p>

              <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#4ade80', marginBottom: '1rem', fontWeight: 600 }}>
                🛡️ {selectedHotspot.protection}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                >
                  Book 24/7
                </a>
                <Link
                  href="/quote"
                  className="btn btn-outline-light"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                >
                  Price Quote
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', maxWidth: '320px', fontSize: '0.85rem', color: '#e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                ⚡ Certified Master Inspector Standard
              </div>
              <div>
                Every inspection includes dual-inspector cross-checks, $10,000 warranty protection &amp; free FLIR infrared scans.
              </div>
            </div>
          )}
        </div>

        {/* 5-Checkpoint Diagnostic Grid Below 3D Canvas */}
        <div className="grid grid-3" style={{ gap: '1rem', marginTop: '2rem' }}>
          {hotspots.slice(0, 3).map((spot) => (
            <div
              key={spot.id}
              onClick={() => setSelectedHotspot(spot)}
              className="card"
              style={{
                background: selectedHotspot?.id === spot.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedHotspot?.id === spot.id ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{spot.icon}</div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                {spot.title}
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>
                {spot.tech}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
