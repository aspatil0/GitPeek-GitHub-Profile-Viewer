import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGitHubData = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setProfile(null);
    setRepos([]);

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error('User not found');
      const userData = await userRes.json();
      setProfile(userData);

      const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <h1>GitHub Profile Viewer</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Enter GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchGitHubData}>Search</button>
          <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {loading && <p className="loading">⏳ Loading...</p>}
        {error && <p className="error">❌ {error}</p>}

        {profile && (
          <div className="profile-card">
            <img src={profile.avatar_url} alt="avatar" className="avatar" />
            <h2>{profile.name || profile.login}</h2>
            <p>{profile.bio}</p>
            <p><strong>Public Repos:</strong> {profile.public_repos}</p>
          </div>
        )}

        {repos.length > 0 && (
          <div className="repo-list">
            <h3>Repositories</h3>
            <ul>
              {repos.map((repo) => (
                <li key={repo.id}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <strong>{repo.name}</strong>
                  </a>
                  <p>{repo.description || 'No description'}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {profile && (
          <div className="stats-section">
            <h3>GitHub Stats</h3>
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical`}
              alt="GitHub Stats"
            />
            <img
              src={`https://github-readme-streak-stats.herokuapp.com?user=${username}&theme=radical`}
              alt="GitHub Streak"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
