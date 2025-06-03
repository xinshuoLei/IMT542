import React, { useState, useRef } from 'react';

export default function DownloadTrendChart({ weeklyTrend }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const chartRef = useRef(null);

  if (!weeklyTrend || weeklyTrend.length === 0) {
    return (
      <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        No trend data available
      </div>
    );
  }

  const chartData = weeklyTrend;
  const maxDownloads = Math.max(...chartData.map(week => week.downloads));
  const minDownloads = Math.min(...chartData.map(week => week.downloads));
  const range = maxDownloads - minDownloads || 1;

  const chartWidth = 380;
  const chartHeight = 120;
  const padding = 20;

  const points = chartData.map((week, index) => {
    const x = padding + (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((week.downloads - minDownloads) / range) * (chartHeight - 2 * padding);
    return { x, y, downloads: week.downloads, start: week.start, end: week.end, index };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // Returns yyyy-mm-dd format
  };

  const formatDateRange = (start, end) => {
    return `${formatDate(start)} to ${formatDate(end)}`;
  };

  const handleMouseMove = (e) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Find the closest point based on X position only
    let closestPoint = null;
    let minXDistance = Infinity;
    
    points.forEach(point => {
      const xDistance = Math.abs(mouseX - point.x);
      if (xDistance < minXDistance) {
        minXDistance = xDistance;
        closestPoint = point;
      }
    });
    
    // Only select if mouse is within reasonable X range of the chart
    if (minXDistance < chartWidth / points.length) {
      setSelectedPoint(closestPoint);
    }
  };

  // Show latest week by default if no selection
  const displayPoint = selectedPoint || points[points.length - 1];

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
        Weekly Download Trend (Last {chartData.length} Weeks)
      </div>
      
      {/* Selected week info - Moved before graph */}
      <div style={{ 
        marginBottom: '12px', 
        padding: '8px 12px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          {formatDateRange(displayPoint.start, displayPoint.end)}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
          {displayPoint.downloads.toLocaleString()}
        </div>
      </div>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <svg 
          ref={chartRef}
          width={chartWidth} 
          height={chartHeight} 
          style={{ border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fafafa', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setSelectedPoint(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * (chartHeight - 2 * padding)}
              x2={chartWidth - padding}
              y2={padding + ratio * (chartHeight - 2 * padding)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={`${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`}
            fill="#6366f1"
            opacity="0.1"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point) => (
            <circle
              key={point.index}
              cx={point.x}
              cy={point.y}
              r={displayPoint?.index === point.index ? "4" : "3"}
              fill="#6366f1"
              stroke="white"
              strokeWidth="2"
            />
          ))}
          
          {/* Hover line */}
          {selectedPoint && (
            <line
              x1={selectedPoint.x}
              y1={padding}
              x2={selectedPoint.x}
              y2={chartHeight - padding}
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.7"
            />
          )}
        </svg>
      </div>
      
      {/* Y-axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginTop: '4px', paddingLeft: '20px', paddingRight: '20px' }}>
        <span>{formatNumber(minDownloads)}</span>
        <span>{formatNumber(maxDownloads)}</span>
      </div>
    </div>
  );
}