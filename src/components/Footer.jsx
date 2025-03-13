import { Github, Linkedin, Code } from "lucide-react"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Code size={20} />
          <span>Portfolio</span>
        </div>
        <p>© {new Date().getFullYear()} Amanpreet Singh All rights reserved.</p>
        <div className="footer-social">
          <a href="https://github.com/Kirito034" target="_blank" rel="noopener noreferrer">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/amanpreet-singh-ossan-2a4194333/" target="_blank" rel="noopener noreferrer">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}

