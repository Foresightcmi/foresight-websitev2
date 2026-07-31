import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Foresight Home Inspections Atlanta';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F172A',
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(212, 175, 55, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(212, 175, 55, 0.1) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '24px',
            padding: '60px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          <div
            style={{
              fontSize: '40px',
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginBottom: '20px',
              fontWeight: 800,
            }}
          >
            Foresight Home Inspections
          </div>
          
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '30px',
            }}
          >
            Atlanta's Premium<br />Home Inspection Team
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <div style={{ background: '#D4AF37', color: '#000000', padding: '10px 20px', borderRadius: '40px', fontSize: '24px', fontWeight: 700 }}>
              Two Inspectors
            </div>
            <div style={{ background: '#D4AF37', color: '#000000', padding: '10px 20px', borderRadius: '40px', fontSize: '24px', fontWeight: 700 }}>
              $10K Warranty
            </div>
            <div style={{ background: '#D4AF37', color: '#000000', padding: '10px 20px', borderRadius: '40px', fontSize: '24px', fontWeight: 700 }}>
              Certified Master Inspector
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
