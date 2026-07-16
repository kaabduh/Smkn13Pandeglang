import React, { useState } from 'react';
import { Code, Terminal, Globe, Send, Play, CheckCircle, Copy, HelpCircle } from 'lucide-react';

export default function DevApiHub() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('/api/v1/public/academic-stats');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTestApi = async () => {
    setLoading(true);
    setApiResponse('');
    try {
      const response = await fetch(activeEndpoint);
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ status: "error", message: `Gagal fetch API: ${err.message}` }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(apiResponse || curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCommand = `curl -X GET "${window.location.origin}${activeEndpoint}" \\
  -H "Accept: application/json"`;

  const fetchJsCode = `fetch('${window.location.origin}${activeEndpoint}')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in">
      
      {/* Intro Header */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5 tracking-tight">
          <Code className="text-blue-600" size={28} />
          <span>Integrasi API Pihak Ketiga</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Sistem Informasi Akademik SMK Negeri 13 Pandeglang menyediakan integrasi API RESTful yang aman, stabil, dan terbuka (dengan dukungan CORS penuh) untuk pengembang pihak ketiga, komite sekolah, dan aplikasi integrasi daerah.
        </p>
      </div>

      {/* Main Grid: Docs & Testing Console */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Columns: API Documentation */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-1.5">
              <Globe size={15} className="text-blue-600" />
              <span>Daftar Endpoint Tersedia</span>
            </h3>

            {/* Endpoints Select list */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveEndpoint('/api/v1/public/academic-stats');
                  setApiResponse('');
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs flex flex-col gap-1 transition-all ${
                  activeEndpoint === '/api/v1/public/academic-stats'
                    ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-300 font-semibold'
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">GET</span>
                  <span className="font-mono">/v1/public/academic-stats</span>
                </div>
                <span className="text-[10px] text-gray-400">Statistik akademik, persentase kelulusan & kehadiran real-time.</span>
              </button>

              <button
                onClick={() => {
                  setActiveEndpoint('/api/v1/public/news');
                  setApiResponse('');
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs flex flex-col gap-1 transition-all ${
                  activeEndpoint === '/api/v1/public/news'
                    ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-300 font-semibold'
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">GET</span>
                  <span className="font-mono">/v1/public/news</span>
                </div>
                <span className="text-[10px] text-gray-400">Sinkronisasi portal berita sekolah ke feed platform luar.</span>
              </button>
            </div>
          </div>

          {/* Quick Integration Guide */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <CheckCircle size={15} className="text-emerald-500" />
              <span>Spesifikasi Teknis API</span>
            </h3>
            <ul className="text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-2 list-disc pl-4 leading-relaxed">
              <li><strong>CORS Policy:</strong> Diaktifkan secara penuh (`*`) untuk akses langsung dari browser frontend.</li>
              <li><strong>Format Data:</strong> Semua respons menggunakan format standar JSON.</li>
              <li><strong>Enkripsi Data:</strong> Dilindungi protokol SSL/TLS HTTPS end-to-end yang aman.</li>
              <li><strong>Rate Limit:</strong> Batas aman maksimal 100 requests per menit per IP address.</li>
            </ul>
          </div>

        </div>

        {/* Right Columns: Interactive Test Console */}
        <div className="lg:col-span-3 bg-gray-900 text-gray-100 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col gap-5">
          
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="text-blue-400" size={18} />
              <span className="text-xs font-bold font-mono tracking-wide">SANDBOX API PLAYGROUND</span>
            </div>
            
            <div className="flex items-center gap-2">
              {apiResponse && (
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Copy size={12} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
              <button
                onClick={handleTestApi}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
              >
                <Play size={12} />
                <span>{loading ? 'Mengirim...' : 'Uji Endpoint'}</span>
              </button>
            </div>
          </div>

          {/* Code Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase">HTTP Request Path</span>
              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono text-blue-400 overflow-x-auto">
                <span>GET {window.location.origin}{activeEndpoint}</span>
              </div>
            </div>

            {/* Response Console */}
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">JSON Server Response</span>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 font-mono text-xs text-gray-300 min-h-[220px] max-h-[350px] overflow-y-auto leading-relaxed relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
                    <span className="text-xs font-bold text-gray-400 animate-pulse">Menghubungi Server Sekolah...</span>
                  </div>
                ) : null}
                <pre className="whitespace-pre-wrap">{apiResponse || '// Silakan klik tombol "Uji Endpoint" untuk melihat response data JSON aktual dari database sekolah.'}</pre>
              </div>
            </div>

            {/* Quick integration code snippet */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Integrasi Javascript Snippet</span>
              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-[10px] font-mono text-emerald-400 overflow-x-auto whitespace-pre">
                {fetchJsCode}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
