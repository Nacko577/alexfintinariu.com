export default function Education() {
  const education = [
    {
      icon: 'grad-cap',
      degree: 'Computer Science and Mathematics BSc',
      school: 'Babeș-Bolyai University',
      field: 'Computer Science and Mathematics',
      period: '2020 - 2024',
      description:
        'Relevant coursework: Data Structures and Algorithms, Databases, Operating Systems, Software Engineering, Artificial Intelligence, Object-Oriented Programming',
    },
  ];

  return (
    <section id="education" className="education-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Education</h2>
        </div>

        <div className="education-timeline">
          {education.map((item, index) => (
            <article key={index} className="education-card card-hover">
              <div className="education-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
                </svg>
              </div>

              <div className="education-content">
                <h3 className="education-degree">{item.degree}</h3>
                <p className="education-school">{item.school}</p>

                <div className="education-details">
                  <span className="education-field">{item.field}</span>
                  <span className="education-sep">•</span>
                  <span className="education-period">{item.period}</span>
                </div>

                <p className="education-description text-measure">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}