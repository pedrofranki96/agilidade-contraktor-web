import React, { useState } from 'react';

const API_URL = 'https://agilidade-api.phbf.com.br/api/integrar';

const EMPRESAS = [
  { numero: 1, cnpj: "05.411.783/0001-10 Agilidade" },
  { numero: 2, cnpj: "03.913.756/0001-10 Kr do Brasil" },
  { numero: 3, cnpj: "10.233.951/0001-64 Renova Clean" },
  { numero: 4, cnpj: "04.699.076/0001-08 Renova JR" },
];

const App: React.FC = () => {
  const [link, setLink] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(1);
  const [numCad, setNumCad] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Extrai o ID do contrato da URL
      const match = link.match(/\/contratos\/(\d+)/);
      if (!match) {
        throw new Error('URL inválida. Certifique-se de usar o formato correto.');
      }
      const id = match[1];

      const payload: any = { id, numEmp: selectedEmpresa.toString() };
      if (numCad.trim()) {
        payload.numCad = numCad.trim();
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Integração Agilidade Contraktor</h1>
        
        <div className="mb-4">
          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar Empresa
          </label>
          <select
            id="empresa"
            value={selectedEmpresa}
            onChange={(e) => setSelectedEmpresa(Number(e.target.value))}
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {EMPRESAS.map((empresa) => (
              <option key={empresa.numero} value={empresa.numero}>
                {empresa.cnpj} 
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="numCad" className="block text-sm font-medium text-gray-700 mb-2">
            Número de Cadastro
          </label>
          <input
            id="numCad"
            type="text"
            value={numCad}
            onChange={(e) => setNumCad(e.target.value)}
            placeholder="Digite o número de cadastro"
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
            Link do Contrato
          </label>
          <input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Cole o link do contrato"
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>

        {result && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            <div>Numero do contrato: {result.contratoId}</div>
            <div>Numero de cadastro: {result.numCad}</div>
            <div>{result.pisValido? 'PIS valido' : 'PIS invalido'}</div>
          </pre>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default App; 