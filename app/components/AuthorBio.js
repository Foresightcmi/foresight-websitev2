import Image from 'next/image';

export default function AuthorBio() {
  return (
    <div className="author-bio-card" style={{
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
      background: 'var(--color-gray-light)',
      padding: '2rem',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-gray-mid)',
      marginTop: '3rem',
      marginBottom: '2rem'
    }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-red)' }}>
        <Image
          src="/images/Christopher_Boykin.jpg"
          alt="Christopher Boykin, Certified Master Inspector"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--color-dark)' }}>
          Christopher Boykin, <span style={{ color: 'var(--color-red)' }}>CMI®</span>
        </h3>
        <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
          Christopher is a <strong>Certified Master Inspector® (CMI)</strong>, the highest professional designation in the North American inspection industry. With over a decade of hands-on structural and mechanical diagnostic experience in Metro Atlanta, his two-inspector team approach guarantees unmatched accuracy.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', background: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--color-gray-mid)' }}>
            ✓ InterNACHI Certified
          </span>
          <span style={{ fontSize: '0.85rem', background: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--color-gray-mid)' }}>
            ✓ Fully Licensed & Insured
          </span>
        </div>
      </div>
    </div>
  );
}
