import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  const primaryColor = "#00fff7"; // cyan neon-ish
  const bgColor = "#0a0f1a"; // very dark navy almost black
  const cardBg = "rgba(0, 255, 247, 0.05)"; // subtle cyan transparent

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap');

          html, body, #root {
            margin: 0; padding: 0;
            width: 100vw; height: 100vh;
            background: ${bgColor};
            color: ${primaryColor};
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
          }

          main {
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 10vh;
            text-align: center;
            position: relative;
            z-index: 1;
          }

          /* subtle animated background grid */
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background:
              linear-gradient(rgba(0, 255, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 247, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
            animation: gridShift 60s linear infinite;
            z-index: 0;
          }

          @keyframes gridShift {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 40px 40px, 40px 40px; }
          }

          h1 {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 3.5rem;
            color: ${primaryColor};
            text-shadow:
              0 0 10px ${primaryColor},
              0 0 20px ${primaryColor},
              0 0 30px ${primaryColor};
            margin-bottom: 0.3rem;
          }

          p.description {
            font-size: 1.4rem;
            color: ${primaryColor};
            max-width: 600px;
            font-weight: 500;
            text-shadow: 0 0 5px rgba(0, 255, 247, 0.5);
            margin-bottom: 2rem;
          }

          .btn-primary {
            background: linear-gradient(90deg, #00fff7, #00d1ca);
            color: #0a0f1a;
            padding: 0.75rem 2rem;
            border-radius: 999px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            box-shadow:
              0 0 8px #00fff7,
              0 0 20px #00fff7;
            transition: all 0.3s ease;
            font-family: 'JetBrains Mono', monospace;
            letter-spacing: 0.05em;
          }

          .btn-primary:hover {
            filter: brightness(1.2);
            box-shadow:
              0 0 15px #00fff7,
              0 0 40px #00fff7,
              0 0 80px #00fff7;
            transform: scale(1.1);
          }

          .btn-outline {
            border: 2px solid ${primaryColor};
            background: transparent;
            color: ${primaryColor};
            padding: 0.75rem 2rem;
            border-radius: 999px;
            font-weight: 700;
            text-decoration: none;
            font-family: 'JetBrains Mono', monospace;
            letter-spacing: 0.05em;
            box-shadow: 0 0 10px rgba(0, 255, 247, 0.5);
            transition: all 0.3s ease;
          }

          .btn-outline:hover {
            background: ${primaryColor};
            color: ${bgColor};
            box-shadow:
              0 0 20px ${primaryColor},
              0 0 40px ${primaryColor};
          }

          .glass-card {
            background: ${cardBg};
            border-radius: 1rem;
            padding: 2.5rem 3rem;
            margin-top: 4rem;
            width: 90%;
            max-width: 1000px;
            box-shadow:
              0 0 15px rgba(0, 255, 247, 0.2),
              inset 0 0 10px rgba(0, 255, 247, 0.1);
            border: 1px solid rgba(0, 255, 247, 0.3);
          }

          .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 2.5rem;
          }

          h3 {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 1.3rem;
            margin-bottom: 0.6rem;
            color: ${primaryColor};
            text-shadow: 0 0 5px rgba(0, 255, 247, 0.8);
          }

          p.feature-desc {
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 1rem;
            line-height: 1.5;
            opacity: 0.85;
            color: ${primaryColor};
            text-shadow: 0 0 3px rgba(0, 255, 247, 0.5);
          }

          footer {
            flex-shrink: 0;
            background: transparent;
            padding: 1rem 2rem;
            text-align: center;
            font-size: 0.9rem;
            color: ${primaryColor};
            margin-top: 3rem;
            font-family: 'JetBrains Mono', monospace;
            letter-spacing: 0.05em;
            text-shadow: 0 0 5px rgba(0, 255, 247, 0.8);
          }

          footer a {
            color: ${primaryColor};
            text-decoration: none;
            margin: 0 0.75rem;
            transition: color 0.3s ease;
          }

          footer a:hover {
            color: #00d1ca;
            text-decoration: underline;
            text-shadow: 0 0 10px #00fff7;
          }

          @media (max-width: 480px) {
            footer {
              font-size: 0.8rem;
              padding: 1rem;
            }
            footer a {
              margin: 0 0.5rem;
            }
          }
        `}
      </style>

      <main>
        <h1 className="fade-in">Web3D Game Engine</h1>
        <p className="fade-in description">
          Build immersive 3D web experiences with zero boilerplate.
        </p>

        <div
          className="fade-in"
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            className="btn-primary"
            onClick={() => navigate("/main-menu")}
          >
            🚀 Start Editing
          </button>
          <a
            href="https://github.com/Iqbalfachry19/web3deditor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            ⭐ GitHub Repo
          </a>
        </div>

        {/* Sections */}
        {[
          [
            [
              "⚡ Real-Time Editing",
              "Instant visual feedback while tweaking scenes.",
            ],
            [
              "🧠 ECS Architecture",
              "Entity Component System for modular design.",
            ],
            ["🕹️ Physics Ready", "Built-in Rapier physics and collisions."],
            ["🧩 Scriptable", "Custom logic via intuitive scripting."],
          ],
          [
            [
              "🌐 WebGL & Three.js",
              "Harness full GPU rendering power with easy abstraction.",
            ],
            [
              "🔌 Plugin System",
              "Extend with custom plugins and integrations.",
            ],
            [
              "📦 Asset Loader",
              "Drag-and-drop models, textures, and animations.",
            ],
            [
              "🛠️ Developer Tools",
              "Inspector, hierarchy, and runtime debugger built-in.",
            ],
          ],
          [
            [
              "🎮 Controller Support",
              "Easily connect gamepads and other input devices.",
            ],
            [
              "🌍 Multiplayer Ready",
              "Built-in support for WebRTC/WebSocket networking.",
            ],
            [
              "📈 Performance Monitor",
              "Real-time FPS, memory, and GPU usage overlay.",
            ],
            [
              "🚀 Deployment",
              "Export to static site or host on IPFS instantly.",
            ],
          ],
        ].map((features, idx) => (
          <section key={idx} className="glass-card fade-in">
            <div className="feature-grid">
              {features.map(([title, desc], i) => (
                <div key={i}>
                  <h3>{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <span>
          📖{" "}
          <a href="/docs" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>{" "}
          &nbsp;|&nbsp; 💬{" "}
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
