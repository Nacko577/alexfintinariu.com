export default function Projects() {
  const projects = [
    {
      title: "Suceava Live Bus Map",
      date: "Jan. 2025",
      url: "https://suceavabuses.vercel.app",
      description:
        "Real-time bus tracking and route planner with interactive maps, live GPS ingestion, route generation, and a transfer-aware trip planner.",
      tech: ["TypeScript", "Next.js", "React", "Leaflet", "Node.js"],
    },
    {
      title: "LinguaChat",
      date: "Feb. 2026",
      url: "https://linguachat.navitech.cloud/",
      description:
        "Real-time multilingual chat platform with private messaging, automatic translation, and encrypted conversations across Android and web.",
      tech: ["Jetpack Compose", "TypeScript", "SvelteKit", "Git"],
    },
    {
      title: "Cabo Card Game",
      date: "Apr. 2026",
      url: "https://github.com/Nacko577",
      description:
        "Native iOS and Android multiplayer card game with online WebSocket play, same-network discovery (Bonjour / NSD), and a JSON wire protocol so cross-platform players can join the same session.",
      tech: ["Swift", "Kotlin", "WebSockets"],
    },
    {
      title: "Box Ninja",
      date: "Jan. 2023",
      url: "https://github.com/Nacko577/BoxNinja",
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

        <div className="project-list">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card card-hover"
            >
              <div className="project-top">
                <span className="date-pill">{project.date}</span>
                <div className="project-info">
                  <h3 className="project-title">
                    {project.title}
                    <span className="project-arrow">↗</span>
                  </h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}