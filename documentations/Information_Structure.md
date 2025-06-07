## Information Structure

Assessment of existing information structures, necessary transformations, and the resulting structure that meets the requirements outlined in the information story

### Table of Contents
- [Existing Information Structure](#existing-information-structure)
- [Requirements for the New Information Structure](#requirements-for-the-new-information-structure)
- [Necessary Transformations to Meet Identified Requirements](#necessary-transformations-to-meet-identified-requirements)
- [New, Transformed Information Structure Delivered by the System](#new-transformed-information-structure-delivered-by-the-system)
- [FAIR Assessment of the Transformed Information Structure](#fair-assessment-of-the-transformed-information-structure)

### Existing Information Structure

Existing health and usability information about a package is scattered across platforms. None of the platforms alone provides a complete picture — they all have their own limitations and require substantial manual effort to analyze, particularly for developers who want quick, trustworthy signals during the package selection process.

| Source           | Available Information                                                                 | Issues and Limitations                                                                 |
|------------------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **npm**          | Basic metadata: package name, version, description, license, downloads, maintainers    | Lacks signals about whether the package is actively maintained or stable              |
| **GitHub Repository**       | Codebase, issues, stars, forks, contributors, commit history                           | High signal density, but unstructured — users must manually interpret raw indicators  |
| **Libraries.io** | Dependency metadata, repository link, release history                                  | Presents raw stats without interpretation or guidance for evaluating usability        |

**Performing a FAIR assessment on the existing information structure is difficult** because it is scattered and fragmented, with each source having its own schema, terminology, and access constraints.

**The existing structure also lacks portability.** GitHub and npm’s public APIs are optimized for general package management or repository interaction. There are no endpoints specifically designed to aggregate or interpret health and usability signals. Additional restructuring and filtering are required before the information becomes meaningful or actionable.

### Requirements for the New Information Structure

As discussed in the [Information Story](../documentations/Information_Story.md), to support centralized health and usability insights that enable more confident and informed decisions regarding package adoption, the new information structure should meet the following requirements:

**Structure and Information Provided**

- **Aggregates signals across sources**: Integrates package information from both GitHub and npm  
- **Provides high-level assessments** of the five core dimensions of package health and usability, supported by raw metrics:  
  - *Community Adoption*: Is the package widely trusted and used?  
  - *Maintenance Frequency*: How often is it updated?  
  - *Release Management*: Are releases timely and responsible?  
  - *Implementation Footprint*: How much size and complexity does it add to a project?  
  - *Documentation Completeness*: Are clear instructions and documentation provided?

**Portability**

- Supports both human-readable presentation (via a Chrome extension) and machine-readable access (via a RESTful API)  
- Aligns with FAIR principles to promote reuse and integration across tools  
- Is readily accessible and responsive enough for real-time use in development workflows


### Necessary Transformations to Meet Identified Requirements

To meet the above requirements, several key transformations were applied to the existing information:

- **Signal Extraction and Mapping**  
  Raw data from GitHub and npm is parsed and mapped to the five core health dimensions. For example, the time since the last push and the ratio of open issues on GitHub are used to assess *Maintenance Frequency*.

- **Schema Reformatting**  
  Health and usability signals from different sources are merged into a unified JSON structure with a consistent schema — resolving discrepancies in naming conventions, timestamps, and metric formats across sources.

- **Score Computation**  
  High-level assessments are computed for each health and usability dimension using qualitative labels (e.g., “weak,” “moderate,” “strong” for *Community Adoption*) to support quick decision-making. The original raw data used for score computation is included for transparency and deeper analysis.

- **Metadata Augmentation**  
  Provenance details — such as data source and fetch timestamp — are added to each package entry, enabling traceability and supporting reusability across tools and contexts.


### New, Transformed Information Structure Delivered by the System

With the transformations outlined above, the system generates the following portable information structure for each package and presents it to users.

```json
{
    "package_name": "echarts",
    "retrieved_at": "2025-06-06T22:19:09.013301Z",
    "npm_data": {
        "name": "echarts",
        "latest_version": "5.6.0",
        "description": "Apache ECharts is a powerful, interactive charting and data visualization library for browser",
        "license": "Apache-2.0",
        "homepage": "https://echarts.apache.org",
        "bundle_size": "53.2 MB",
        "dependencies_count": 2,
        "repository": "https://github.com/apache/echarts",
        "npm_url": "https://www.npmjs.com/package/echarts",
        "last_release": "2024-12-28T07:21:42.839Z",
        "days_since_last_release": 160,
        "releases_last_year": 4,
        "maintainers_count": 9
    },
    "downloads_data": {
        "monthly_downloads": 4415601,
        "weekly_trend": [
            {
                "start": "2025-01-18",
                "end": "2025-01-24",
                "downloads": 980968
            },
            {
                "start": "2025-01-25",
                "end": "2025-01-31",
                "downloads": 928131
            },
            {
                "start": "2025-02-01",
                "end": "2025-02-07",
                "downloads": 1023901
            },
            {
                "start": "2025-02-08",
                "end": "2025-02-14",
                "downloads": 1107174
            },
            {
                "start": "2025-02-15",
                "end": "2025-02-21",
                "downloads": 1095745
            },
            {
                "start": "2025-02-22",
                "end": "2025-02-28",
                "downloads": 1130426
            },
            {
                "start": "2025-03-01",
                "end": "2025-03-07",
                "downloads": 1175543
            },
            {
                "start": "2025-03-08",
                "end": "2025-03-14",
                "downloads": 1169497
            },
            {
                "start": "2025-03-15",
                "end": "2025-03-21",
                "downloads": 1122982
            },
            {
                "start": "2025-03-22",
                "end": "2025-03-28",
                "downloads": 1106533
            },
            {
                "start": "2025-03-29",
                "end": "2025-04-04",
                "downloads": 1085829
            },
            {
                "start": "2025-04-05",
                "end": "2025-04-11",
                "downloads": 1128517
            },
            {
                "start": "2025-04-12",
                "end": "2025-04-18",
                "downloads": 1077244
            },
            {
                "start": "2025-04-19",
                "end": "2025-04-25",
                "downloads": 1093446
            },
            {
                "start": "2025-04-26",
                "end": "2025-05-02",
                "downloads": 1025437
            },
            {
                "start": "2025-05-03",
                "end": "2025-05-09",
                "downloads": 1067706
            },
            {
                "start": "2025-05-10",
                "end": "2025-05-16",
                "downloads": 1138797
            },
            {
                "start": "2025-05-17",
                "end": "2025-05-23",
                "downloads": 1169183
            },
            {
                "start": "2025-05-24",
                "end": "2025-05-30",
                "downloads": 1084381
            },
            {
                "start": "2025-05-31",
                "end": "2025-06-06",
                "downloads": 1023240
            }
        ]
    },
    "github_data": {
        "repo": {
            "stars": 63694,
            "forks": 19739,
            "last_code_push": "2025-06-05T12:32:10Z",
            "is_archived": false,
            "is_maintained": true
        },
        "health": {
            "health_percentage": 87,
            "has_readme": true,
            "has_license": true,
            "has_contributing": true,
            "has_code_of_conduct": true
        },
        "activity": {
            "open_issues_count": 1932,
            "closed_issues_count": 17028,
            "total_issues_count": 18960,
            "last_pr_merged_at": "2025-06-03T12:10:00Z",
            "last_pr_info": "5 hours before merge",
            "last_pr_url": "https://github.com/apache/echarts/pull/21011"
        }
    },
    "health_ratings": {
        "community_adoption": "Strong",
        "maintenance_frequency": "Regular",
        "release_management": "Infrequent",
        "implementation_footprint": "Lightweight",
        "documentation_completeness": "Thorough"
    },
    "success": true,
    "errors": []
}
```

This transformed structure meets the requirements outlined earlier:

- **Data Integration**: Information is aggregated from both GitHub (`github_data`) and npm (`npm_data`).
- **High-Level Assessments**: The `health_ratings` field provides high-level scores (e.g., *Strong*, *Regular*, *Lightweight*) for each core dimension of package health and usability.
- **Raw Metrics**: Raw metrics used for each score computation — such as open/closed issue counts, download volumes, bundle size, and release history — are included.
- **Provenance and Metadata**: The `retrieved_at` field records when the data was fetched. The status of data retrieval is documented in the `success` and `errors` fields. Source URLs (e.g., `npm_url` and `last_pr_url`) ensure traceability.


### FAIR Assessment of the Transformed Information Structure

<table>
  <tr>
    <td><strong>Findable</strong></td>
    <td>Each package is uniquely identified by its name and version (enforced by the npm registry) </td>
  </tr>
  <tr>
    <td><strong>Accessible</strong></td>
    <td>The structure is retrievable via a documented RESTful API using standard HTTP protocols. The API is open and does not require authentication for access.</td>
  </tr>
  <tr>
    <td><strong>Interoperable</strong></td>
    <td>Uses vocabularies that align with source APIs (e.g., <code>stars</code>, <code>forks</code>) and are commonly known in the developer community.</td>
  </tr>
  <tr>
    <td><strong>Reusable</strong></td>
    <td>Metadata includes provenance fields such as <code>retrieved_at</code>, <code>success</code>, <code>errors</code>, and source URLs (e.g., <code>npm_url</code>, <code>last_pr_url</code>). These attributes support traceability and downstream reuse.</td>
  </tr>
</table>