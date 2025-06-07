## Package Health and Usability Rating Calculations

This document defines the algorithms and thresholds used to calculate health ratings for JavaScript packages across five key dimensions. These calculations are implemented in both the frontend (`ratingCalculators.js`) and backend (`health_service.py`) components.

### Table of Contents

- [Overview](#overview)
- [Rating Scale](#rating-scale)
- [Rating Calculations](#rating-calculations)
- [Community Adoption](#community-adoption)
- [Maintenance Frequency](#maintenance-frequency)
- [Release Management](#release-management)
- [Implementation Footprint](#implementation-footprint)
- [Documentation Completeness](#documentation-completeness)
- [Error Handling](#error-handling)

### Overview

Each package is evaluated across five dimensions, with ratings that help developers quickly assess package quality:

- **Community Adoption**: How widely used and supported the package is
- **Maintenance Frequency**: How actively the package is being maintained
- **Release Management**: How regularly new versions are released
- **Implementation Footprint**: The technical impact of adding the package
- **Documentation Completeness**: How well the package is documented

### Rating Scale

All dimensions use a three-tier rating system:
- 🟢 **Good** (Green): Strong/Regular/Thorough/Responsive/Lightweight
- 🟡 **Moderate** (Yellow): Moderate/Occasional/Adequate
- 🔴 **Poor** (Red): Limited/Infrequent/Sparse/Backlogged/Heavy
- ⚪ **Special States**: Loading/Unavailable/Error

### Rating Calculations

#### Community Adoption

**Purpose**: Measures how widely the package is used and supported by the developer community.

**Data Sources**:
- Monthly npm downloads
- GitHub stars
- GitHub forks

**Thresholds**:
- **Strong**: `monthly_downloads >= 1000000 OR github_stars >= 10000`
- **Moderate**: `monthly_downloads >= 100000 OR github_stars >= 1000`
- **Limited**: `below moderate thresholds`

#### Maintenance Frequency

**Purpose**: Indicates how actively the package is being maintained through code activity.

**Data Sources**:
- GitHub "is_maintained" status (based on recent pushes)
- Last code push date
- Last PR merged date

**Thresholds**:
- **Regular**: `github_maintained = true AND (days_since_code_push <= 30 OR days_since_pr_merge <= 14)`
- **Occasional**: `days_since_code_push <= 90 OR days_since_pr_merge <= 30`
- **Infrequent**: `above thresholds OR is_archived = true`

#### Release Management

**Purpose**: Measures how regularly new versions are released and published.

**Data Sources**:
- Days since last npm release
- Number of npm releases in past year
- GitHub repository archived status

**Thresholds**:
- **Regular**: `days_since_last_release <= 30 AND releases_last_year >= 12`
- **Occasional**: `days_since_last_release <= 90 AND releases_last_year >= 4`
- **Infrequent**: `above thresholds OR is_archived = true`

#### Implementation Footprint

**Purpose**: Assesses the technical impact of adding the package to a project.

**Data Sources**:
- Bundle size 
- Dependencies count 

**Thresholds**:
- **Lightweight**: `bundle_size_kb < 100 AND dependencies_count < 5`
- **Moderate**: `bundle_size_kb < 500 AND dependencies_count < 15`
- **Heavy**: `above moderate thresholds`

#### Documentation Completeness

**Purpose**: Evaluates how well the package is documented and follows community standards.

**Data Sources**:
- GitHub community health percentage
- Presence of `README` file
- Presence of `LICENSE` file
- Presence of `CONTRIBUTING` guidelines
- Presence of `CODE_OF_CONDUCT` file

**Thresholds**:
- **Thorough**: `health_percentage >= 80 AND has_readme = true AND has_license = true AND (has_contributing = true OR has_code_of_conduct = true)`
- **Adequate**: `health_percentage >= 50 AND has_readme = true AND has_license = true`
- **Sparse**: `below adequate thresholds`

### Error Handling

All rating functions include robust error handling:

**Loading States**: When data is still being fetched
```javascript
if (loading) return 'Loading';
```

**Error States**: When API calls fail
```javascript
if (error) return 'Error';
```

**Unavailable States**: When required data sources are missing
```javascript
if (!requiredData) return 'Unavailable';
```

**Code Representation**:
- **Loading**: `data_loading = true`
- **Error**: `api_error = true`
- **Unavailable**: `required_data = null OR required_data = undefined`