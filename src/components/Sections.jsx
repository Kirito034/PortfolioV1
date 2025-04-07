"use client"

import { motion } from "framer-motion"
import { User, Mail, Home, Github, Linkedin, Code, ExternalLink } from "lucide-react"
import ScrollReveal from "./ScrollRevel.jsx"
import "../styles/sections.css"

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export function AboutSection({ experiences, skills }) {
  return (
    <section className="about-section">
      <div className="content-wrapper">
        <div className="section-content">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="section-title"
          >
            About Me
          </motion.h1>
          <ScrollReveal>
            <div className="about-grid">
              <div className="about-text">
                <p>
                  I am a passionate Full-Stack Developer and Data Scientist eager to build intelligent, scalable, and
                  optimized solutions. With a strong foundation in Python, JavaScript, SQL, React, Flask, and
                  PostgreSQL, I specialize in both backend logic and frontend experiences.
                </p>
                <p>
                  I love solving real-world problems through data-driven decision-making and efficient system design. My
                  projects reflect my ability to architect robust applications, implement machine learning models, and
                  optimize performance.
                </p>
                <p>
                  As a fresher, I am always learning, experimenting, and innovating to stay ahead in technology. My goal
                  is to become a craftsman in building solutions that are not just functional but also scalable and
                  efficient.
                </p>
              </div>
              <motion.div
                className="about-stats"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div className="stat" variants={itemVariants}>
                  <h4>IEEE CS Chapter</h4>
                  <p>On campus Chairperson and Mentor</p>
                </motion.div>
                <motion.div className="stat" variants={itemVariants}>
                  <h4>IdeaYaan</h4>
                  <p>Organized a national Level Ideathon event as a core member</p>
                </motion.div>
                <motion.div className="stat" variants={itemVariants}>
                  <h4>10+ events</h4>
                  <p>From intercollegate events to state level</p>
                </motion.div>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-subtitle">Experience</h2>
            <motion.div
              className="experience-timeline"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {experiences.map((exp, index) => (
                <motion.div
                  className="experience-card"
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 15, transition: { duration: 0.3 } }}
                >
                  <div className="experience-date">{exp.period}</div>
                  <div className="experience-content">
                    <h3>{exp.role}</h3>
                    <h4>{exp.company}</h4>
                    <p>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-subtitle">Skills</h2>
            <motion.div
              className="skills-container"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {skills.map((skill, index) => (
                <motion.div
                  className="skill-icon"
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="skill-icon-inner">
                    <Code size={24} />
                  </div>
                  <span>{skill.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export function ProjectsSection({ projects }) {
  return (
    <section className="projects-section">
      <div className="content-wrapper">
        <div className="section-content">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="section-title"
          >
            My Projects
          </motion.h1>
          <motion.p
            className="section-intro"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A selection of my recent work and personal projects
          </motion.p>
          <ScrollReveal>
            <motion.div
              className="projects-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {projects.map((project, index) => (
                <motion.div
                  className="project-card"
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -15,
                    boxShadow: "0 0 25px rgba(255, 255, 255, 0.3)",
                    transition: { duration: 0.3 },
                  }}
                >
                 <div className="project-image">
  {project.image ? (
    <img src={project.image || "/placeholder.svg"} alt={project.title} className="project-gif" />
  ) : (
    <div className="project-placeholder"></div>
  )}

  <div className="project-overlay">
    {/* Conditional CTA button */}
    {project.exeFile ? (
      <a 
        href={project.exeFile} 
        download 
        target="_blank" 
        rel="noopener noreferrer" 
        className="project-link"
      >
        <ExternalLink size={20} />
        <span>Download Setup</span>
      </a>
    ) : project.liveUrl ? (
      <a 
        href={project.liveUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="project-link"
      >
        <ExternalLink size={20} />
        <span>Visit Site</span>
      </a>
    ) : null}

    {/* GitHub button (common for both) */}
    <a 
      href={project.githubUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="project-link"
    >
      <Github size={20} />
      <span>Code</span>
    </a>
  </div>
</div>

<div className="project-info">
  <h3>{project.title}</h3>
  <p>{project.description}</p>
  <div className="project-tech">
    {project.technologies.map((tech, i) => (
      <span key={i} className="tech-tag">
        {tech}
      </span>
    ))}
  </div>
</div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section className="contact-section">
      <div className="content-wrapper">
        <div className="section-content">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="section-title"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className="section-intro"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have a project in mind or want to chat? Drop me a message!
          </motion.p>
          <ScrollReveal>
            <div className="contact-container">
              <motion.div
                className="contact-info"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div
                  className="contact-item"
                  variants={itemVariants}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <Mail className="contact-icon" />
                  <p>amanpreetsinghossan@gmail.com</p>
                </motion.div>
                <motion.div
                  className="contact-item"
                  variants={itemVariants}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <User className="contact-icon" />
                  <p>+91 7020481031</p>
                </motion.div>
                <motion.div
                  className="contact-item"
                  variants={itemVariants}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <Home className="contact-icon" />
                  <p>Nagpur, Maharashtra</p>
                </motion.div>
                <motion.div className="social-links" variants={itemVariants}>
                  <motion.a
                    href="https://github.com/Kirito034"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1, transition: { duration: 0.2 } }}
                  >
                    <Github />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/amanpreet-singh-ossan-2a4194333/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1, transition: { duration: 0.2 } }}
                  >
                    <Linkedin />
                  </motion.a>
                </motion.div>
              </motion.div>
              <div className="contact-form-container">
                <form className="contact-form">
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                  </motion.div>
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </motion.div>
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 5px 15px rgba(255, 255, 255, 0.2)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

