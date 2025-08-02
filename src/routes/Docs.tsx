import { useNavigate } from "react-router-dom";

export function DocsPage() {
  const navigate = useNavigate();

  const docsSections = [
    {
      title: "Getting Started",
      items: [
        {
          title: "Installation",
          desc: "How to install Web3D Game Engine and set up your environment.",
          link: "/docs/getting-started/installation",
        },
        {
          title: "First Scene",
          desc: "Create your first 3D scene with step-by-step instructions.",
          link: "/docs/getting-started/first-scene",
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Entity Component System (ECS)",
          desc: "Learn the modular architecture of ECS for flexible game design.",
          link: "/docs/core-concepts/ecs",
        },
        {
          title: "Scripting API",
          desc: "Overview of scripting language and API for custom behaviors.",
          link: "/docs/core-concepts/scripting",
        },
      ],
    },
    {
      title: "Advanced Features",
      items: [
        {
          title: "Physics Integration",
          desc: "Use built-in Rapier physics engine for realistic simulations.",
          link: "/docs/advanced/physics",
        },
        {
          title: "Multiplayer Setup",
          desc: "Set up networking for WebRTC/WebSocket multiplayer support.",
          link: "/docs/advanced/multiplayer",
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "API Reference",
          desc: "Detailed API documentation for all modules and classes.",
          link: "/docs/resources/api",
        },
        {
          title: "Examples",
          desc: "Explore sample projects and demo scenes.",
          link: "/docs/resources/examples",
        },
      ],
    },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

          html, body, #root {
            margin: 0;
            padding: 0;
            width: 100vw;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            background: #0f172a;
            color: #f1f5f9;
            display: flex;
            flex-direction: column;
          }

          main {
            flex: 1 0 auto;
            padding: 4rem 2rem 2rem;
            max-width: 1000px;
            margin: 0 auto;
            width: 90%;
          }

          h1 {
            font-weight: 700;
            font-size: 3rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          h2 {
            font-weight: 600;
            font-size: 1.75rem;
            margin-bottom: 1rem;
            color: #60a5fa;
          }

          .section {
            margin-bottom: 3rem;
          }

          .docs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .doc-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: background 0.2s ease;
          }

          .doc-card:hover {
            background: rgba(96, 165, 250, 0.15);
          }

          .doc-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #93c5fd;
          }

          .doc-desc {
            font-size: 1rem;
            color: #cbd5e1;
            line-height: 1.4;
          }

          footer {
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
            padding: 1rem 2rem;
            text-align: center;
            font-size: 0.9rem;
            color: #94a3b8;
            margin-top: 3rem;
          }

          footer a {
            color: #60a5fa;
            text-decoration: none;
            margin: 0 0.5rem;
            transition: color 0.2s ease;
          }

          footer a:hover {
            color: #3b82f6;
            text-decoration: underline;
          }
        `}
      </style>

      <main>
        <h1>📚 Documentation</h1>

        {docsSections.map(({ title, items }, i) => (
          <section className="section" key={i}>
            <h2>{title}</h2>
            <div className="docs-grid">
              {items.map(({ title, desc, link }, j) => (
                <div
                  className="doc-card"
                  key={j}
                  onClick={() => navigate(link)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(link);
                  }}
                >
                  <div className="doc-title">{title}</div>
                  <p className="doc-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <span>
          💬{" "}
          <a
            href="https://discord.gg/yourdiscord"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>{" "}
          &nbsp;|&nbsp; 🌍{" "}
          <a
            href="https://twitter.com/yourtwitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </span>
        <br />
        <small>
          © {new Date().getFullYear()} Web3D Game Engine. All rights reserved.
        </small>
      </footer>
    </>
  );
}
