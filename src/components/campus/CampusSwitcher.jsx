import { useState } from 'react'
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react'
import { useCampus } from '@/context/CampusContext'
import toast from 'react-hot-toast'

/**
 * CampusSwitcher - Multi-campus synchronization component
 * Features:
 * - Campus switching
 * - Real-time sync status
 * - Cross-campus data visibility
 */
export default function CampusSwitcher() {
  const { activeCampus, switchCampus, CAMPUSES, syncStatus, syncCampusData } = useCampus()
  const [showSync, setShowSync] = useState(false)

  const handleSwitchCampus = (campusId) => {
    switchCampus(campusId)
    toast.success(`Switched to ${CAMPUSES[campusId.toUpperCase()]?.name || campusId}`)
  }

  const handleManualSync = async () => {
    await syncCampusData()
    toast.success('Campus data synchronized')
  }

  const currentCampus = Object.values(CAMPUSES).find(c => c.id === activeCampus)

  return (
    <div className="space-y-3">
      {/* Current Campus */}
      <div className="bg-white rounded-lg p-4 border border-ink-200 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-brand-600" />
            <span className="font-medium text-ink-900">Active Campus</span>
          </div>
          <span className="px-2 py-1 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full">
            {currentCampus?.code}
          </span>
        </div>
        <p className="text-ink-700 font-semibold">{currentCampus?.name}</p>
        <p className="text-sm text-ink-500">{currentCampus?.location}</p>
        <p className="text-xs text-ink-400 mt-1">{currentCampus?.contact}</p>
      </div>

      {/* Sync Status */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Sync Status</span>
        </div>
        {syncStatus.lastSync ? (
          <p className="text-xs text-blue-700">
            Last synced: {new Date(syncStatus.lastSync).toLocaleTimeString()}
          </p>
        ) : (
          <p className="text-xs text-blue-600">Never synced</p>
        )}
        {syncStatus.errors.length > 0 && (
          <p className="text-xs text-red-600 mt-1">
            {syncStatus.errors.length} sync errors
          </p>
        )}
      </div>

      {/* Sync Button */}
      <button
        onClick={handleManualSync}
        disabled={syncStatus.isSyncing}
        className="w-full btn btn-secondary flex items-center justify-center gap-2"
      >
        <RefreshCw size={16} className={syncStatus.isSyncing ? 'animate-spin' : ''} />
        {syncStatus.isSyncing ? 'Synchronizing...' : 'Sync Now'}
      </button>

      {/* Campus Selector */}
      <div>
        <p className="text-sm font-medium text-ink-700 mb-2">Switch Campus</p>
        <div className="space-y-2">
          {Object.values(CAMPUSES).map(campus => (
            <button
              key={campus.id}
              onClick={() => handleSwitchCampus(campus.id)}
              className={`w-full p-3 rounded-lg border-2 transition ${
                activeCampus === campus.id
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-ink-200 hover:border-brand-300 hover:bg-ink-50'
              }`}
            >
              <p className="font-medium text-ink-900 text-sm">{campus.name}</p>
              <p className="text-xs text-ink-500">{campus.location}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
