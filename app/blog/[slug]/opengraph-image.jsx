import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // Use nodejs runtime to read local fs
export const alt = 'Foresight Home Inspections Atlanta - Blog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function loadPosts() {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    return [];
  }
}

export default async function Image({ params }) {
  const resolvedParams = await params;
  const posts = loadPosts();
  const post = posts.find(p => p.slug === resolvedParams.slug);

  const title = post ? post.title : 'Foresight Home Inspections Blog';
  const category = post ? post.category : 'Home Inspection Guide';
  
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
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(220, 38, 38, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(220, 38, 38, 0.15) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '24px',
            padding: '60px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            width: '1000px',
            height: '450px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              color: '#DC2626',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginBottom: '30px',
              fontWeight: 800,
            }}
          >
            {category}
          </div>
          
          <div
            style={{
              fontSize: '60px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '40px',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ background: '#D4AF37', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                 🏗️
               </div>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>Christopher Boykin, CMI</span>
                 <span style={{ color: '#94A3B8', fontSize: '18px' }}>Certified Master Inspector</span>
               </div>
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
