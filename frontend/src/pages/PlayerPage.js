import React, { useState } from 'react';
import axios from 'axios';
import './PlayerPage.css';

export default function PlayerPage() {
  // الوضع: 'auto' أو 'manual'
  const [mode, setMode] = useState('auto');
  // بيانات النموذج
  const [form, setForm] = useState({
    age: '',
    weight: '',
    height: '',
    previousInjuries: '0',
    trainingIntensity: '0',
    recoveryDays: ''
  });
  const [result, setResult] = useState(null);

  const handleModeChange = (m) => {
    setMode(m);
    setResult(null);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const analyzeAuto = async () => {
    try {
      const res = await axios.get('http://localhost:5000/analyze-player?auto=true');
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const analyzeManual = async () => {
    try {
      const payload = {
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
        previousInjuries: Number(form.previousInjuries),
        trainingIntensity: Number(form.trainingIntensity),
        recoveryDays: Number(form.recoveryDays),
      };
      const res = await axios.post('http://localhost:5000/analyze-player', payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  return (
    <div className="player-page">
      <h2>تحليل اللاعب</h2>

      {/* تبديل الوضع */}
      <div className="mode-switch">
        <button
          className={mode === 'auto' ? 'active' : ''}
          onClick={() => handleModeChange('auto')}
        >
          تحليل تلقائي
        </button>
        <button
          className={mode === 'manual' ? 'active' : ''}
          onClick={() => handleModeChange('manual')}
        >
          إدخال بيانات
        </button>
      </div>

      {/* القسم التلقائي */}
      {mode === 'auto' && (
        <div className="auto-section">
          <p>سيتم استخدام بياناتك الجاهزة في التحليل.</p>
          <button className="analyze-btn" onClick={analyzeAuto}>
            ابدأ التحليل التلقائي
          </button>
        </div>
      )}

      {/* القسم اليدوي */}
      {mode === 'manual' && (
        <div className="form-section">
          <input
            name="age"
            type="number"
            placeholder="العمر"
            value={form.age}
            onChange={handleInput}
          />
          <input
            name="weight"
            type="number"
            placeholder="الوزن (كجم)"
            value={form.weight}
            onChange={handleInput}
          />
          <input
            name="height"
            type="number"
            placeholder="الطول (سم)"
            value={form.height}
            onChange={handleInput}
          />
          <label>
            إصابات سابقة؟
            <select
              name="previousInjuries"
              value={form.previousInjuries}
              onChange={handleInput}
            >
              <option value="0">لا</option>
              <option value="1">نعم</option>
            </select>
          </label>
          <label>
            شدة التدريب
            <select
              name="trainingIntensity"
              value={form.trainingIntensity}
              onChange={handleInput}
            >
              <option value="0">بسيط</option>
              <option value="1">شديد</option>
            </select>
          </label>
          <input
            name="recoveryDays"
            type="number"
            placeholder="مدة التعافي بالأيام"
            value={form.recoveryDays}
            onChange={handleInput}
          />
          <button className="analyze-btn" onClick={analyzeManual}>
            حلل حالتي
          </button>
        </div>
      )}

      {/* عرض النتائج */}
      {result && (
        <div className="result-section">
          <h3>النتائج:</h3>
          <p>نسبة الخطر: {result.risk_percent}%</p>
          <p>تصنيف الخطر: {result.classification}</p>
          <p>التوصية: {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}
