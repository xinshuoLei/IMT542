import React from 'react';
import { ChevronDown, ChevronRight, Download, Calendar, Package, FileText, AlertCircle } from 'lucide-react';
import RatingBadge from './RatingBadge';
import CategoryMetrics from './CategoryMetrics';

export default function CategoryPanel({ title, category, rating, data, expanded, onToggle, loading = false, downloadsData = null }) {
  const categoryIcons = {
    communityAdoption: Download,
    maintenanceFrequency: Calendar,
    implementationFootprint: Package,
    documentationCompleteness: FileText,
    supportResponsiveness: AlertCircle
  };

  const Icon = categoryIcons[category] || Package;

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px', backgroundColor: 'white' }}>
      <button
        onClick={onToggle}
        style={{ 
          width: '100%', 
          minHeight: '52px', // Ensure minimum height
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          borderRadius: '8px',
          flexWrap: 'wrap', // Allow wrapping if needed
          gap: '8px' // Add gap between wrapped elements
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          minWidth: '0', // Allow text to shrink
          flex: '1' // Take available space
        }}>
          <Icon size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
          <span style={{ 
            fontWeight: '500', 
            color: '#111827',
            fontSize: '14px', // Slightly smaller on mobile
            wordBreak: 'break-word' // Prevent text overflow
          }}>{title}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          flexShrink: 0 // Don't shrink the rating and chevron
        }}>
          <RatingBadge rating={rating} loading={loading} />
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>
      
      {expanded && (
        <div style={{ 
          padding: '0 16px 12px', 
          borderTop: '1px solid #f3f4f6',
          minHeight: '60px' // Ensure minimum height for content
        }}>
          <div style={{ paddingTop: '12px' }}>
            <CategoryMetrics category={category} data={data} loading={loading} downloadsData={downloadsData} />
          </div>
        </div>
      )}
    </div>
  );
}