export default function Projects() {
  const projects = [
    {
      title: "Suceava Live Bus Map",
      date: "Jan. 2025",
      description:
        "Real-time bus tracking and route planner with interactive maps, live GPS ingestion, route generation, and a transfer-aware trip planner.",
      tech: ["TypeScript", "Next.js", "React", "Leaflet", "Node.js"],
    },
    {
      title: "Spotify Artist Data Fetcher",
      date: "Sep. 2024",
      description:
        "Spotify artists data visualization tool that fetches real-time metrics (listeners, followers, top locations) and presents them in a clean UI.",
      tech: ["JavaScript", "TypeScript", "Python", "Git"],
    },
    {
      title: "Box Ninja",
      date: "Jan. 2023",
      description:
        "Fast-paced 2D platformer built in Unity featuring core gameplay systems, enemy spawns, UI, difficulty selection, and performance optimizations.",
      tech: ["C#", "Unity Engine"],
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
                <div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-meta">{project.date}</p>
                </div>
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