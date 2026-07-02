import { createContext, useContext, useState, useEffect } from 'react'

const CampusContext = createContext(null)

export const CAMPUSES = {
  BONABERI: {
    id: 'bonaberi',
    name: 'IUGET Bonaberi',
    code: 'BNB',
    location: 'Bonaberi, Douala',
    contact: '+237 (0)700 000 001',
    email: 'bonaberi@iuget.cm',
  },
  BONAMOUSSADI: {
    id: 'bonamoussadi',
    name: 'IUGET Bonamoussadi',
    code: 'BMA',
    location: 'Bonamoussadi, Douala',
    contact: '+237 (0)700 000 002',
    email: 'bonamoussadi@iuget.cm',
  },
}

/**
 * CampusContext - Manages multi-campus synchronization
 * Features:
 * - Cross-campus student/staff data sync
 * - Unified exam board across campuses
 * - Campus-specific announcements & timetables
 */
export function CampusProvider({ children }) {
  const [activeCampus, setActiveCampus] = useState(() => {
    const stored = localStorage.getItem('siarm.activeCampus')
    return stored || CAMPUSES.BONABERI.id
  })

  const [syncStatus, setSyncStatus] = useState({
    lastSync: localStorage.getItem('siarm.lastSync') || null,
    isSyncing: false,
    errors: [],
  })

  // Persist campus preference
  useEffect(() => {
    localStorage.setItem('siarm.activeCampus', activeCampus)
  }, [activeCampus])

  const switchCampus = (campusId) => {
    if (Object.values(CAMPUSES).some(c => c.id === campusId)) {
      setActiveCampus(campusId)
    }
  }

  const getCurrentCampus = () => {
    return Object.values(CAMPUSES).find(c => c.id === activeCampus)
  }

  const syncCampusData = async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true, errors: [] }))
    try {
      // Simulated sync - in production, call backend API
      // POST /api/campus/sync with current campus data
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const timestamp = new Date().toISOString()
      localStorage.setItem('siarm.lastSync', timestamp)
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSync: timestamp,
      }))
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        errors: [...prev.errors, error.message],
      }))
    }
  }

  const getCampusStudents = () => {
    // In production: fetch from /api/campus/{campusId}/students
    const mockData = {
      bonaberi: [
        { id: 's1', name: 'Alice Kamga', email: 'alice@iuget.cm', matric: 'BNB-2024-001' },
        { id: 's2', name: 'Bob Tala', email: 'bob@iuget.cm', matric: 'BNB-2024-002' },
      ],
      bonamoussadi: [
        { id: 's3', name: 'Carol Mbia', email: 'carol@iuget.cm', matric: 'BMA-2024-001' },
        { id: 's4', name: 'David Nkondo', email: 'david@iuget.cm', matric: 'BMA-2024-002' },
      ],
    }
    return mockData[activeCampus] || []
  }

  const getCampusStaff = () => {
    // In production: fetch from /api/campus/{campusId}/staff
    const mockData = {
      bonaberi: [
        { id: 'st1', name: 'Dr. Ekema', role: 'HOD CS', campus: 'bonaberi' },
        { id: 'st2', name: 'Prof. Ndelle', role: 'Principal', campus: 'bonaberi' },
      ],
      bonamoussadi: [
        { id: 'st3', name: 'Dr. Tchuente', role: 'HOD Eng', campus: 'bonamoussadi' },
        { id: 'st4', name: 'Prof. Moussa', role: 'Vice-Principal', campus: 'bonamoussadi' },
      ],
    }
    return mockData[activeCampus] || []
  }

  return (
    <CampusContext.Provider
      value={{
        activeCampus,
        switchCampus,
        getCurrentCampus,
        CAMPUSES,
        syncStatus,
        syncCampusData,
        getCampusStudents,
        getCampusStaff,
      }}
    >
      {children}
    </CampusContext.Provider>
  )
}

export const useCampus = () => {
  const ctx = useContext(CampusContext)
  if (!ctx) throw new Error('useCampus must be used inside <CampusProvider>')
  return ctx
}
