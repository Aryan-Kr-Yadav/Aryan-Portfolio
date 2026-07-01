import { useEffect, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { FaCodeBranch, FaStar, FaEye, FaExternalLinkAlt } from 'react-icons/fa';
import { FaCodeCommit, FaUsers } from 'react-icons/fa6';
import { githubUsername } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Github.css';

const calendarTheme = {
  light: ['#E8E0CC', '#C3D8B8', '#8FB17A', '#5B8A6F', '#3E6450'],
};

// Fetches live GitHub profile + repos via the public REST API (no auth needed for public data).
async function fetchGitHubData(username) {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ]);
  if (!userRes.ok) throw new Error('GitHub API error');
  const user  = await userRes.json();
  const repos = await reposRes.json();
  return { user, repos };
}

function computeTopLanguages(repos) {
  const counts = {};
  repos.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, n]) => ({ name, percent: Math.round((n / total) * 100) }));
}

function getPinnedCandidates(repos) {
  return [...repos]
    .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
    .slice(0, 4);
}

export default function Github() {
  const [ref, isVisible] = useReveal();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchGitHubData(githubUsername)
      .then(({ user, repos }) => {
        setData({
          user,
          topLanguages: computeTopLanguages(repos),
          pinned: getPinnedCandidates(repos),
          totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
        });
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const stats = data ? [
    { icon: FaCodeBranch, label: 'Repositories', value: data.user.public_repos },
    { icon: FaCodeCommit, label: 'Followers',    value: data.user.followers },
    { icon: FaUsers,      label: 'Following',    value: data.user.following },
    { icon: FaStar,       label: 'Stars',        value: data.totalStars },
  ] : [];

  return (
    <section className="section github" id="github" data-edition="EDITION 06">
      <div className="container">
        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <p className="section-label">Chapter Four</p>
          <h2 className="section-heading">GitHub</h2>
          <p className="github__sub">Code never sleeps.</p>

          {loading && <p className="github__loading">Fetching live GitHub data…</p>}
          {error   && <p className="github__loading">Could not reach GitHub API — check your connection.</p>}

          {data && (
            <>
              {/* Live stats */}
              <div className="github__stats">
                {stats.map(s => (
                  <div key={s.label} className="github__stat">
                    <s.icon className="github__stat-icon"/>
                    <div>
                      <p className="github__stat-val">{s.value}</p>
                      <p className="github__stat-label">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendar + Languages */}
              <div className="github__panel">
                <div className="github__calendar-card">
                  <GitHubCalendar
                    username={githubUsername}
                    theme={calendarTheme}
                    blockSize={11}
                    blockMargin={4}
                    fontSize={12}
                    throwOnError={false}
                    errorMessage="Set your real GitHub username in portfolioData.js"
                  />
                </div>
                <div className="github__lang-card">
                  <h4>Top Languages</h4>
                  {data.topLanguages.map(l => (
                    <div key={l.name} className="github__lang-row">
                      <div className="github__lang-top">
                        <span>{l.name}</span><span>{l.percent}%</span>
                      </div>
                      <div className="github__lang-bar">
                        <div className="github__lang-fill" style={{ width: isVisible ? `${l.percent}%` : '0%' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top repos */}
              {data.pinned.length > 0 && (
                <>
                  <h3 className="github__repos-heading">Top Repositories</h3>
                  <div className="github__repos">
                    {data.pinned.map(repo => (
                      <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="github__repo">
                        <div className="github__repo-top">
                          <span className="github__repo-name">{repo.name}</span>
                          <FaExternalLinkAlt size={10} className="github__repo-ext"/>
                        </div>
                        <p className="github__repo-desc">{repo.description || 'No description.'}</p>
                        <div className="github__repo-meta">
                          {repo.language && <span className="github__repo-lang">{repo.language}</span>}
                          <span><FaStar size={11}/> {repo.stargazers_count}</span>
                          <span><FaCodeBranch size={11}/> {repo.forks_count}</span>
                          <span><FaEye size={11}/> {repo.watchers_count}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
