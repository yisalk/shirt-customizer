import React, { useEffect, useRef, useState } from 'react';
import * as fabricNs from 'fabric';
// Ensure compatibility across fabric builds (named export, default export, or namespace)
const fabric = (fabricNs && (fabricNs.fabric || fabricNs.default)) || fabricNs;

// Minimal single-page Shirt Customizer using Fabric.js
// Features:
// - Base shirt color picker
// - Collar style switch (classic/spread)
// - Button color picker
// - Toggle pocket visibility
// - Toggle long/short sleeves
// - Reset and Export PNG

const CONTROL_STYLE = {
  wrapper: { maxWidth: 1200, margin: '0 auto', padding: '16px' },
  panel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: '12px',
    marginBottom: '12px',
  },
  group: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 },
  label: { display: 'block', fontSize: 12, color: '#374151', marginBottom: 6 },
  select: { width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' },
  color: { width: '100%', height: 36, padding: 4 },
  buttonPrimary: {
    padding: '10px 14px',
    background: '#0284c7',
    color: '#fff',
    border: '1px solid #0369a1',
    borderRadius: 8,
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 14px',
    background: '#f3f4f6',
    color: '#111827',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    cursor: 'pointer',
  },
};

function ShirtCustomizer() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // Layout constants to keep all layers aligned identically
  const CANVAS_W = 900;
  const CANVAS_H = 700;
  const SHIRT_TARGET_W = 620; // scaled width for the whole shirt (all layers)
  const SHIRT_TOP = 40;       // top offset

  // Optional fine-tune per layer if your PNGs are not pixel-aligned.
  // Positive dx moves right, positive dy moves down.
  const OFFSETS = {
    base: { dx: 0, dy: 0 },
    sleeves: { dx: 0, dy: 0 },
    cuff: { dx: 0, dy: 0 },
    pocket: { dx: 0, dy: 0 },
    buttons: { dx: 0, dy: 0 },
    collar: { dx: 0, dy: 0 },
  };

  // Helper to reference files served from public/ (always available under /)
  const publicUrl = (relPath) => `/customizer/${relPath}`;

  // Fabric loaders available across effects
  const loadSvg = (url) =>
    new Promise((resolve) => {
      fabric.loadSVGFromURL(url, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.set({ selectable: false, evented: false });
        resolve(obj);
      });
    });

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => {
        const img = new fabric.Image(el, { selectable: false, evented: false });
        resolve(img);
      };
      el.onerror = () => reject(new Error('Image load failed: ' + url));
      el.src = url;
    });

  // Image-based selections
  const [baseVariant, setBaseVariant] = useState('plain');
  const [buttonsVariant, setButtonsVariant] = useState('dark'); // legacy dropdown
  // Gallery-selected buttons PNG (overrides dropdown). Default to button.png if present
  const [buttonsSrc, setButtonsSrc] = useState(null);
  const [collarStyle, setCollarStyle] = useState('classic'); // legacy dropdown
  const [hasPocket, setHasPocket] = useState(true);
  const [sleeves, setSleeves] = useState('long'); // long | short
  // Gallery-selected collar PNG (overrides dropdown). Default to collar.png if present
  const [collarSrc, setCollarSrc] = useState(null);

  // Fabric object references
  const baseRef = useRef(null);
  const sleevesRef = useRef(null);
  const cuffRef = useRef(null);
  const pocketRef = useRef(null);
  const buttonsRef = useRef(null);
  const collarRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#f9fafb',
    });
    fabricRef.current = canvas;

    // Load from Vite public/ folder to avoid bundler URL issues

    (async () => {
      // Attempt to load user's PNG pack from public/customizer/**
      // Fallback to simple SVG placeholders if a specific asset is missing
      const safeLoadImage = async (rel, fallbackSvgUrl) => {
        try {
          return await loadImage(publicUrl(rel));
        } catch (_) {
          if (fallbackSvgUrl) return await loadSvg(fallbackSvgUrl);
          return null;
        }
      };

      const base = await safeLoadImage('base/base.png', new URL('./assets/customizer/base/plain.svg', import.meta.url).toString());
      const sleevesImg = await safeLoadImage('sleeves/sleeves.png', new URL('./assets/customizer/sleeves/long.svg', import.meta.url).toString());
      const cuffImg = await safeLoadImage('cuff/cuff.png', null);
      const pocketImg = await safeLoadImage('pocket/pocket.png', new URL('./assets/customizer/pocket/pocket.svg', import.meta.url).toString());
      const buttonsImg = await safeLoadImage('buttons/button.png', new URL('./assets/customizer/buttons/dark.svg', import.meta.url).toString());
      const collarImg = await safeLoadImage('collar/collar.png', new URL('./assets/customizer/collar/classic.svg', import.meta.url).toString());

      baseRef.current = base;
      sleevesRef.current = sleevesImg;
      cuffRef.current = cuffImg || null;
      pocketRef.current = pocketImg;
      buttonsRef.current = buttonsImg;
      collarRef.current = collarImg;

      // Scale and position ALL layers exactly the same so they overlay perfectly
      const leftAligned = (canvas.getWidth() - SHIRT_TARGET_W) / 2;
      const fitAligned = (obj, key) => {
        obj.scaleToWidth(SHIRT_TARGET_W);
        const { dx = 0, dy = 0 } = OFFSETS[key] || {};
        obj.set({ left: leftAligned + dx, top: SHIRT_TOP + dy });
      };
      if (sleevesImg) fitAligned(sleevesImg, 'sleeves');
      if (base) fitAligned(base, 'base');
      if (cuffImg) fitAligned(cuffImg, 'cuff');
      if (pocketImg) fitAligned(pocketImg, 'pocket');
      if (buttonsImg) fitAligned(buttonsImg, 'buttons');
      if (collarImg) fitAligned(collarImg, 'collar');

      // Z order: sleeves (bottom), base, cuff, pocket, buttons, collar (top)
      const toAdd = [sleevesImg, base, cuffImg, pocketImg, buttonsImg, collarImg].filter(Boolean);
      canvas.add(...toAdd);
      canvas.renderAll();
    })();

    return () => canvas.dispose();
  }, []);

  const swapLayer = async (ref, url, fallbackUrl) => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    if (ref.current) canvas.remove(ref.current);
    const loader = url.endsWith('.svg') ? loadSvg : loadImage;
    let obj;
    try {
      obj = await loader(url);
    } catch (e) {
      if (fallbackUrl) {
        try {
          const fbLoader = fallbackUrl.endsWith('.svg') ? loadSvg : loadImage;
          obj = await fbLoader(fallbackUrl);
        } catch (_) {
          console.warn('Failed to load both primary and fallback assets for', url);
          return; // give up silently
        }
      } else {
        console.warn('Failed to load asset', url);
        return;
      }
    }
    // Keep swapped layer aligned with the rest
    const leftAligned = (canvas.getWidth() - SHIRT_TARGET_W) / 2;
    obj.scaleToWidth(SHIRT_TARGET_W);
    // choose offset by ref key
    let key = 'base';
    if (ref === sleevesRef) key = 'sleeves';
    else if (ref === cuffRef) key = 'cuff';
    else if (ref === pocketRef) key = 'pocket';
    else if (ref === buttonsRef) key = 'buttons';
    else if (ref === collarRef) key = 'collar';
    const { dx = 0, dy = 0 } = OFFSETS[key] || {};
    obj.set({ left: leftAligned + dx, top: SHIRT_TOP + dy, selectable: false, evented: false });
    ref.current = obj;
    // maintain z-order
    const order = [sleevesRef.current, baseRef.current, cuffRef.current, pocketRef.current, buttonsRef.current, collarRef.current];
    order.forEach((o) => o && canvas.remove(o));
    order.forEach((o) => o && canvas.add(o));
    canvas.requestRenderAll();
  };

  // Toggle pocket
  useEffect(() => {
    if (!fabricRef.current || !pocketRef.current) return;
    pocketRef.current.set({ visible: hasPocket });
    fabricRef.current.requestRenderAll();
  }, [hasPocket]);

  // Sleeves change → for now always use your PNG sleeves layer
  useEffect(() => {
    const fb = new URL('./assets/customizer/sleeves/long.svg', import.meta.url).toString();
    swapLayer(sleevesRef, publicUrl('sleeves/sleeves.png'), fb);
  }, [sleeves]);

  // Collar selection → use PNG collar layer or gallery-selected one
  useEffect(() => {
    const fb = new URL('./assets/customizer/collar/classic.svg', import.meta.url).toString();
    const src = collarSrc || publicUrl('collar/collar.png');
    swapLayer(collarRef, src, fb);
  }, [collarStyle, collarSrc]);

  // Base variant
  useEffect(() => {
    // always PNG for base when provided; fallback to placeholder SVG in src
    const fallback = new URL('./assets/customizer/base/plain.svg', import.meta.url).toString();
    swapLayer(baseRef, publicUrl(`base/base.png`), fallback);
  }, [baseVariant]);
  // Buttons variant → use PNG buttons layer or gallery-selected one
  useEffect(() => {
    const fb = new URL('./assets/customizer/buttons/dark.svg', import.meta.url).toString();
    const src = buttonsSrc || publicUrl('buttons/button.png');
    swapLayer(buttonsRef, src, fb);
  }, [buttonsVariant, buttonsSrc]);

  const handleReset = () => {
    setBaseVariant('plain');
    setButtonsVariant('dark');
    setCollarStyle('classic');
    setHasPocket(true);
    setSleeves('long');
  };

  const handleExport = () => {
    if (!fabricRef.current) return;
    const data = fabricRef.current.toDataURL({ format: 'png', quality: 1 });
    const link = document.createElement('a');
    link.href = data;
    link.download = 'custom-shirt.png';
    link.click();
  };

  return (
    <div style={CONTROL_STYLE.wrapper}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Shirt Customizer</h1>
      {/* <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Pick colors and options. Export your design as PNG.
      </p> */}

      <div style={CONTROL_STYLE.panel}>
        {/* <div style={CONTROL_STYLE.group}>
          <label style={CONTROL_STYLE.label}>Base</label>
          <select value={baseVariant} onChange={(e) => setBaseVariant(e.target.value)} style={CONTROL_STYLE.select}>
            <option value="plain">Plain</option>
          </select>
        </div>

        <div style={CONTROL_STYLE.group}>
          <label style={CONTROL_STYLE.label}>Buttons</label>
          <select value={buttonsVariant} onChange={(e) => setButtonsVariant(e.target.value)} style={CONTROL_STYLE.select}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div style={CONTROL_STYLE.group}>
          <label style={CONTROL_STYLE.label}>Collar Style</label>
          <select value={collarStyle} onChange={(e) => setCollarStyle(e.target.value)} style={CONTROL_STYLE.select}>
            <option value="classic">Classic</option>
            <option value="spread">Spread</option>
          </select>
        </div>

        <div style={CONTROL_STYLE.group}>
          <label style={CONTROL_STYLE.label}>Pocket</label>
          <select value={hasPocket ? 'yes' : 'no'} onChange={(e) => setHasPocket(e.target.value === 'yes')} style={CONTROL_STYLE.select}>
            <option value="yes">Visible</option>
            <option value="no">Hidden</option>
          </select>
        </div>

        <div style={CONTROL_STYLE.group}>
          <label style={CONTROL_STYLE.label}>Sleeves</label>
          <select value={sleeves} onChange={(e) => setSleeves(e.target.value)} style={CONTROL_STYLE.select}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div> */}

        {/* <div style={{ ...CONTROL_STYLE.group, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={handleReset} style={CONTROL_STYLE.buttonSecondary}>Reset</button>
        </div> */}
          <button onClick={handleExport} style={CONTROL_STYLE.buttonPrimary}>Export PNG</button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, flex: 1 }}>
          <canvas ref={canvasRef} />
        </div>

        {/* Right sidebar: Buttons + Collar galleries */}
        <aside style={{ width: 200 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Buttons</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['button.png','button-black.png','button-brown.png','button-gray.png'].map((name) => {
                const src = publicUrl(`buttons/${name}`);
                const selected = (buttonsSrc || publicUrl('buttons/button.png')) === src;
                return (
                  <button
                    key={name}
                    onClick={() => setButtonsSrc(src)}
                    style={{
                      padding: 4,
                      borderRadius: 8,
                      border: selected ? '2px solid #0284c7' : '1px solid #e5e7eb',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                    title={name}
                  >
                    <img src={src} alt={name} style={{ width: '100%', display: 'block' }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Collar</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['collar.png','collar-straight.png','collar-widespread.png','collar-band.png'].map((name) => {
                const src = publicUrl(`collar/${name}`);
                const selected = (collarSrc || publicUrl('collar/collar.png')) === src;
                return (
                  <button
                    key={name}
                    onClick={() => setCollarSrc(src)}
                    style={{
                      padding: 4,
                      borderRadius: 8,
                      border: selected ? '2px solid #0284c7' : '1px solid #e5e7eb',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                    title={name}
                  >
                    <img src={src} alt={name} style={{ width: '100%', display: 'block' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return <ShirtCustomizer />;
}
