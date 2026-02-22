export default function Experience() {
  const experience = [
    {
      company: 'Navitech Systems',
      role: 'Junior Full-Stack Software Developer',
      period: 'Dec. 2025 – Present',
      bullets: [
        'Contributed to the development and maintenance of web applications, delivering new features and improving existing functionality.',
        'Built responsive user interfaces using JavaScript/TypeScript (React, Svelte), focusing on usability and performance.',
        'Implemented REST APIs (NestJS), integrated services, and ensured reliable data flow.',
        'Designed and optimized SQL queries to support features and improve performance.',
      ],
      tech: ['TypeScript', 'JavaScript', 'React', 'Svelte', 'NestJS', 'SQL', 'Git', 'Docker'],
    },
  ];

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Experience</h2>
        </div>

        <div className="experience-list">
          {experience.map((item, idx) => (
            <article key={idx} className="experience-card card-hover">
              <div className="experience-top">
                <div>
                  <h3 className="experience-role">{item.role}</h3>
                  <p className="experience-company">{item.company}</p>
                </div>
                <span className="experience-period">{item.period}</span>
              </div>

              <ul className="experience-bullets">
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className="experience-tech">
                {item.tech.map((t) => (
                  <span key={t} className="tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}