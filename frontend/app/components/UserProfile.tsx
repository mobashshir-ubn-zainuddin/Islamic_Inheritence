'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

interface SavedCalculation {
  id: number;
  estate_value: number;
  relatives: any[];
  result: any;
  created_at: string;
  notes?: string;
}

export const UserProfile: React.FC = () => {
  const { user, token, logout, updateProfile } = useAuth();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [language, setLanguage] = useState(user?.language_preference || 'en');

  useEffect(() => {
    if (token) {
      loadCalculations();
    }
  }, [token]);

  const loadCalculations = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/auth/calculations/history',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCalculations(response.data);
    } catch (error) {
      console.error('Failed to load calculations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(fullName, language);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const deleteCalculation = async (calcId: number) => {
    try {
      await axios.delete(
        `http://localhost:8000/auth/calculations/history/${calcId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCalculations(calculations.filter((c) => c.id !== calcId));
    } catch (error) {
      console.error('Failed to delete calculation:', error);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Not logged in</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--border)]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--primary)]">{user.full_name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-light)] transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
        )}

        {editMode && (
          <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 px-3 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-light)]"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 px-3 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Calculations History */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--border)]">
        <h3 className="text-xl font-bold text-[var(--primary)] mb-4">Saved Calculations</h3>

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : calculations.length === 0 ? (
          <p className="text-gray-600">No saved calculations yet</p>
        ) : (
          <div className="space-y-3">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="p-4 bg-gray-50 rounded-md border border-[var(--border)] flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-medium">Estate: Rs. {calc.estate_value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(calc.created_at).toLocaleDateString()}
                  </p>
                  {calc.notes && <p className="text-sm text-gray-700 mt-2">{calc.notes}</p>}
                </div>
                <button
                  onClick={() => deleteCalculation(calc.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
