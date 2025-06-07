## Information Story

### Table of Contents

  - [Background, Motivation, and Problem Statement](#background-motivation-and-problem-statement)
  - [Requirements of the Information Structure](#requirements-of-the-information-structure)

### Background, Motivation, and Problem Statement

In web development, engineers often rely on external packages to avoid building everything from scratch — or essentially, reinventing the wheel. However, **not all packages are reliable or well-maintained**. This is a critical risk that often goes unnoticed until it’s too late. If developers aren’t careful when choosing packages, they may end up building their projects on top of:

- **Abandoned packages** that no one maintains anymore  
- **Outdated packages** with unresolved security issues  
- **Unstable packages** that break when updates are released  

**The consequences can be serious. Projects can suddenly break — even when developers haven’t changed a single line of their own code.**

One example is the infamous *left-pad* incident. In 2016, individual developer *Azer Koçulu* got into a dispute with the company *Kik Interactive* over the ownership of a package called *kik*. npm, which is the main registry for JavaScript packages, sided with the company and gave them the ownership. Koçulu felt he had been treated unfairly, so he unpublished some of the packages he built — including one called *left-pad*. *left-pad* only had 11 lines of code and simply added padding to the left side of a string, but it was used by many popular packages at the time. It had over 15 million downloads before its removal. When the package was unpublished, it caused widespread failure across the JavaScript ecosystem.

Another case is the *trim* package. Despite having over 3.5 million weekly downloads, it had not seen any commits in more than eight years. When a security vulnerability (CVE-2020-7753) was discovered, the maintainers were unresponsive. A community-submitted pull request to fix the issue remained open with no response.

These unreliable packages have led to growing **trust issues** in the developer community. The consensus is that the health and usability of a package need to be evaluated carefully before adoption.

> *"I start by checking open issues, how recently the project was updated, and how many contributors it has."* <br>
> — u/LemonAncient1950, Reddit

However, evaluating a package’s health and usability is not an easy process. It often requires time-consuming manual inspection across multiple platforms — sifting through information such as npm download data, GitHub issues, commit history, and contributor stats.

The goal of this project is to offer **centralized health and usability insights** through a new information structure that aggregates key signals from multiple sources. **With the new information structure, developers can quickly assess whether a package is stable, actively maintained, and trustworthy — allowing them to make faster, better decisions with less guesswork.**


### Requirements of the Information Structure

To meet the goal of providing centralized health and usability insights that support more confident, informed decision-making when selecting packages, the new information structure should meet the following requirements:

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
- Is readily accessible and responsive enough for real-time use in development workflowss

---

As of now, the following features are considered **out of scope**:

- Evaluating packages outside the npm ecosystem  
- Debugging or runtime monitoring tools  
- [Potential future addition]  Performing security scans or analyzing full dependency trees  
- [Potential future addition] Aggregating community sentiment from forums or discussion platforms