import React, { useState } from 'react';
import axios from 'axios';
import './MedicalPage.css';

export default function MedicalPage() {
  const [mode, setMode] = useState('upload'); // 'upload' أو 'dashboard'
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleModeChange = (m) => {
    setMode(m);
    setResults([]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const analyzeMedical = async () => {
    if (!file) return alert('اختر ملف CSV أولاً');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/analyze-team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // فلترة اللاعبين ذوي الخطر العالي (classification === 'خطر عالي')
      const atRisk = res.data.filter(r => r.classification === 'خطر عالي');
      // إضافة مدة التعافي من البيانات الأصلية
      // assume res.data items include recoveryDays if backend passed it
      setResults(atRisk);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التحليل');
    }
  };

  return (
    <div className="medical-page">
      <h2> تحليل اللاعبين </h2>

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
          <button className="analyze-btn" onClick={analyzeMedical}>
            تحليل 
          </button>

          {results.length > 0 && (
            <div className="results-section">
              <table>
                <thead>
                  <tr>
                    <th>اسم اللاعب</th>
                    <th>تصنيف الخطر</th>
                    <th>مدة التعافي (أيام)</th>
                    <th>التوصية</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.player_name}</td>
                      <td>{r.classification}</td>
                      <td>{r.recoveryDays}</td>
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
            title="FortAi Medical"
            width="100%" 
            height="600"
            src="https://app.powerbi.com/view?r=eyJrIjoiM2Q1NmUwMjAtMmI4OS00ZDllLWEyOWQtNDJjOTY1NDIyNTA0IiwidCI6Ijc5YTA1N2ZiLWIwZDUtNDRkZC04ZjkwLTBiZjcxNTFmNWMzZiIsImMiOjl9"
            frameBorder="0"
            allowFullScreen = "true"
          />
        </div>
      )}
    </div>
  );
}
