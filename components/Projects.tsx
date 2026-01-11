export default function Projects() {
  const projects = [
    {
      title: 'Project 1',
      description: '-',
      tech: ['React', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Project 2',
      description: '-',
      tech: ['Python', 'Flask', 'PostgreSQL'],
    },
    {
      title: 'Project 3',
      description: '-',
      tech: ['JavaScript', 'Express', 'MySQL'],
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Projects</h2>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article key={index} className="project-card">
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-footer">
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
