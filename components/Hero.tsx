import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">Alex.</span>
          </h1>
          <p className="hero-description">
            I'm a computer science student passionate about building useful software
            and learning industry best practices. Welcome to my portfolio.
          </p>

          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/alex-fintinariu/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                width={32}
                height={32}
                className="social-icon social-icon-img"
              />
              <span className="social-label">LinkedIn</span>
            </a>
            <a
              href="https://github.com/Nacko577"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <Image
                src="/github.png"
                alt="GitHub"
                width={32}
                height={32}
                className="social-icon social-icon-img"
              />
              <span className="social-label">GitHub</span>
            </a>
            <a
              href="https://www.instagram.com/alexfintinariu/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
            >
              <Image
                src="/instagram.png"
                alt="Instagram"
                width={32}
                height={32}
                className="social-icon social-icon-img"
              />
              <span className="social-label">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/alex.fintinariu/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Facebook"
            >
              <Image
                src="/facebook.png"
                alt="Facebook"
                width={32}
                height={32}
                className="social-icon social-icon-img"
              />
              <span className="social-label">Facebook</span>
            </a>
            <a
              href="https://open.spotify.com/user/21notoxgpmsnmb5hffi32k2mq?si=600e970f8ebe4d15"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Spotify"
            >
              <Image
                src="/spotify.png"
                alt="Spotify"
                width={32}
                height={32}
                className="social-icon social-icon-img"
              />
              <span className="social-label">Spotify</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
