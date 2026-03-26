"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function ScamRadar() {
  const [url, setUrl] = useState("");
  const [account, setAccount] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) return alert("Установи MetaMask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (e) {
      console.error(e);
      alert("Не удалось подключить кошелёк");
    }
  }

  async function runAI() {
    if (!url.startsWith("http")) return alert("Вставь корректную ссылку");
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка анализа");
    } finally {
      setLoading(false);
    }
  }

  async function donate() {
    if (!window.ethereum) return alert("Подключи кошелёк");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xC8a04602D76A748e66d9303c7182b1b7EB80cd47",
        value: ethers.parseEther("0.001"),
      });
      await tx.wait();
      alert("Спасибо за поддержку 🔥");
    } catch (e) {
      console.error(e);
      alert("Ошибка транзакции");
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col items-center p-6">
      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ScamRadar</h1>
        <button onClick={connectWallet} className="bg-purple-600 px-4 py-2 rounded-xl">
          {account ? account.slice(0, 6) + "..." : "Connect Wallet"}
        </button>
      </div>

      {/* HERO */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Проверь проект до того, как потеряешь деньги
      </h1>
      <p className="text-gray-400 mb-6 text-center">AI + Web3 + Сообщество</p>

      {/* INPUT */}
      <div className="flex gap-2 w-full max-w-xl">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Вставь ссылку проекта..."
          className="flex-1 p-3 rounded-xl bg-[#111827] outline-none"
          onKeyDown={(e) => e.key === "Enter" && runAI()}
        />
        <button
          onClick={runAI}
          disabled={loading}
          className="bg-green-500 px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ ..." : "SCAN"}
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-10 text-gray-400 text-lg animate-pulse">
          🤖 AI анализирует сайт...
        </div>
      )}

      {/* RESULT */}
      {analysis && !analysis.error && (
        <div className="mt-10 w-full max-w-xl bg-[#111827] p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Risk Score</h2>
          <div className={`text-5xl font-bold mb-4 ${
            analysis.score >= 70 ? "text-red-500" : analysis.score >= 40 ? "text-yellow-400" : "text-green-400"
          }`}>
            {analysis.score}%
          </div>
          <ul className="text-gray-300 mb-6 space-y-2">
            {analysis.issues?.map((i, idx) => (
              <li key={idx}>❌ {i}</li>
            ))}
          </ul>
          {analysis.explanation && (
            <p className="text-gray-400 text-sm mb-4">{analysis.explanation}</p>
          )}
          <button className="w-full bg-yellow-500 text-black p-3 rounded-xl">
            🔓 Разблокировать полный рентген — 5$
          </button>
        </div>
      )}

      {/* ERROR */}
      {analysis?.error && (
        <div className="mt-10 bg-red-900 text-red-300 p-4 rounded-xl">
          ⚠️ {analysis.error}
        </div>
      )}

      {/* COURT */}
      {analysis && !analysis.error && (
        <div className="mt-10 w-full max-w-3xl grid md:grid-cols-3 gap-4">
          <div className="bg-[#111827] p-4 rounded-xl">
            <h3 className="text-blue-400">Проект говорит</h3>
            <p>"Гарантируем доход"</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-xl">
            <h3 className="text-yellow-400">AI анализ</h3>
            <p>{analysis.verdict}</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-xl">
            <h3 className="text-red-400">Пользователи</h3>
            <p>Проблемы с выводом</p>
          </div>
        </div>
      )}

      {/* DONATE */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-2">Поддержать проект</p>
        <button onClick={donate} className="bg-purple-600 px-6 py-3 rounded-xl">
          Donate 0.001 ETH
        </button>
      </div>
    </div>
  );
}
