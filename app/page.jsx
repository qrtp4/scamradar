"use client";

import { useState } from "react";

export default function ScamRadar() {
  const [url, setUrl] = useState("");
  const [scanned, setScanned] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col items-center p-6">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        ScamRadar
      </h1>
      <p className="text-gray-400 mb-6 text-center">
        Проверь проект до того, как потеряешь деньги
      </p>

      <div className="flex gap-2 w-full max-w-xl">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Вставь ссылку проекта..."
          className="flex-1 p-3 rounded-xl bg-[#111827] outline-none"
        />
        <button
          onClick={() => setScanned(true)}
          className="bg-green-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          SCAN
        </button>
      </div>

      {scanned && (
        <div className="mt-10 w-full max-w-xl bg-[#111827] p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Risk Score</h2>
          <div className="text-5xl text-red-500 font-bold mb-4">78%</div>
          <ul className="text-gray-300 mb-6 space-y-2">
            <li>❌ признаки пирамиды</li>
            <li>❌ манипуляция (FOMO)</li>
            <li>❌ нет лицензии</li>
          </ul>
          <button className="w-full bg-yellow-500 text-black p-3 rounded-xl font-semibold">
            🔓 Разблокировать полный рентген — 5$
          </button>
        </div>
      )}

      {scanned && (
        <div className="mt-10 w-full max-w-3xl grid md:grid-cols-3 gap-4">
          <div className="bg-[#111827] p-4 rounded-xl">
            <h3 className="text-blue-400 mb-2">Проект говорит</h3>
            <p>"Гарантируем доход"</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-xl">
            <h3 className="text-yellow-400 mb-2">AI анализ</h3>
            <p>Зависимость от новых вкладчиков</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-xl">
            <h3 className="text-red-400 mb-2">Пользователи</h3>
            <p>Проблемы с выводом</p>
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-2">Поддержать развитие ScamRadar</p>
        <div className="flex gap-2 justify-center">
          <button className="bg-gray-700 px-4 py-2 rounded-xl">+1$</button>
          <button className="bg-gray-700 px-4 py-2 rounded-xl">+5$</button>
        </div>
      </div>
    </div>
  );
}
