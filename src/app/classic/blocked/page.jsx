'use client';
const BlockedPage = () => {
  return (
    <>
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f7f7f7',
          minHeight: '100vh',
        }}
      >
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h1
            style={{ color: '#ff4444', fontSize: '2em', marginBottom: '10px' }}
          >
            Sorry, this website is not available in your place.
          </h1>
        </div>
      </div>
    </>
  );
};

export default BlockedPage;
