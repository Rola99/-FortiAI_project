import React, { useState } from 'react';
import axios from 'axios';
import './CoachPage.css';

export default function CoachPage() {
  const [mode, setMode] = useState('upload'); // 'upload' أو 'dashboard'
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // desc = الأعلى أولًا, asc = الأقل أولًا

  const handleModeChange = (m) => {
    setMode(m);
    setResults([]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const analyzeTeam = async () => {
    if (!file) return alert('اختر ملف CSV أولاً');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/analyze-team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(res.data);  // متوقع Array من النتائج
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التحليل');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    return sortOrder === 'desc'
      ? b.risk_percent - a.risk_percent
      : a.risk_percent - b.risk_percent;
  });

  const downloadCSV = () => {
    const header = ['player_name', 'risk_percent', 'classification', 'recommendation'];
    const csv = [
      header.join(','),
      ...results.map(r =>
        [r.player_name, r.risk_percent, r.classification, `"${r.recommendation}"`].join(',')
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coach_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="coach-page">
      <h2> تحليل الفريق </h2>

      {/* تبديل الوضع */}
      <div className="mode-switch">
        <button
          className={mode === 'upload' ? 'active' : ''}
          onClick={() => handleModeChange('upload')}
        >
          رفع بيانات فريقي
        </button>
        <button
          className={mode === 'dashboard' ? 'active' : ''}
          onClick={() => handleModeChange('dashboard')}
        >
          عرض Dashboard
        </button>
      </div>

      {/* رفع CSV */}
      {mode === 'upload' && (
        <div className="upload-section">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button className="analyze-btn" onClick={analyzeTeam}>
            تحليل
          </button>

          {results.length > 0 && (
            <div className="results-section">
              <div className="controls">
                <label>
                  ترتيب حسب:
                  <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="desc">الخطر الأعلى أولًا</option>
                    <option value="asc">الخطر الأقل أولًا</option>
                  </select>
                </label>
                <button onClick={downloadCSV}>تحميل النتائج (CSV)</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>اسم اللاعب</th>
                    <th>نسبة الخطر</th>
                    <th>تصنيف الخطر</th>
                    <th>التوصية</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r, i) => (
                    <tr key={i}>
                      <td>{r.player_name}</td>
                      <td>{r.risk_percent}%</td>
                      <td>{r.classification}</td>
                      <td>{r.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* داشبورد Power BI */}
      {mode === 'dashboard' && (
        <div className="dashboard-section">
          <iframe
            title="Power BI Dashboard"
            width="100%" 
            height="600"
            src="https://app.powerbi.com/view?r=eyJrIjoiM2Q1NmUwMjAtMmI4OS00ZDllLWEyOWQtNDJjOTY1NDIyNTA0IiwidCI6Ijc5YTA1N2ZiLWIwZDUtNDRkZC04ZjkwLTBiZjcxNTFmNWMzZiIsImMiOjl9"
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      )}
    </div>
  );
}
