'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import type { InheritanceResult } from '@/lib/api';

type ResultsPageProps = {
  resultId?: string;
};

export default function ResultsPage({ resultId }: ResultsPageProps) {
  const [data, setData] = useState<InheritanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storageKey = resultId
        ? `inheritanceResults:${resultId}`
        : 'inheritanceResults';
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if it's a valid backend result (has required fields)
        if (parsed.total_estate !== undefined && parsed.relatives_list !== undefined) {
          setData(parsed);
        } else {
          // Old data format, clear localStorage
          localStorage.removeItem(storageKey);
          setError('Please recalculate your inheritance share');
        }
      } else {
        setError('No calculation results found');
      }
    } catch (err) {
      const storageKey = resultId
        ? `inheritanceResults:${resultId}`
        : 'inheritanceResults';
      localStorage.removeItem(storageKey);
      setError('Failed to load calculation results');
    }
  }, [resultId]);

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-2 text-emerald-600 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Calculator
          </Link>
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Note</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Go to Calculator
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-2 text-emerald-600 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Calculator
          </Link>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-600">Loading results...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inheritance Distribution Results</h1>
          <p className="text-gray-600">According to the Quran and authentic Sunnah</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estate Summary</h2>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-emerald-600">{data.currency || 'USD'}</span>
            <span className="text-5xl font-bold text-gray-900">
              {(data.total_estate ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Individual Shares */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Shares by Individual</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-50 text-left">
                  <th className="p-4 font-semibold text-gray-800 rounded-tl-lg">Relative</th>
                  <th className="p-4 font-semibold text-gray-800">Share (Common Denominator)</th>
                  <th className="p-4 font-semibold text-gray-800">Share (Simplified)</th>
                  <th className="p-4 font-semibold text-gray-800 rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data.relatives_list || []).map((share, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{share.relative_name}</td>
                    <td className="p-4 font-mono text-emerald-600">{share.share_fraction}</td>
                    <td className="p-4 font-mono text-blue-600">{share.share_fraction}</td>
                    <td className="p-4">
                      <span className="text-emerald-700 font-semibold">{data.currency || 'USD'} {(share.amount ?? 0).toLocaleString()}</span>
                      <span className="text-purple-600 text-sm ml-2">({(share.share_percentage ?? 0).toFixed(2)}%)</span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-emerald-50 font-bold">
                  <td className="p-4 text-gray-900">Total</td>
                  <td className="p-4 font-mono text-orange-600">1/1</td>
                  <td className="p-4 font-mono text-blue-600">1/1</td>
                  <td className="p-4 text-emerald-700">{data.currency || 'USD'} {(data.total_estate ?? 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Calculation Steps</h2>
          <div className="space-y-3">
            {(data.calculation_steps || []).map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Calculator Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            <ArrowLeft className="w-5 h-5" /> Calculate Another Case
          </Link>
        </div>
      </main>
    </div>
  );
}
