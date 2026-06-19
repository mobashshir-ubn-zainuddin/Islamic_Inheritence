'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // If no ID, check localStorage
    const storedResults = localStorage.getItem('inheritanceResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      setError('No results found. Please calculate inheritance first.')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">II</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Islamic Inheritance Calculator</h1>
            </div>
            <nav className="flex gap-4">
              <Link 
                href="/"
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Inheritance Distribution Results
          </h2>
          <p className="text-gray-600">
            According to the Qur'an and authentic Sunnah
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <Link 
              href="/"
              className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to Calculator
            </Link>
          </div>
        )}

        {results && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Relatives List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Distribution</h3>
              <div className="space-y-4">
                {results.relatives_list.map((relative: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-bold text-lg">
                          {relative.relative_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{relative.relative_name}</h4>
                        <p className="text-sm text-gray-600">Share: {relative.share_fraction}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {relative.share_percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation Steps */}
            {results.calculation_steps && results.calculation_steps.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">Calculation Steps</h3>
                <ol className="list-decimal list-inside space-y-3">
                  {results.calculation_steps.map((step: string, index: number) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-black">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Back Button */}
            <div className="text-center">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-md"
              >
                ← Back to Calculator
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
