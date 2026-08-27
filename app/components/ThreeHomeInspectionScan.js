'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export default function ThreeHomeInspectionScan() {
  const mountRef = useRef(null);
  const [activeMode, setActiveMode] = useState('visual'); // 'visual', 'xray', 'thermal', 'tactical'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeTab, setActiveTab] = useState('sop'); // 'sop', 'beyond', 'defects', 'warranty'

  // Comprehensive InterNACHI Standards of Practice (SOP) Hotspot Registry
  const hotspots = [
    {
      id: 'roof',
      title: 'InterNACHI SOP 3.1: Roof Systems & Aerial Drone Telemetry',
      sopCode: 'Section 3.1 (Roof)',
      pos: [0, 3.2, 0.2],
      icon: '🚁',
      category: 'Roof Systems',
      tech: 'High-Definition 4K Aerial Drone + Optical Zoom Telemetry',
      sopRequirement: 'The inspector shall inspect roof coverings, drainage systems, flashing, skylights, chimneys, and roof penetrations, and report methods used to inspect the roof.',
      beyondStandard: 'Foresight utilizes high-resolution 4K camera drones with telemetry to inspect steep pitches, multi-story gables, copper valleys, and fragile architectural shingles that cannot be walked safely without causing structural damage.',
      defectThresholds: 'Hail strike granule loss, broken/lifted shingles, unsealed chimney flashing, cracked chimney crown wash, obstructed valley drainage, and failing plumbing boot seals.',
      protection: '$10,000 Elite Master Warranty provides up to $1,000 zero-deductible roof leak coverage for 90 days post-closing.'
    },
    {
      id: 'attic',
      title: 'InterNACHI SOP 3.8: Attic, Insulation & Thermal Envelope',
      sopCode: 'Section 3.8 (Attic & Insulation)',
      pos: [0, 2.0, 0.8],
      icon: '🔍',
      category: 'Attic & Insulation',
      tech: 'FLIR E8 Infrared Thermal Camera + Laser Distance Depth Meter',
      sopRequirement: 'The inspector shall inspect insulation in unfinished spaces, ventilation of attics and foundation areas, kitchen/bath exhaust systems, and structural framing members.',
      beyondStandard: 'We perform complete FLIR infrared thermal scans across ceiling surfaces to identify hidden missing fiberglass voids, disconnected bath vent hoses dumping humid air into attics, and compressed insulation before energy bills spike.',
      defectThresholds: 'Insulation depth below Georgia code R-38 (< 13 inches), blocked soffit baffle vents, uninsulated attic scuttle hatches, severed roof truss webs, and active roof sheathing moisture staining.',
      protection: 'Zero-deductible mechanical and building envelope protection under our Master CMI Guarantee.'
    },
    {
      id: 'electrical',
      title: 'InterNACHI SOP 3.6: 200A Electrical Service & Panelboards',
      sopCode: 'Section 3.6 (Electrical)',
      pos: [2.1, 0.7, 0.2],
      icon: '⚡',
      category: 'Electrical Safety',
      tech: 'Infrared Thermal Panel Scan + Dynamic Circuit Arc / Ground-Fault Analyzer',
      sopRequirement: 'The inspector shall inspect the service drop, entrance conductors, main disconnect, subpanels, overcurrent devices, grounding, representative outlets, switches, GFCI, and AFCI devices.',
      beyondStandard: 'Thermal infrared scanning of all circuit breakers under active load to detect loose busbar lugs, micro-arcing, and dangerous high-resistance hotspots. Full screening for obsolete Federal Pacific Stab-Lok and Zinsco fire hazards.',
      defectThresholds: 'Double-tapped breakers, ungrounded 3-prong outlets, missing GFCI protection in kitchens/baths/exteriors, undersized conductors, multi-wire branch circuit neutral sharing, and aluminum branch wiring.',
      protection: 'Complete electrical safety verification backed by InterNACHI Certified Master Inspector credentials.'
    },
    {
      id: 'hvac',
      title: 'InterNACHI SOP 3.4: HVAC Systems & Delta-T Diagnostics',
      sopCode: 'Section 3.4 (HVAC Systems)',
      pos: [-0.6, 2.1, -0.6],
      icon: '❄️',
      category: 'Heating & Cooling',
      tech: 'Calibrated Differential Thermometers + Electronic Gas Sniffer + FLIR IR',
      sopRequirement: 'The inspector shall inspect heating and cooling equipment using normal operating controls, distribution systems, flues, chimneys, and primary/secondary condensate drainage.',
      beyondStandard: 'Thermodynamic Delta-T temperature split testing (verifying 15°F–20°F evaporator drop), attic flex duct leakage infrared scans, heat exchanger carbon monoxide testing, and secondary emergency drain pan float switch verification.',
      defectThresholds: 'Delta-T drop below 14°F (low refrigerant / failing TXV valve), cracked gas furnace heat exchanger, leaking A2L/R-410A coils, disconnected attic supply boots, and uninsulated condensate lines.',
      protection: 'Guaranteed inspection coverage defending buyers against sudden $9,500 to $16,000+ HVAC replacement expenses.'
    },
    {
      id: 'plumbing',
      title: 'InterNACHI SOP 3.5: Plumbing & HD Lateral Sewer Scope',
      sopCode: 'Section 3.5 (Plumbing Systems)',
      pos: [1.2, -1.3, -1.0],
      icon: '🚰',
      category: 'Plumbing & Drains',
      tech: '100-Ft Fiber-Optic Self-Leveling Sewer Camera with 512Hz Sonde Transmitter',
      sopRequirement: 'The inspector shall inspect main water shutoff, pressure regulators, interior water supply, drain/waste/vent pipes, water heaters, and automatic safety relief valves (TPR).',
      beyondStandard: 'Continuous 100-foot fiber-optic camera scope ($425) through the underground lateral main line all the way to the municipal city tie-in. Real-time video logging of roots, bellies, cast-iron scaling, and joint separations.',
      defectThresholds: 'Collapsed clay sewer pipes under driveways, tree root blockages, low-belly standing water pools, missing water heater expansion tanks, unpiped TPR relief valves, and galvanized water supply corrosion.',
      protection: 'Eliminates high-liability $8,000 to $18,000 underground excavation surprises during due diligence.'
    },
    {
      id: 'foundation',
      title: 'InterNACHI SOP 3.3: Structural Foundation & Crawlspace',
      sopCode: 'Section 3.3 (Structural Components)',
      pos: [-2.0, -0.9, 0.8],
      icon: '🧱',
      category: 'Structural Integrity',
      tech: 'Digital Precision Laser Level + Electronic Pinless Moisture Scanner',
      sopRequirement: 'The inspector shall inspect the foundation, basement, crawlspace, and structural components, describing foundation types and reporting indications of movement or water penetration.',
      beyondStandard: 'Laser-level elevation mapping across structural floors to detect differential settlement exceeding 1 inch in 20 feet. Comprehensive inspection of crawlspace 6-mil poly vapor retarders and subterranean termite mud tubes.',
      defectThresholds: 'Stair-step brick mortar shear cracking, inward CMU wall deflection from Georgia red clay hydrostatic pressure, rot in sill plates, sagging floor joists, and missing perimeter footing drainage.',
      protection: 'Backed by $10,000 Master Warranty structural integrity coverage.'
    },
    {
      id: 'exterior',
      title: 'InterNACHI SOP 3.2: Exterior Envelope, Siding & Site Grading',
      sopCode: 'Section 3.2 (Exterior Envelope)',
      pos: [1.8, 0.3, 1.8],
      icon: '🏡',
      category: 'Exterior & Grading',
      tech: 'Optical Digital Inclinometer + Moisture Probe + Kickout Flashing Gauge',
      sopRequirement: 'The inspector shall inspect wall coverings, flashing, trim, exterior doors, decks, balconies, handrails, eaves, soffits, fascias, and vegetation/grading/surface drainage.',
      beyondStandard: 'Rigorous calculation of ground surface slope (ensuring mandatory 6-inch drop over the first 10 feet), brick veneer weep hole spacing, fiber-cement siding ground clearances, and deck ledger board structural bolt spacing.',
      defectThresholds: 'Negative surface grading directing water toward foundation, unbolted deck ledger boards, rotted band joists, missing kickout flashing behind siding, and failing exterior caulk seals.',
      protection: 'Full exterior envelope certification protecting against subterranean water entry.'
    },
    {
      id: 'interior',
      title: 'InterNACHI SOP 3.9: Doors, Windows & Safety Glazing',
      sopCode: 'Section 3.9 (Interior Systems)',
      pos: [-1.2, 0.8, 1.6],
      icon: '🚪',
      category: 'Interior & Windows',
      tech: 'Infrared Thermal Window Sweep + Laser Non-Contact Glass Temp Gun',
      sopRequirement: 'The inspector shall inspect representative doors and windows, garage doors and garage door openers, stairs, railings, guards, interior walls, ceilings, and floors.',
      beyondStandard: 'Thermal infrared mapping of window headers and sills to detect hidden seal leaks. Verification of tempered safety glazing within 24 inches of door thresholds and 60 inches of shower/tub floors.',
      defectThresholds: 'Failed dual-pane insulating glass seals (fogging/condensation), broken sash cords, non-functioning garage door photo-eye auto-reversal, and handrail spindle spacing exceeding 4 inches.',
      protection: 'Complete interior safety inspection verified under InterNACHI Standards of Practice.'
    }
  ];

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 560;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(6.8, 5.0, 7.8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // PROCEDURAL TEXTURE GENERATORS (Zero network requests, 100% crisp offline WebGL)
    const createShingleCanvas = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#2c3540';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#1e252e';
      ctx.lineWidth = 4;
      for (let y = 0; y < 512; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
        const offset = (y / 32) % 2 === 0 ? 0 : 32;
        for (let x = offset; x < 512; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 32);
          ctx.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    };

    const createBrickCanvas = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#991b1b'; // Atlanta red brick
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#e2e8f0'; // Mortar lines
      ctx.lineWidth = 3;
      for (let y = 0; y < 512; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
        const offset = (y / 24) % 2 === 0 ? 0 : 24;
        for (let x = offset; x < 512; x += 48) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 24);
          ctx.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    };

    const createSidingCanvas = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#f1f5f9'; // Clean modern horizontal lap siding
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 5;
      for (let y = 0; y < 512; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    };

    const createGrassCanvas = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1e3a1e';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = '#2d5a27';
      for (let i = 0; i < 4000; i++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
      }
      return new THREE.CanvasTexture(c);
    };

    const createWoodCanvas = () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      for (let y = 0; y < 256; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    };

    const shingleTex = createShingleCanvas();
    shingleTex.wrapS = THREE.RepeatWrapping;
    shingleTex.wrapT = THREE.RepeatWrapping;
    shingleTex.repeat.set(3, 3);

    const brickTex = createBrickCanvas();
    brickTex.wrapS = THREE.RepeatWrapping;
    brickTex.wrapT = THREE.RepeatWrapping;
    brickTex.repeat.set(4, 2);

    const sidingTex = createSidingCanvas();
    sidingTex.wrapS = THREE.RepeatWrapping;
    sidingTex.wrapT = THREE.RepeatWrapping;
    sidingTex.repeat.set(2, 4);

    const grassTex = createGrassCanvas();
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(6, 6);

    const woodTex = createWoodCanvas();

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(10, 15, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0x38bdf8, 0.65);
    skyFill.position.set(-10, -5, -8);
    scene.add(skyFill);

    const goldAccent = new THREE.PointLight(0xd4af37, 1.5, 12);
    goldAccent.position.set(0, 3.5, 2.5);
    scene.add(goldAccent);

    // ROOT HOUSE GROUP
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // GROUND & LANDSCAPING
    const groundGeo = new THREE.CylinderGeometry(6.2, 6.2, 0.2, 64);
    const groundMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    houseGroup.add(ground);

    // Concrete Driveway & Walkway
    const driveGeo = new THREE.BoxGeometry(2.0, 0.22, 3.5);
    const concMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const driveway = new THREE.Mesh(driveGeo, concMat);
    driveway.position.set(2.4, -1.49, 1.8);
    driveway.receiveShadow = true;
    houseGroup.add(driveway);

    const walkGeo = new THREE.BoxGeometry(0.8, 0.22, 2.2);
    const walk = new THREE.Mesh(walkGeo, concMat);
    walk.position.set(0.2, -1.49, 2.2);
    walk.receiveShadow = true;
    houseGroup.add(walk);

    // MATERIAL DICTIONARY BASED ON VIEW MODE
    const getMaterials = (mode) => {
      if (mode === 'thermal') {
        return {
          brick: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }),
          siding: new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.3 }),
          roof: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }), // Warm amber heat escape
          foundation: new THREE.MeshStandardMaterial({ color: 0x075985 }),
          glass: new THREE.MeshStandardMaterial({ color: 0xe11d48, transparent: true, opacity: 0.8 }), // Hot red leak
          wood: new THREE.MeshStandardMaterial({ color: 0x0284c7 }),
          duct: new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.6 }),
          wire: new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.8 })
        };
      } else if (mode === 'xray') {
        return {
          brick: new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.35 }),
          siding: new THREE.MeshStandardMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.35 }),
          roof: new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true, transparent: true, opacity: 0.4 }),
          foundation: new THREE.MeshStandardMaterial({ color: 0x64748b, wireframe: true, opacity: 0.5 }),
          glass: new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true }),
          wood: new THREE.MeshStandardMaterial({ color: 0xd4af37, wireframe: true }),
          duct: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }),
          wire: new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.5 })
        };
      } else if (mode === 'tactical') {
        return {
          brick: new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.7, opacity: 0.85, transparent: true }),
          siding: new THREE.MeshStandardMaterial({ map: sidingTex, roughness: 0.5, opacity: 0.85, transparent: true }),
          roof: new THREE.MeshStandardMaterial({ map: shingleTex, roughness: 0.8 }),
          foundation: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 }),
          glass: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.7 }),
          wood: new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.6 }),
          duct: new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
          wire: new THREE.MeshStandardMaterial({ color: 0xd4af37 })
        };
      } else {
        // ULTRA-REALISTIC ARCHITECTURAL MASTER VIEW
        return {
          brick: new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.7 }),
          siding: new THREE.MeshStandardMaterial({ map: sidingTex, roughness: 0.5 }),
          roof: new THREE.MeshStandardMaterial({ map: shingleTex, roughness: 0.75, metalness: 0.05 }),
          foundation: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 }),
          glass: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.75 }),
          wood: new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.6 }),
          duct: new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
          wire: new THREE.MeshStandardMaterial({ color: 0xd4af37 })
        };
      }
    };

    const mats = getMaterials(activeMode);

    // 1. FOUNDATION SLAB & STEM WALLS
    const fGeo = new THREE.BoxGeometry(4.2, 0.5, 3.6);
    const foundation = new THREE.Mesh(fGeo, mats.foundation);
    foundation.position.set(0, -1.2, 0);
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    houseGroup.add(foundation);

    // 2. FIRST FLOOR (BRICK MASONRY BODY)
    const floor1Geo = new THREE.BoxGeometry(4.0, 1.4, 3.4);
    const floor1 = new THREE.Mesh(floor1Geo, mats.brick);
    floor1.position.set(0, -0.3, 0);
    floor1.castShadow = true;
    floor1.receiveShadow = true;
    houseGroup.add(floor1);

    // 3. SECOND FLOOR (HORIZONTAL SIDING BODY)
    const floor2Geo = new THREE.BoxGeometry(3.6, 1.3, 3.0);
    const floor2 = new THREE.Mesh(floor2Geo, mats.siding);
    floor2.position.set(-0.2, 1.05, 0);
    floor2.castShadow = true;
    floor2.receiveShadow = true;
    houseGroup.add(floor2);

    // 4. MAIN ROOF GABLES & EAVES
    const roofMainGeo = new THREE.ConeGeometry(2.9, 1.4, 4);
    const roofMain = new THREE.Mesh(roofMainGeo, mats.roof);
    roofMain.position.set(-0.2, 2.4, 0);
    roofMain.rotation.y = Math.PI / 4;
    roofMain.castShadow = true;
    houseGroup.add(roofMain);

    // Front Dormer Roof
    const dormerGeo = new THREE.ConeGeometry(1.2, 0.9, 4);
    const dormerRoof = new THREE.Mesh(dormerGeo, mats.roof);
    dormerRoof.position.set(0.6, 1.9, 1.2);
    dormerRoof.rotation.y = Math.PI / 4;
    dormerRoof.castShadow = true;
    houseGroup.add(dormerRoof);

    // 5. BRICK CHIMNEY & CONCRETE CAP
    const chimGeo = new THREE.BoxGeometry(0.45, 1.8, 0.45);
    const chimney = new THREE.Mesh(chimGeo, mats.brick);
    chimney.position.set(1.2, 2.2, -0.8);
    chimney.castShadow = true;
    houseGroup.add(chimney);

    const capGeo = new THREE.BoxGeometry(0.55, 0.1, 0.55);
    const chimCap = new THREE.Mesh(capGeo, mats.foundation);
    chimCap.position.set(1.2, 3.15, -0.8);
    houseGroup.add(chimCap);

    // 6. FRONT COVERED PORCH & COLUMNS
    const porchGeo = new THREE.BoxGeometry(2.2, 0.15, 1.2);
    const porchDeck = new THREE.Mesh(porchGeo, mats.wood);
    porchDeck.position.set(0.3, -0.95, 2.1);
    porchDeck.receiveShadow = true;
    houseGroup.add(porchDeck);

    const colGeo = new THREE.BoxGeometry(0.12, 1.3, 0.12);
    const col1 = new THREE.Mesh(colGeo, mats.siding);
    col1.position.set(-0.6, -0.3, 2.5);
    col1.castShadow = true;
    houseGroup.add(col1);

    const col2 = new THREE.Mesh(colGeo, mats.siding);
    col2.position.set(1.2, -0.3, 2.5);
    col2.castShadow = true;
    houseGroup.add(col2);

    const porchRoofGeo = new THREE.BoxGeometry(2.4, 0.15, 1.4);
    const porchRoof = new THREE.Mesh(porchRoofGeo, mats.roof);
    porchRoof.position.set(0.3, 0.4, 2.1);
    porchRoof.rotation.x = 0.15;
    porchRoof.castShadow = true;
    houseGroup.add(porchRoof);

    // 7. ARCHITECTURAL WINDOWS WITH FRAMES
    const winFrameGeo = new THREE.BoxGeometry(0.7, 0.8, 0.08);
    const winGlassGeo = new THREE.BoxGeometry(0.6, 0.7, 0.1);

    const addWindow = (x, y, z, rotY = 0) => {
      const f = new THREE.Mesh(winFrameGeo, mats.siding);
      const g = new THREE.Mesh(winGlassGeo, mats.glass);
      f.position.set(x, y, z);
      f.rotation.y = rotY;
      g.position.set(x, y, z);
      g.rotation.y = rotY;
      houseGroup.add(f);
      houseGroup.add(g);
    };

    // Front Windows
    addWindow(-1.2, -0.3, 1.72);
    addWindow(-0.8, 1.05, 1.52);
    addWindow(0.6, 1.05, 1.52);
    // Side Windows
    addWindow(2.02, -0.3, 0, Math.PI / 2);
    addWindow(-2.02, -0.3, 0, Math.PI / 2);

    // Front Door
    const doorGeo = new THREE.BoxGeometry(0.6, 1.1, 0.08);
    const door = new THREE.Mesh(doorGeo, mats.wood);
    door.position.set(0.3, -0.4, 1.72);
    houseGroup.add(door);

    // 8. CUTAWAY / X-RAY INTERNAL SYSTEMS (HVAC Ducts, Breaker Panel, Plumbing)
    const ductGroup = new THREE.Group();
    houseGroup.add(ductGroup);

    // Attic HVAC Furnace & Trunk Ducts
    const hvacUnitGeo = new THREE.BoxGeometry(0.8, 0.6, 0.6);
    const hvacUnit = new THREE.Mesh(hvacUnitGeo, mats.duct);
    hvacUnit.position.set(-0.6, 2.0, -0.4);
    ductGroup.add(hvacUnit);

    const ductPipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.5, 16);
    const duct1 = new THREE.Mesh(ductPipeGeo, mats.duct);
    duct1.rotation.z = Math.PI / 2;
    duct1.position.set(0.2, 1.9, -0.4);
    ductGroup.add(duct1);

    // 200A Electrical Panel on Utility Wall
    const panelGeo = new THREE.BoxGeometry(0.1, 0.6, 0.4);
    const panel = new THREE.Mesh(panelGeo, mats.wire);
    panel.position.set(2.05, 0.7, 0.2);
    ductGroup.add(panel);

    // 9. AERIAL 4K DRONE MODEL
    const droneGroup = new THREE.Group();
    droneGroup.position.set(1.5, 3.8, 1.5);
    scene.add(droneGroup);

    const dBodyGeo = new THREE.BoxGeometry(0.3, 0.08, 0.3);
    const dBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const droneBody = new THREE.Mesh(dBodyGeo, dBodyMat);
    droneGroup.add(droneBody);

    const rotGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16);
    const rotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const r1 = new THREE.Mesh(rotGeo, rotMat);
    r1.position.set(0.2, 0.05, 0.2);
    droneGroup.add(r1);
    const r2 = new THREE.Mesh(rotGeo, rotMat);
    r2.position.set(-0.2, 0.05, 0.2);
    droneGroup.add(r2);
    const r3 = new THREE.Mesh(rotGeo, rotMat);
    r3.position.set(0.2, 0.05, -0.2);
    droneGroup.add(r3);
    const r4 = new THREE.Mesh(rotGeo, rotMat);
    r4.position.set(-0.2, 0.05, -0.2);
    droneGroup.add(r4);

    // 10. DUAL-INSPECTOR TACTICAL RADAR PATHS
    const tacticalGroup = new THREE.Group();
    scene.add(tacticalGroup);

    if (activeMode === 'tactical') {
      const ring1Geo = new THREE.RingGeometry(3.6, 3.75, 48);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = -1.35;
      tacticalGroup.add(ring1);

      const ring2Geo = new THREE.RingGeometry(2.2, 2.35, 48);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = -0.9;
      tacticalGroup.add(ring2);
    }

    // 11. INTERNACHI HOTSPOT BEACONS (8 Comprehensive Checkpoints)
    const beaconGroup = new THREE.Group();
    houseGroup.add(beaconGroup);

    const beaconMeshes = [];
    hotspots.forEach((spot) => {
      const bGeo = new THREE.SphereGeometry(0.14, 24, 24);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0xd4af37,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.5
      });
      const mesh = new THREE.Mesh(bGeo, bMat);
      mesh.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
      mesh.userData = { hotspotId: spot.id };
      beaconGroup.add(mesh);
      beaconMeshes.push(mesh);

      // Multi-layer pulse halo
      const haloGeo = new THREE.RingGeometry(0.18, 0.26, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
      halo.lookAt(camera.position);
      mesh.add(halo);
    });

    // RAYCASTING & CLICK SELECTION
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

    // MOUSE DRAG & TOUCH CONTROLS
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      houseGroup.rotation.y += dx * 0.007;
      houseGroup.rotation.x = Math.max(-0.35, Math.min(0.55, houseGroup.rotation.x + dy * 0.004));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      houseGroup.rotation.y += dx * 0.007;
      houseGroup.rotation.x = Math.max(-0.35, Math.min(0.55, houseGroup.rotation.x + dy * 0.004));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);

    // ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation
      if (isRotating && !isDragging) {
        houseGroup.rotation.y += 0.0025;
      }

      // Drone orbit & rotor spin
      droneGroup.position.x = 2.4 * Math.cos(elapsedTime * 0.8);
      droneGroup.position.z = 2.4 * Math.sin(elapsedTime * 0.8);
      droneGroup.position.y = 3.6 + Math.sin(elapsedTime * 1.5) * 0.2;
      r1.rotation.y += 0.3;
      r2.rotation.y += 0.3;
      r3.rotation.y += 0.3;
      r4.rotation.y += 0.3;

      // Pulse beacon halos
      beaconMeshes.forEach((b, idx) => {
        const s = 1 + Math.sin(elapsedTime * 4 + idx) * 0.25;
        b.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight || 560;
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
            🏛️ InterNACHI Standards of Practice: 3D Digital Twin Explorer
          </span>
          <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(2rem, 4vw, 2.85rem)', fontWeight: 800 }}>
            Ultra-Realistic 3D Master Diagnostic Home Inspection Model
          </h2>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '820px', margin: '0.5rem auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Rotate, zoom, and inspect every major structural, mechanical, and electrical system evaluated under official <strong>InterNACHI Residential Standards of Practice</strong> by our Certified Master Inspector-led dual team.
          </p>
        </div>

        {/* 4 Diagnostic Mode Toggles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveMode('visual')}
            className={activeMode === 'visual' ? 'btn btn-gold' : 'btn btn-outline-light'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px' }}
          >
            🏛️ Ultra-Realistic Architectural View
          </button>
          <button
            onClick={() => setActiveMode('xray')}
            className={activeMode === 'xray' ? 'btn btn-outline' : 'btn btn-outline-light'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px', borderColor: activeMode === 'xray' ? '#38bdf8' : undefined, color: activeMode === 'xray' ? '#38bdf8' : undefined }}
          >
            ⚡ 3D Cutaway / X-Ray Systems
          </button>
          <button
            onClick={() => setActiveMode('thermal')}
            className={activeMode === 'thermal' ? 'btn btn-primary' : 'btn btn-outline-light'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px' }}
          >
            🔥 FLIR Infrared Heat-Map
          </button>
          <button
            onClick={() => setActiveMode('tactical')}
            className={activeMode === 'tactical' ? 'btn btn-gold' : 'btn btn-outline-light'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px' }}
          >
            👥 2-Inspector Tactical Sweep Path
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="btn btn-outline-light"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', borderRadius: '50px' }}
            title="Toggle Auto Rotation"
          >
            {isRotating ? '⏸️ Pause Spin' : '▶️ Resume Spin'}
          </button>
        </div>

        {/* 3D WebGL Canvas & Deep InterNACHI HUD Modal */}
        <div style={{ position: 'relative', width: '100%', height: '580px', background: 'radial-gradient(circle at center, #1e293b 0%, #0a0f1d 100%)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.12)', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)' }}>
          
          <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

          {/* Quick HUD Navigation Cue */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', fontSize: '0.825rem', color: '#cbd5e1', pointerEvents: 'none', zIndex: 5 }}>
            🖱️ <strong>3D Controls:</strong> Drag to rotate • Tap gold beacons to open InterNACHI SOP field data
          </div>

          {/* Deep InterNACHI SOP Modal / Side Briefing */}
          {selectedHotspot ? (
            <div style={{ position: 'absolute', top: '16px', right: '16px', maxWidth: '420px', width: 'calc(100% - 32px)', maxHeight: 'calc(100% - 32px)', overflowY: 'auto', background: 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(20px)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '1.5rem', zIndex: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 800, background: 'rgba(212, 175, 55, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                  {selectedHotspot.sopCode}
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.35rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
                  aria-label="Close hotspot information"
                >
                  ✕
                </button>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {selectedHotspot.icon} {selectedHotspot.title}
              </h3>

              {/* Tab Navigation for Detailed SOP Breakdown */}
              <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setActiveTab('sop')}
                  style={{ background: activeTab === 'sop' ? 'var(--color-gold)' : 'transparent', color: activeTab === 'sop' ? '#0f172a' : '#94a3b8', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  InterNACHI SOP
                </button>
                <button
                  onClick={() => setActiveTab('beyond')}
                  style={{ background: activeTab === 'beyond' ? 'var(--color-gold)' : 'transparent', color: activeTab === 'beyond' ? '#0f172a' : '#94a3b8', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Foresight Standard
                </button>
                <button
                  onClick={() => setActiveTab('defects')}
                  style={{ background: activeTab === 'defects' ? 'var(--color-gold)' : 'transparent', color: activeTab === 'defects' ? '#0f172a' : '#94a3b8', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Defect Flags
                </button>
              </div>

              {/* Tab Content Display */}
              {activeTab === 'sop' && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.4rem' }}>
                    📋 Mandatory InterNACHI Scope:
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {selectedHotspot.sopRequirement}
                  </p>
                </div>
              )}

              {activeTab === 'beyond' && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '0.4rem' }}>
                    ⚡ Foresight Master Level Standard:
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {selectedHotspot.beyondStandard}
                  </p>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeft: '3px solid #38bdf8', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8', marginBottom: '1rem' }}>
                    🛠️ <strong>Diagnostic Tool:</strong> {selectedHotspot.tech}
                  </div>
                </div>
              )}

              {activeTab === 'defects' && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 700, marginBottom: '0.4rem' }}>
                    ⚠️ Common High-Risk Defect Findings:
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {selectedHotspot.defectThresholds}
                  </p>
                </div>
              )}

              {/* Warranty Badge */}
              <div style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.35)', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.825rem', color: '#4ade80', marginBottom: '1.25rem', fontWeight: 600, lineHeight: 1.5 }}>
                🛡️ {selectedHotspot.protection}
              </div>

              {/* Direct Booking & Quote Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.875rem', textAlign: 'center', fontWeight: 700 }}
                >
                  Book Online 24/7
                </a>
                <Link
                  href="/quote"
                  className="btn btn-outline-light"
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.875rem', textAlign: 'center' }}
                >
                  Instant Quote
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', maxWidth: '360px', fontSize: '0.875rem', color: '#e2e8f0', zIndex: 5 }}>
              <div style={{ fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🛡️ Certified Master Inspector® Protocol</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Every inspection strictly exceeds InterNACHI Residential SOP by sending two certified inspectors, free FLIR thermal scans, 4K aerial drones &amp; a $10,000 warranty.
              </p>
            </div>
          )}
        </div>

        {/* 8-Point InterNACHI Inspection SOP Grid Below 3D Model */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>
            🔍 Click Any InterNACHI Standard of Practice Inspection Layer
          </h3>
          <div className="grid grid-4" style={{ gap: '1rem' }}>
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedHotspot(spot)}
                className="card"
                style={{
                  background: selectedHotspot?.id === spot.id ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedHotspot?.id === spot.id ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{spot.icon}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  {spot.sopCode}
                </span>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.35rem', fontWeight: 700, lineHeight: 1.3 }}>
                  {spot.category}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, lineHeight: 1.45 }}>
                  {spot.tech}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
