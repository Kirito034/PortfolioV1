import { User, Mail, Home, Github, Linkedin } from "lucide-react"

export const Navbar = ({ currentPage, onPageChange }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo">Portfolio</div>
      <div className="nav-links">
        <div className={`nav-item ${currentPage === "home" ? "active" : ""}`} onClick={() => onPageChange("home")}>
          <span className="nav-icon">
            <Home />
          </span>
          Home
        </div>
        <div className={`nav-item ${currentPage === "about" ? "active" : ""}`} onClick={() => onPageChange("about")}>
          <span className="nav-icon">
            <User />
          </span>
          About
        </div>
        <div
          className={`nav-item ${currentPage === "projects" ? "active" : ""}`}
          onClick={() => onPageChange("projects")}
        >
          <span className="nav-icon">
            <Mail />
          </span>
          Projects
        </div>
        <div
          className={`nav-item ${currentPage === "contact" ? "active" : ""}`}
          onClick={() => onPageChange("contact")}
        >
          <span className="nav-icon">
            <Mail />
          </span>
          Contact
        </div>
      </div>
    </nav>
  )
}

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">Portfolio</div>
        <div className="footer-social">
          <a href="https://github.com/Kirito034" target="_blank" rel="noopener noreferrer">
            <Github />
          </a>
          <a href="https://www.https://www.linkedin.com/in/amanpreet-singh-ossan-2a4194333//" target="_blank" rel="noopener noreferrer">
            <Linkedin />
          </a>
        </div>
      </div>
    </footer>
  )
}

export const ProjectCard = ({ project, index }) => {
  return (
    <div className="project-card">
      <div className="project-image">
        <div className="project-overlay">
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
            Live Demo
          </a>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
            Github
          </a>
        </div>
      </div>
      <div className="project-info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tech">
          {project.technologies.map((tech, index) => (
            <span className="tech-tag" key={index}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const SkillIcon = ({ skill, index }) => {
  return (
    <div className="skill-icon">
      <div className="skill-icon-inner">{skill.name}</div>
      <p>{skill.name}</p>
    </div>
  )
}

export const ExperienceCard = ({ experience, index }) => {
  return (
    <div className="experience-card">
      <div className="experience-date">{experience.period}</div>
      <div className="experience-content">
        <h3>{experience.role}</h3>
        <h4>{experience.company}</h4>
        <p>{experience.description}</p>
      </div>
    </div>
  )
}

export const ContactForm = () => {
  return (
    <form className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      <button type="submit" className="submit-btn">
        Send Message
      </button>
    </form>
  )
}

export const FallbackContent = () => {
  return (
    <div className="fallback-background">
      <div className="animated-gradient"></div>
      <div className="fallback-content">
        <h2>Oops!</h2>
        <p>Something went wrong. Please try again later.</p>
      </div>
    </div>
  )
}

