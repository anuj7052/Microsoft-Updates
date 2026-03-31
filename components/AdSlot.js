export default function AdSlot({ id, size }) {
  const dimensions = {
    leaderboard: { width: '728px', height: '90px' },
    rectangle: { width: '336px', height: '280px' },
    halfpage: { width: '300px', height: '600px' },
  }

  return (
    <div
      id={id}
      style={{
        minHeight: dimensions[size]?.height || '90px',
        background: 'rgba(0,120,212,0.04)',
        border: '1px dashed rgba(0,120,212,0.2)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#4A6580',
        margin: '24px auto',
        width: '100%',
        maxWidth: dimensions[size]?.width || '100%',
      }}
    >
      {/* REPLACE THIS WITH ADSENSE CODE AFTER APPROVAL */}
      {/*
        <script async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2413226939900202"
          crossOrigin="anonymous">
        </script>
        <ins className="adsbygoogle" ...></ins>
      */}
      Advertisement — AdSense ({size})
    </div>
  )
}
