import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a', /* Dark background like original styling */
          color: '#ffffff',
          borderRadius: '8px',
          border: '2px solid #3b82f6', /* Blue ring effect */
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            marginTop: '2px', // optical alignment
          }}
        >
          N
        </div>
      </div>
    ),
    { ...size }
  );
}
