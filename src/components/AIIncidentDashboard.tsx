// AIIncidentDashboard.tsx
import React, { useState } from 'react';
import './AIIncidentDashboard.css';

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string;
}

const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics in product recommendations, creating unequal exposure and opportunities. This was identified during routine algorithmic fairness auditing and has since been recalibrated with additional fairness constraints.",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information during emergency response simulation, potentially endangering users in real-world scenarios. The model has been retrained with enhanced factual grounding and additional safety guardrails.",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z"
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata in its responses due to prompt injection vulnerability. The issue has been patched and all users notified of the limited exposure.",
    severity: "Low",
    reported_at: "2025-04-10T09:15:00Z"
  }
];

const AIIncidentDashboard: React.FC = () => {
  // State management
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [expandedIncidentId, setExpandedIncidentId] = useState<number | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Newest First");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  
  // New incident form state
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id' | 'reported_at'>>({
    title: '',
    description: '',
    severity: 'Medium',
  });

  // Toggle expanded incident details
  const toggleExpand = (id: number) => {
    setExpandedIncidentId(expandedIncidentId === id ? null : id);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIncident(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newIncident.title.trim() || !newIncident.description.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create new incident with current date and new ID
    const currentDate = new Date().toISOString();
    const newId = Math.max(...incidents.map(inc => inc.id), 0) + 1;
    
    const incidentToAdd: Incident = {
      ...newIncident,
      id: newId,
      reported_at: currentDate,
    };
    
    // Add to incidents list
    setIncidents([incidentToAdd, ...incidents]);
    
    // Reset form and close it
    setNewIncident({
      title: '',
      description: '',
      severity: 'Medium',
    });
    setShowReportForm(false);
  };

  // Toggle report form
  const toggleReportForm = () => {
    setShowReportForm(!showReportForm);
  };

  // Filter and sort incidents
  const filteredAndSortedIncidents = incidents
    .filter(incident => severityFilter === 'All' || incident.severity === severityFilter)
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'Newest First' ? dateB - dateA : dateA - dateB;
    });

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}${getDaySuffix(day)}, ${year}`;
  };

  // Get day suffix (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="dashboard-header">
        <h1>AI Safety Incident Dashboard</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="top-bar">
        <h2>Incidents</h2>
        <button className="report-incident-btn" onClick={toggleReportForm}>
          Report New Incident
        </button>
      </div>

      <div className="dashboard-content">
        <div className="incidents-container">
          <div className="filter-bar">
            <div className="filter-controls">
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="filter-dropdown"
              >
                <option value="All">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-dropdown"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="incidents-list">
            {filteredAndSortedIncidents.length > 0 ? (
              filteredAndSortedIncidents.map(incident => (
                <div key={incident.id} className="incident-card">
                  <div className="incident-header">
                    <div className="incident-title-area">
                      <h3>{incident.title}</h3>
                      <div className="incident-meta">
                        <span className={`severity-badge ${incident.severity.toLowerCase()}`}>
                          {incident.severity}
                        </span>
                        <span className="incident-date">
                          {formatDate(incident.reported_at)}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => toggleExpand(incident.id)}
                    >
                      View Details
                    </button>
                  </div>
                  
                  {expandedIncidentId === incident.id && (
                    <div className="incident-details">
                      <p>{incident.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-incidents">No incidents matching the current filters.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for reporting new incident */}
      {showReportForm && (
        <div className="modal-overlay" onClick={toggleReportForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report New Incident</h2>
              <button className="close-modal-btn" onClick={toggleReportForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="incident-form">
              <div className="form-group">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newIncident.title}
                  onChange={handleInputChange}
                  placeholder="Incident Title"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  id="description"
                  name="description"
                  value={newIncident.description}
                  onChange={handleInputChange}
                  placeholder="Incident Description"
                  className="form-input description"
                  required
                />
              </div>
              
              <div className="form-group">
                <select
                  id="severity"
                  name="severity"
                  value={newIncident.severity}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={toggleReportForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIIncidentDashboard;