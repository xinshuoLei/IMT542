import React from 'react';

export default function RatingBadge({ rating, loading = false }) {
  if (loading) {
    return (
      <div style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: '#f3f4f6', color: '#6b7280' }}>
        Loading...
      </div>
    );
  }

  const colors = {
    // GOOD ratings - Green
    Strong: { backgroundColor: '#dcfce7', color: '#166534' },
    Regular: { backgroundColor: '#dcfce7', color: '#166534' },
    Thorough: { backgroundColor: '#dcfce7', color: '#166534' },
    Responsive: { backgroundColor: '#dcfce7', color: '#166534' },
    Lightweight: { backgroundColor: '#dcfce7', color: '#166534' },
    
    // MODERATE ratings - Yellow
    Moderate: { backgroundColor: '#fef3c7', color: '#92400e' },
    Occasional: { backgroundColor: '#fef3c7', color: '#92400e' },
    Adequate: { backgroundColor: '#fef3c7', color: '#92400e' },
    
    // POOR ratings - Red
    Limited: { backgroundColor: '#fecaca', color: '#991b1b' },
    Infrequent: { backgroundColor: '#fecaca', color: '#991b1b' },
    Sparse: { backgroundColor: '#fecaca', color: '#991b1b' },
    Backlogged: { backgroundColor: '#fecaca', color: '#991b1b' },
    Heavy: { backgroundColor: '#fecaca', color: '#991b1b' },
    
    // NEUTRAL states - Gray
    Loading: { backgroundColor: '#f3f4f6', color: '#6b7280' },
    Unavailable: { backgroundColor: '#f3f4f6', color: '#6b7280' },
    Error: { backgroundColor: '#fef3c7', color: '#92400e' }
  };

  const style = colors[rating] || { backgroundColor: '#f3f4f6', color: '#374151' };

  return (
    <div style={{ 
      padding: '4px 8px', 
      borderRadius: '4px', 
      fontSize: '12px', 
      fontWeight: '500',
      ...style 
    }}>
      {rating}
    </div>
  );
}