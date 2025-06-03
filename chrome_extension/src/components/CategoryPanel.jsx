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
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          borderRadius: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontWeight: '500', color: '#111827' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RatingBadge rating={rating} loading={loading} />
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>
      
      {expanded && (
        <div style={{ padding: '0 16px 12px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ paddingTop: '12px' }}>
            <CategoryMetrics category={category} data={data} loading={loading} downloadsData={downloadsData} />
          </div>
        </div>
      )}
    </div>
  );
}