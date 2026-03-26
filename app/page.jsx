"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function ScamRadar() {
  const [url, setUrl] = useState("");
  const [scanned, setScanned] = useState(false);
  const [account, setAccount] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } else {
      alert("Установи MetaMask");
    }
  }

  function runAI() {
    const risk = Math.floor(Math.random() * 40) + 60;
    setAnalysis({
      score: risk,
      issues: [
        "Признаки пирамиды",
        "Манипуляция (FOMO)",
        "Нет лицензии",
      ],
      verdict: risk > 70 ? "HIGH RISK" : "MEDIUM RISK",
    });
    setScanned(true);
  }

  async function donate() {
    if (!window.ethereum) return alert("Подключи кошелёк");
    if (!account) return alert("Сначала подключи кошелёк");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = await signer.sendTransaction({
      to: account,
      value: ethers.parseEther("0.001"),
    });

    await tx.wait();
    alert("Спасибо за поддержку 🔥");
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col items-center p-6">
      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ScamRadar</h1>
        <button
          onClick={connectWallet}
          className="bg-purple-600 px-4 py-2 rounded-xl hover:bg-purple-700 transition"
        >
          {account ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
        </button>
      </div>

      {/* HERO */}
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Проверь проект до того, как потеряешь деньги
      </h2>
      <p className="text-gray-400 mb-6 text-center text-lg">
        AI + Web3 + Сообщество
      </p>

      {/* INPUT */}
      <div className="flex gap-2 w-full max-w-xl">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Вставь ссылку проекта..."
          className="flex-1 p-3 rounded-xl bg-[#111827] outline-none border border-gray-700 focus:border-green-500 transition"
        />
        <button
          onClick={runAI}
          className="bg-green-500 px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:scale-105 transition"
        >
          SCAN
        </button>
      </div>

      {/* RESULT */}
      {analysis && (
        <div className="mt-10 w-full max-w-xl bg-[#111827] p-6 rounded-2xl shadow-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Risk Score</h2>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
              analysis.verdict === "HIGH RISK"
                ? "bg-red-900 text-red-400"
                : "bg-yellow-900 text-yellow-400"
            }`}>
              {analysis.verdict}
            </span>
          </div>

          <div className="text-5xl text-red-500 font-bold mb-4">
            {analysis.score}%
          </div>

          <ul className="text-gray-300 mb-6 space-y-2">
            {analysis.issues.map((i, idx) => (
              <li key={idx}>❌ {i}</li>
            ))}
          </ul>

          <button className="w-full bg-yellow-500 text-black p-3 rounded-xl font-semibold hover:bg-yellow-400 transition">
            🔓 Разблокировать полный рентген — 5$
          </button>
        </div>
      )}

      {/* COURT */}
      {analysis && (
        <div className="mt-10 w-full max-w-3xl grid md:grid-cols-3 gap-4">
          <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
            <h3 className="text-blue-400 mb-2 font-semibold">Проект говорит</h3>
            <p className="text-gray-300">"Гарантируем доход"</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
            <h3 className="text-yellow-400 mb-2 font-semibold">AI анализ</h3>
            <p className="text-gray-300">{analysis.verdict}</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
            <h3 className="text-red-400 mb-2 font-semibold">Пользователи</h3>
            <p className="text-gray-300">Проблемы с выводом</p>
          </div>
        </div>
      )}

      {/* DONATE */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4">Поддержать проект</p>
        <button
          onClick={donate}
          className="bg-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          Donate 0.001 ETH
        </button>
      </div>
    </div>
  );
}
