export default function Education() {
  const education = [
    {
      icon: '🎓',
      degree: 'Computer Science and Mathematics BSc',
      school: 'Babeș-Bolyai University',
      field: 'Field of Study: Computer Science and Mathematics',
      period: 'Years: 2020 - 2024',
      description: 'Relevent coursework: Data Structures and Algorithms, Databases, Operating Systems, Software Engineering, Artificial Intelligence, Object-Oriented Programming',
    },
    {
      icon: '📜',
      degree: 'Cambridge English Advanced (C2 Proficiency)',
      school: 'Institution',
      period: 'Year: 2020',
      description: '-',
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
            <article key={index} className="education-card">
              <div className="education-icon">{item.icon}</div>
              <div className="education-content">
                <h3 className="education-degree">{item.degree}</h3>
                <p className="education-school">{item.school}</p>
                <div className="education-details">
                  {item.field && (
                    <span className="education-field">{item.field}</span>
                  )}
                  <span className="education-period">{item.period}</span>
                </div>
                <p className="education-description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
