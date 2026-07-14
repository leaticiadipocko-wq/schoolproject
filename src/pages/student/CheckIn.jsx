import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { MOCK_COURSES, TIMETABLE_TRACKS, SPECIALTIES } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import { Camera, QrCode, Clock, CheckCircle2, XCircle, AlertCircle, LogIn, LogOut } from 'lucide-react'

export default function StudentCheckIn() {
  const { user } = useAuth()
  const { submitAttendance, timetable } = useData()
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [currentClass, setCurrentClass] = useState(null)
  const [checkInStatus, setCheckInStatus] = useState(null) // 'checked-in' | 'checked-out' | null
  const [error, setError] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Determine current class based on timetable and current time
  useEffect(() => {
    if (!user?.studentId) return
    const now = new Date()
    const day = now.toLocaleDateString('en-US', { weekday: 'long' })
    const time = now.toTimeString().slice(0, 5) // HH:MM
    const studentSpecialty = user.specialty || 'SWE'
    const studentTrack = user.track || 'bachelor-evening'

    const track = TIMETABLE_TRACKS[studentTrack]
    if (!track) return

    // Find current slot
    const allSlots = [
      ...track.weekdaySlots.map(t => ({ time: t, dayType: 'weekday' })),
      ...(track.saturdaySlots || []).map(t => ({ time: t, dayType: 'saturday' }))
    ]

    const currentSlot = allSlots.find(slot => {
      const [start] = slot.time.split(' - ')
      return start <= time && time < slot.time.split(' - ')[1]
    })

    if (currentSlot) {
      const todaysSlots = timetable.filter(t =>
        t.day === day &&
        t.time === currentSlot.time &&
        (t.specialty === studentSpecialty || t.specialty === 'All')
      )
      if (todaysSlots.length > 0) {
        setCurrentClass(todaysSlots[0])
      }
    }
  }, [user, timetable])

  // Start camera for QR scanning (simplified - uses manual entry as fallback)
  const startScanner = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setScanning(true)
        // Simplified: auto-stop after 30 seconds or use manual button
        setTimeout(() => {
          if (scanning) stopScanner()
        }, 30000)
      }
    } catch (err) {
      setError('Camera access denied. Use "Manual Check-In" below.')
    }
  }

  const stopScanner = () => {
    setScanning(false)
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const checkInOut = async (qrData) => {
    if (!user?.uid) return

    const action = checkInStatus === 'checked-in' ? 'check-out' : 'check-in'
    const now = new Date()

    try {
      // Call attendance API with student self check-in
      await submitAttendance({
        course: qrData.course,
        date: now.toISOString().slice(0, 10),
        period: qrData.period,
        presentIds: [user.uid],
        totalStudents: 1,
        lecturerId: qrData.lecturerId,
        selfCheckIn: true,
        action,
        timestamp: now.toISOString()
      })

      setCheckInStatus(action === 'check-in' ? 'checked-in' : 'checked-out')
      setScanResult({ ...qrData, action })
    } catch (err) {
      setError('Failed to record attendance. Please try again.')
    }
  }

  // Manual check-in fallback (if camera fails)
  const manualCheckIn = () => {
    if (!currentClass) return
    handleScanResult(JSON.stringify({
      type: 'attendance',
      course: currentClass.course,
      period: currentClass.time,
      lecturerId: currentClass.lecturer
    }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Check-In"
        subtitle="Scan the QR code displayed by your lecturer to mark your attendance"
      />

      {/* Current Class Info */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
            {currentClass ? <CheckCircle2 size={24} className="text-brand-600" /> : <Clock size={24} className="text-amber-600" />}
          </div>
          <div className="flex-1">
            {currentClass ? (
              <>
                <h3 className="font-display font-bold">{currentClass.course}</h3>
                <p className="text-sm text-ink-500">
                  {currentClass.time} · {SPECIALTIES[currentClass.specialty]?.name || currentClass.specialty}
                  {currentClass.lecturer && ` · Dr. ${currentClass.lecturer}`}
                  {currentClass.room && ` · Room ${currentClass.room}`}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-display font-bold">No active class</h3>
                <p className="text-sm text-ink-500">No scheduled class at this time. Check your timetable.</p>
              </>
            )}
          </div>
          {currentClass && checkInStatus === 'checked-in' && (
            <span className="badge-success flex items-center gap-1">
              <CheckCircle2 size={12} /> Checked In
            </span>
          )}
          {currentClass && checkInStatus === 'checked-out' && (
            <span className="badge-info flex items-center gap-1">
              <LogOut size={12} /> Checked Out
            </span>
          )}
        </div>
      </div>

      {/* QR Scanner */}
      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <QrCode size={20} className="text-brand-600" />
          Scan Lecturer's QR Code
        </h3>

        <div className="relative aspect-video max-w-md mx-auto rounded-xl overflow-hidden bg-ink-900">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white p-4">
              <QrCode size={64} className="text-white/30" />
              <button onClick={startScanner} className="btn-primary px-6 py-3 text-lg">
                <Camera size={20} className="mr-2" /> Start Scanner
              </button>
              <p className="text-sm text-white/60 text-center">Point camera at the QR code on the lecturer's screen</p>
            </div>
          )}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-brand-400 rounded-lg relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-brand-400 rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-brand-400 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-brand-400 rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-brand-400 rounded-br-lg" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="mt-4 text-center">
          <button onClick={manualCheckIn} disabled={!currentClass || scanning} className="btn-secondary">
            <LogIn size={16} className="mr-2" /> Manual Check-In (Current Class)
          </button>
        </div>
      </div>

      {/* Check-in Result */}
      {scanResult && (
        <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              {scanResult.action === 'check-in' ? <LogIn size={24} className="text-emerald-600" /> : <LogOut size={24} className="text-emerald-600" />}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-emerald-900">
                {scanResult.action === 'check-in' ? 'Successfully Checked In!' : 'Checked Out'}
              </h3>
              <p className="text-sm text-emerald-700 mt-1">
                {scanResult.course} · {scanResult.period} · {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Attendance History */}
      <div className="card">
        <h3 className="font-display font-bold text-lg mb-4">Today's Attendance</h3>
        <div className="space-y-2">
          {/* This would show the student's check-ins for today */}
          <p className="text-sm text-ink-500 text-center py-4">Your check-in history will appear here</p>
        </div>
      </div>
    </div>
  )
}