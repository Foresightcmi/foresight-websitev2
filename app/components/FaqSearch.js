import FaqFilterInput from './FaqFilterInput';

export default function FaqSearch({ faqs }) {
  return (
    <div className="faq-search-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <FaqFilterInput />

      {faqs.map((faq, i) => (
        <details
          key={i}
          className="faq-item"
          style={{
            border: '1px solid var(--color-gray-mid)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            padding: '1.25rem 1.5rem',
            background: 'white',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-dark)' }}>
            {faq.q}
          </summary>
          <div
            className="speakable-answer"
            style={{ marginTop: '0.85rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', fontSize: '1rem' }}
            dangerouslySetInnerHTML={{ __html: faq.a }}
          />
        </details>
      ))}

      <div
        className="faq-empty-state"
        style={{
          display: 'none',
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-gray-mid)',
        }}
      >
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', marginBottom: '1rem' }}>
          No matching questions found.
        </p>
        <a href="tel:6784802110" className="btn btn-primary">
          Call Us Directly: (678) 480-2110 &rarr;
        </a>
      </div>
    </div>
  );
}
