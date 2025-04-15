export const buzzwords = {
  "Communication & Influence": [
    "Synergy",
    "Leverage",
    "Thought Leadership",
    "Value Proposition",
    "Stakeholder Engagement",
    "Paradigm Shift",
    "Mindshare",
    "Alignment",
    "Messaging",
    "Touchpoints",
    "Engagement",
    "Storytelling",
    "Influencer",
    "Amplify",
    "Visibility",
    "Transparency",
    "Dialogue",
    "Outreach",
    "Narrative",
    "Compelling",
    "Resonate",
    "Articulate",
    "Persuasive",
    "Consensus",
    "Collaborative",
    "Networking",
    "Relationship Building",
    "Evangelism",
    "Advocacy",
    "Feedback Loop",
  ],
  "Technology & Innovation": [
    "Disruptive",
    "Blockchain",
    "AI-Powered",
    "Machine Learning",
    "Digital Transformation",
    "Cloud-Native",
    "Scalable",
    "Agile",
    "DevOps",
    "Big Data",
    "IoT",
    "Automation",
    "Ecosystem",
    "Integration",
    "API-First",
    "Microservices",
    "Serverless",
    "Edge Computing",
    "Quantum",
    "Augmented Reality",
    "Virtual Reality",
    "Immersive",
    "Responsive",
    "User Experience",
    "Intuitive",
    "Frictionless",
    "Seamless",
    "Cutting-Edge",
    "Next-Gen",
    "Innovative",
  ],
  "People & Culture": [
    "Talent Acquisition",
    "Upskilling",
    "Diversity & Inclusion",
    "Employee Experience",
    "Work-Life Balance",
    "Remote-First",
    "Hybrid Model",
    "Cultural Transformation",
    "Psychological Safety",
    "Empowerment",
    "Autonomy",
    "Ownership",
    "Accountability",
    "Recognition",
    "Mentorship",
    "Growth Mindset",
    "Continuous Learning",
    "Feedback Culture",
    "Wellness",
    "Engagement",
    "Retention",
    "Team Building",
    "Collaboration",
    "Cross-Functional",
    "Agile Teams",
    "Self-Organizing",
    "Servant Leadership",
    "Coaching",
    "Emotional Intelligence",
    "Resilience",
  ],
  "Financial & Performance": [
    "ROI",
    "KPI",
    "Monetization",
    "Revenue Stream",
    "Cost Optimization",
    "Profitability",
    "Margin",
    "Scalability",
    "Sustainable Growth",
    "Market Share",
    "Competitive Advantage",
    "Value Creation",
    "Asset Utilization",
    "Capital Efficiency",
    "Cashflow Positive",
    "Burn Rate",
    "Runway",
    "Funding Round",
    "Valuation",
    "Unicorn Status",
    "Exit Strategy",
    "M&A",
    "IPO Readiness",
    "Shareholder Value",
    "Dividend",
    "EBITDA",
    "Bottom Line",
    "Top Line",
    "Fiscal Discipline",
    "Budget Allocation",
  ],
  "Operational & Efficiency": [
    "Streamline",
    "Optimize",
    "Lean",
    "Six Sigma",
    "Process Improvement",
    "Workflow",
    "Bottleneck",
    "Throughput",
    "Capacity Planning",
    "Resource Allocation",
    "Utilization",
    "Productivity",
    "Efficiency Gain",
    "Time-to-Market",
    "Cycle Time",
    "Lead Time",
    "Turnaround Time",
    "Quality Assurance",
    "Continuous Improvement",
    "Kaizen",
    "Best Practices",
    "Standardization",
    "Automation",
    "Self-Service",
    "Scalable Operations",
    "Supply Chain",
    "Logistics",
    "Inventory Management",
    "Just-in-Time",
    "Risk Mitigation",
  ],
  "Strategic & Visionary": [
    "Blue Ocean Strategy",
    "North Star",
    "Moonshot",
    "Game Changer",
    "Disruption",
    "First-Mover Advantage",
    "Market Positioning",
    "Competitive Landscape",
    "Strategic Roadmap",
    "Vision Statement",
    "Mission-Critical",
    "Core Competency",
    "Unique Selling Proposition",
    "Brand Equity",
    "Market Penetration",
    "Expansion Strategy",
    "Diversification",
    "Pivot",
    "Agile Strategy",
    "Long-Tail",
    "Ecosystem Play",
    "Platform Strategy",
    "Network Effect",
    "Flywheel",
    "Sustainable Advantage",
    "Barrier to Entry",
    "Moat",
    "Category Creation",
    "Thought Leadership",
    "Future-Proof",
  ],
}

// Function to get random words from a specific category
export function getRandomWordsFromCategory(category: string, count: number): string[] {
  if (!buzzwords[category]) {
    return []
  }

  const words = [...buzzwords[category]]
  const result: string[] = []

  // Shuffle and pick random words
  for (let i = 0; i < count && words.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * words.length)
    result.push(words[randomIndex])
    words.splice(randomIndex, 1) // Remove the word to avoid duplicates
  }

  return result
}

// Function to get random words from all categories
export function getRandomWordsFromAllCategories(count: number): string[] {
  const allWords: string[] = []

  // Collect all words from all categories
  Object.values(buzzwords).forEach((categoryWords) => {
    allWords.push(...categoryWords)
  })

  const result: string[] = []
  const wordsCopy = [...allWords]

  // Shuffle and pick random words
  for (let i = 0; i < count && wordsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * wordsCopy.length)
    result.push(wordsCopy[randomIndex])
    wordsCopy.splice(randomIndex, 1) // Remove the word to avoid duplicates
  }

  return result
}
