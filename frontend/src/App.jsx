import { useEffect, useMemo, useState } from 'react'

const iconPaths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  tooth: '<path d="M12 5.1c2.1 0 4.2-2 6.3-.7 3.9 2.4 1.5 8.2.3 11.2-.9 2.2-1.3 5.4-3.2 5.4-1.8 0-1.5-6-3.4-6s-1.6 6-3.4 6c-1.9 0-2.3-3.2-3.2-5.4C4.2 12.6 1.8 6.8 5.7 4.4 7.8 3.1 9.9 5.1 12 5.1Z"/>',
  wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v11a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3V6"/><path d="M16 13h5v4h-5a2 2 0 0 1 0-4Z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  chart: '<path d="M3 3v18h18M7 16l4-5 4 3 5-7"/>',
  staff: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 8h6M20 5v6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM13.7 21a2 2 0 0 1-3.4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="m9 18 6-6-6-6"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  userplus: '<path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M16 11h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  dots: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
}

function Icon({ name, size = 20, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: iconPaths[name] || iconPaths.grid }} />
}

const permissionOptions = [
  ['patients', 'Пациенты'], ['calendar', 'Расписание'], ['treatment', 'Лечение'],
  ['finance', 'Финансы'], ['documents', 'Документы'], ['reports', 'Отчеты'],
  ['staff', 'Сотрудники'], ['settings', 'Настройки'],
]

const roleOptions = ['Супер-администратор', 'Директор', 'Заместитель директора', 'Администратор', 'Врач', 'Бухгалтер']

const permissionsByRole = {
  'Супер-администратор': permissionOptions.map(([key]) => key),
  'Директор': permissionOptions.map(([key]) => key),
  'Заместитель директора': permissionOptions.map(([key]) => key),
  'Администратор': ['patients', 'calendar', 'treatment', 'documents'],
  'Врач': ['patients', 'calendar', 'treatment', 'documents'],
  'Бухгалтер': ['patients', 'finance', 'reports'],
}

const initialDirector = { id: 100, name: 'Ислам Парчиев', initials: 'ИП', role: 'Директор', specialty: 'Руководитель клиники', phone: '+7 900 000-00-01', email: 'director@dentaplus.ru', active: true, color: 'navy', permissions: permissionsByRole['Директор'], isDirector: true }

const initialStaff = [
  { id: 1, name: 'Михаил Орлов', initials: 'МО', color: 'blue', role: 'Врач', specialty: 'Стоматолог-терапевт', phone: '+7 916 201-10-10', email: 'orlov@dentaplus.ru', active: true, permissions: permissionsByRole['Врач'] },
  { id: 2, name: 'Ирина Белова', initials: 'ИБ', color: 'pink', role: 'Врач', specialty: 'Ортодонт', phone: '+7 916 202-20-20', email: 'belova@dentaplus.ru', active: true, permissions: permissionsByRole['Врач'] },
  { id: 3, name: 'Андрей Титов', initials: 'АТ', color: 'orange', role: 'Врач', specialty: 'Хирург-имплантолог', phone: '+7 916 203-30-30', email: 'titov@dentaplus.ru', active: true, permissions: permissionsByRole['Врач'] },
  { id: 4, name: 'Елена Волкова', initials: 'ЕВ', color: 'teal', role: 'Администратор', specialty: 'Старший администратор', phone: '+7 916 204-40-40', email: 'volkova@dentaplus.ru', active: true, permissions: permissionsByRole['Администратор'] },
  initialDirector,
]

const initialPatients = [
  { id: 1, card: 'P-00001', name: 'Мария Кузнецова', initials: 'МК', phone: '+7 916 555-14-20', email: 'm.kuznetsova@mail.ru', birth: '17.04.1991', age: 35, lastVisit: 'Сегодня, 09:00', visits: 12, debt: 7400, color: 'blue', allergy: 'Лидокаин' },
  { id: 2, card: 'P-00002', name: 'Алексей Смирнов', initials: 'АС', phone: '+7 903 122-87-41', email: 'a.smirnov@mail.ru', birth: '02.11.1985', age: 40, lastVisit: 'Сегодня, 10:30', visits: 8, debt: 0, color: 'green', allergy: '' },
  { id: 3, card: 'P-00003', name: 'София Лебедева', initials: 'СЛ', phone: '+7 925 448-10-33', email: 'sofia.l@mail.ru', birth: '29.07.2000', age: 25, lastVisit: 'Сегодня, 12:00', visits: 4, debt: 0, color: 'pink', allergy: '' },
  { id: 4, card: 'P-00004', name: 'Дмитрий Попов', initials: 'ДП', phone: '+7 910 372-45-65', email: 'd.popov@mail.ru', birth: '13.01.1978', age: 48, lastVisit: 'Сегодня, 14:30', visits: 17, debt: 12300, color: 'orange', allergy: 'Пенициллин' },
  { id: 5, card: 'P-00005', name: 'Полина Власова', initials: 'ПВ', phone: '+7 926 403-32-78', email: 'p.vlasova@mail.ru', birth: '06.06.1996', age: 29, lastVisit: '31 июля 2026', visits: 3, debt: 0, color: 'purple', allergy: '' },
  { id: 6, card: 'P-00006', name: 'Сергей Морозов', initials: 'СМ', phone: '+7 985 211-09-44', email: 'morozov.s@mail.ru', birth: '24.09.1982', age: 43, lastVisit: '29 июля 2026', visits: 21, debt: 4200, color: 'teal', allergy: '' },
]

const initialAppointments = [
  { id: 1, time: '09:00', end: '10:00', patientId: 1, patient: 'Мария Кузнецова', initials: 'МК', type: 'Профилактический осмотр', doctor: 'Михаил Орлов', doctorId: 1, status: 'confirmed', room: 'Кабинет 2', color: 'blue' },
  { id: 2, time: '10:30', end: '11:30', patientId: 2, patient: 'Алексей Смирнов', initials: 'АС', type: 'Лечение кариеса', doctor: 'Михаил Орлов', doctorId: 1, status: 'progress', room: 'Кабинет 2', color: 'green' },
  { id: 3, time: '12:00', end: '12:45', patientId: 3, patient: 'София Лебедева', initials: 'СЛ', type: 'Консультация ортодонта', doctor: 'Ирина Белова', doctorId: 2, status: 'waiting', room: 'Кабинет 1', color: 'pink' },
  { id: 4, time: '14:30', end: '15:30', patientId: 4, patient: 'Дмитрий Попов', initials: 'ДП', type: 'Профессиональная гигиена', doctor: 'Михаил Орлов', doctorId: 1, status: 'confirmed', room: 'Кабинет 2', color: 'orange' },
  { id: 5, time: '16:00', end: '17:30', patientId: 5, patient: 'Полина Власова', initials: 'ПВ', type: 'Установка импланта', doctor: 'Андрей Титов', doctorId: 3, status: 'confirmed', room: 'Кабинет 3', color: 'purple' },
]

const initialInvoices = [
  { id: 'INV-0801', patient: 'Мария Кузнецова', service: 'Лечение кариеса', amount: 12400, paid: 5000, date: '01.08.2026', status: 'partial' },
  { id: 'INV-0794', patient: 'Дмитрий Попов', service: 'Профессиональная гигиена', amount: 12300, paid: 0, date: '29.07.2026', status: 'unpaid' },
  { id: 'INV-0788', patient: 'Сергей Морозов', service: 'Коронка E-max', amount: 34200, paid: 30000, date: '27.07.2026', status: 'partial' },
  { id: 'INV-0783', patient: 'София Лебедева', service: 'Консультация ортодонта', amount: 2500, paid: 2500, date: '25.07.2026', status: 'paid' },
]

const navItems = [
  ['dashboard', 'grid', 'Главная'], ['calendar', 'calendar', 'Расписание'], ['patients', 'users', 'Пациенты'], ['treatment', 'tooth', 'Лечение'], ['finance', 'wallet', 'Финансы'], ['documents', 'file', 'Документы'], ['reports', 'chart', 'Отчеты'], ['staff', 'staff', 'Сотрудники'], ['settings', 'settings', 'Настройки'],
]

const pageTitles = { calendar: ['Расписание', 'Управляйте приемами и рабочим временем'], patients: ['Пациенты', 'База пациентов вашей клиники'], treatment: ['Лечение', 'Карты лечения и медицинская история'], finance: ['Финансы', 'Счета, оплаты и задолженности'], documents: ['Документы', 'Файлы пациентов и шаблоны клиники'], reports: ['Отчеты', 'Ключевые показатели работы клиники'], staff: ['Сотрудники', 'Команда, роли и доступы'], settings: ['Настройки', 'Профиль клиники, директор и права доступа'] }

const statusMap = { confirmed: ['Подтвержден', 'success'], active: ['Активен', 'success'], inactive: ['Отключен', 'danger'], progress: ['Идет прием', 'info'], waiting: ['Ожидает', 'warning'], cancelled: ['Отменен', 'danger'], paid: ['Оплачен', 'success'], partial: ['Частично', 'warning'], unpaid: ['Не оплачен', 'danger'] }

const rub = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽'

const getInitials = name => name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()
const readStored = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback } }
const toInputDate = value => { if (!value) return ''; const parts = value.split('.'); return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value }
const toDisplayDate = value => { if (!value) return ''; const parts = value.split('-'); return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : value }
const getAge = value => { const iso = toInputDate(value); if (!iso) return 0; const birth = new Date(`${iso}T00:00:00`); const now = new Date(); let age = now.getFullYear() - birth.getFullYear(); if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--; return Math.max(age, 0) }

function Avatar({ initials, color = 'blue', size = 'md' }) { return <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span> }

function Status({ value }) {
  const [label, tone] = statusMap[value] || [value, 'neutral']
  return <span className={`status status-${tone}`}><i />{label}</span>
}

function Login({ onLogin, director }) {
  const [loading, setLoading] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const [sent, setSent] = useState(false)
  const submit = e => { e.preventDefault(); setLoading(true); if (recovering) setTimeout(() => { setLoading(false); setSent(true) }, 550); else setTimeout(onLogin, 550) }
  return <main className="login-page">
    <section className="login-brand">
      <div className="login-brand-inner">
        <Logo large />
        <h1>Забота о пациентах.<br/>Порядок в клинике.</h1>
        <p>Единое пространство для расписания, лечения, команды и финансов стоматологии.</p>
        <div className="login-quote"><div className="quote-mark">“</div><p>Теперь вся клиника работает в одном ритме — от первого звонка до завершения лечения.</p><span>{director.name} · директор клиники</span></div>
      </div>
      <div className="brand-orbit orbit-one"/><div className="brand-orbit orbit-two"/>
    </section>
    <section className="login-form-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="mobile-login-logo"><Logo dark /></div>
        {recovering ? <>
          <span className="eyebrow">Безопасность аккаунта</span>
          <h2>Восстановление пароля</h2>
          <p className="muted">Укажите email — мы отправим одноразовую ссылку для смены пароля</p>
          {sent ? <div className="recovery-success"><span><Icon name="mail"/></span><h3>Проверьте почту</h3><p>Если аккаунт существует, письмо с инструкцией уже отправлено.</p></div> : <label>Email<input key="recovery-email" type="email" required placeholder="name@clinic.ru" autoComplete="email"/></label>}
          {!sent && <button className="button primary login-button" disabled={loading}>{loading ? <span className="spinner"/> : 'Отправить ссылку'}</button>}
          <button type="button" className="back-login" onClick={() => { setRecovering(false); setSent(false) }}>← Вернуться ко входу</button>
        </> : <>
          <span className="eyebrow">С возвращением</span>
          <h2>Войдите в Dental CRM</h2>
          <p className="muted">Используйте рабочую учетную запись клиники</p>
          <label>Логин или email<input key="login-username" defaultValue="director" autoComplete="username" /></label>
          <label>Пароль<div className="password-input"><input type="password" defaultValue="demo1234" autoComplete="current-password"/><button type="button" aria-label="Показать пароль">◉</button></div></label>
          <div className="login-row"><label className="checkbox"><input type="checkbox" defaultChecked/><span/>Запомнить меня</label><button type="button" className="link-button" onClick={() => setRecovering(true)}>Забыли пароль?</button></div>
          <button className="button primary login-button" disabled={loading}>{loading ? <span className="spinner"/> : 'Войти в систему'}</button>
          <div className="demo-hint"><Icon name="check" size={17}/><span><b>Демо-доступ заполнен.</b> Просто нажмите «Войти».</span></div>
        </>}
        <p className="privacy">Продолжая, вы принимаете условия использования и политику конфиденциальности</p>
      </form>
    </section>
  </main>
}

function Logo({ large = false, dark = false }) {
  return <div className={`logo ${large ? 'logo-large' : ''} ${dark ? 'logo-dark' : ''}`}><span className="logo-mark"><Icon name="tooth" size={large ? 29 : 23}/><b>+</b></span><span><strong>Dental</strong><small>CRM</small></span></div>
}

function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('dental-demo') === '1')
  const [page, setPage] = useState('dashboard')
  const [patients, setPatients] = useState(() => readStored('dental-patients', initialPatients))
  const [appointments, setAppointments] = useState(() => readStored('dental-appointments', initialAppointments))
  const [invoices, setInvoices] = useState(() => readStored('dental-invoices', initialInvoices))
  const [staff, setStaff] = useState(() => readStored('dental-staff-v2', initialStaff))
  const [director, setDirector] = useState(() => readStored('dental-director-v2', initialDirector))
  const [modal, setModal] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('dental-patients', JSON.stringify(patients)), [patients])
  useEffect(() => localStorage.setItem('dental-appointments', JSON.stringify(appointments)), [appointments])
  useEffect(() => localStorage.setItem('dental-invoices', JSON.stringify(invoices)), [invoices])
  useEffect(() => localStorage.setItem('dental-staff-v2', JSON.stringify(staff)), [staff])
  useEffect(() => localStorage.setItem('dental-director-v2', JSON.stringify(director)), [director])

  const showToast = message => { setToast(message); setTimeout(() => setToast(''), 2600) }
  const login = () => { sessionStorage.setItem('dental-demo', '1'); setLoggedIn(true) }
  const logout = () => { sessionStorage.removeItem('dental-demo'); setLoggedIn(false) }
  const doctors = useMemo(() => staff.filter(employee => employee.role === 'Врач' && employee.active), [staff])
  const addPatient = patient => { setPatients(prev => [{ ...patient, id: Date.now(), card: `P-${String(Math.max(0, ...prev.map(item => Number(item.card?.replace(/\D/g, '')) || 0)) + 1).padStart(5, '0')}`, initials: getInitials(patient.name), birth: toDisplayDate(patient.birth), age: getAge(patient.birth), visits: 0, debt: 0, lastVisit: 'Еще не было', color: 'teal' }, ...prev]); setModal(null); showToast('Карточка пациента создана') }
  const updatePatient = patient => { const previous = patients.find(item => item.id === patient.id); const updated = { ...patient, initials: getInitials(patient.name), birth: toDisplayDate(patient.birth), age: getAge(patient.birth) }; setPatients(prev => prev.map(item => item.id === patient.id ? updated : item)); setAppointments(prev => prev.map(item => item.patientId === patient.id ? { ...item, patient: updated.name, initials: updated.initials } : item)); if (previous) setInvoices(prev => prev.map(item => item.patient === previous.name ? { ...item, patient: updated.name } : item)); setSelectedPatient(null); setModal(null); showToast('Карта пациента обновлена') }
  const deletePatient = patient => { if (!window.confirm(`Удалить пациента «${patient.name}»? Приемы этого пациента также будут удалены.`)) return; setPatients(prev => prev.filter(item => item.id !== patient.id)); setAppointments(prev => prev.filter(item => item.patientId !== patient.id)); setInvoices(prev => prev.filter(item => item.patient !== patient.name)); setSelectedPatient(null); setModal(null); showToast('Пациент удален') }
  const saveStaff = employee => { const normalized = { ...employee, initials: getInitials(employee.name), permissions: employee.permissions?.length ? employee.permissions : permissionsByRole[employee.role] || [] }; setStaff(prev => prev.some(item => item.id === employee.id) ? prev.map(item => item.id === employee.id ? normalized : item) : [...prev, { ...normalized, id: Date.now(), color: ['blue', 'pink', 'orange', 'teal', 'purple'][prev.length % 5] }]); if (employee.isDirector) setDirector(normalized); setModal(null); showToast(employee.id ? 'Профиль сотрудника обновлен' : 'Сотрудник добавлен') }
  const saveDirector = data => { const updated = { ...director, ...data, role: 'Директор', initials: getInitials(data.name), isDirector: true }; setDirector(updated); setStaff(prev => prev.some(item => item.isDirector) ? prev.map(item => item.isDirector ? updated : item) : [...prev, updated]); setModal(null); showToast('Данные директора и права сохранены') }
  const addAppointment = appointment => { const patient = patients.find(p => p.id === Number(appointment.patientId)); const doctor = doctors.find(d => d.id === Number(appointment.doctorId)); if (!patient || !doctor) { showToast('Выберите пациента и врача'); return } setAppointments(prev => [...prev, { ...appointment, id: Date.now(), patient: patient.name, initials: patient.initials, doctor: doctor.name, status: 'confirmed', color: patient.color }].sort((a,b) => a.time.localeCompare(b.time))); setModal(null); showToast('Пациент записан на прием') }
  const payInvoice = ({ id, amount }) => { setInvoices(prev => prev.map(i => i.id === id ? { ...i, paid: Math.min(i.amount, i.paid + Number(amount)), status: i.paid + Number(amount) >= i.amount ? 'paid' : 'partial' } : i)); setModal(null); showToast('Оплата успешно принята') }
  const searchResults = search.trim().length > 1 ? patients.filter(p => `${p.name} ${p.phone} ${p.card}`.toLowerCase().includes(search.toLowerCase())).slice(0,5) : []

  if (!loggedIn) return <Login onLogin={login} director={director}/>
  const [title, subtitle] = page === 'dashboard' ? [`Добрый день, ${director.name.split(' ')[0]}!`, 'Вот что происходит в клинике сегодня'] : pageTitles[page]
  const headingAction = page === 'patients' ? { label: 'Новый пациент', action: () => setModal('patient') } : page === 'staff' ? { label: 'Добавить сотрудника', action: () => setModal({ type: 'staff' }) } : ['dashboard', 'calendar'].includes(page) ? { label: 'Новая запись', action: () => setModal('appointment') } : null
  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <nav>{navItems.map(([key, icon, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon name={icon}/><span>{label}</span>{key === 'finance' && <em>3</em>}</button>)}</nav>
      <div className="sidebar-help"><span><Icon name="tooth" size={18}/></span><b>Нужна помощь?</b><p>Мы на связи каждый день</p><button>Центр поддержки</button></div>
      <button className="sidebar-profile" onClick={() => setModal({ type: 'director' })}><Avatar initials={director.initials} color="white"/><span><b>{director.name}</b><small>{director.role}</small></span><Icon name="settings" size={17}/></button>
    </aside>
    <div className="app-main">
      <header className="topbar">
        <button className="mobile-logo" onClick={() => setPage('dashboard')}><Logo dark/></button>
        <div className="global-search"><Icon name="search" size={19}/><input placeholder="Поиск пациента по имени, телефону или карте..." value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd>
          {searchResults.length > 0 && <div className="search-results">{searchResults.map(p => <button key={p.id} onClick={() => { setSelectedPatient(p); setSearch('') }}><Avatar initials={p.initials} color={p.color} size="sm"/><span><b>{p.name}</b><small>{p.card} · {p.phone}</small></span><Icon name="arrow" size={16}/></button>)}</div>}
        </div>
        <div className="top-actions"><button className="round-button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Icon name="bell"/><i/></button><button className="top-profile" onClick={() => setModal({ type: 'director' })} title="Настройки директора"><Avatar initials={director.initials} color="navy" size="sm"/><span><b>{director.name}</b><small>{director.role} · настройки</small></span></button></div>
        {notificationsOpen && <Notifications onClose={() => setNotificationsOpen(false)}/>} 
      </header>
      <main className="content">
        <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="heading-actions">{!['settings', 'staff'].includes(page) && <button className="button secondary"><Icon name="upload" size={17}/>Экспорт</button>}{headingAction && <button className="button primary" onClick={headingAction.action}><Icon name="plus" size={18}/>{headingAction.label}</button>}</div></div>
        {page === 'dashboard' && <Dashboard appointments={appointments} patients={patients} invoices={invoices} onPage={setPage} onPatient={setSelectedPatient} onAppointment={() => setModal('appointment')}/>} 
        {page === 'calendar' && <CalendarPage appointments={appointments} onNew={() => setModal('appointment')} onPatient={setSelectedPatient} patients={patients} doctors={doctors}/>} 
        {page === 'patients' && <PatientsPage patients={patients} onPatient={setSelectedPatient} onNew={() => setModal('patient')}/>} 
        {page === 'finance' && <FinancePage invoices={invoices} onPay={invoice => setModal({ type: 'payment', invoice })}/>} 
        {page === 'treatment' && <TreatmentPage appointments={appointments}/>} 
        {page === 'documents' && <DocumentsPage/>}
        {page === 'reports' && <ReportsPage doctors={doctors}/>} 
        {page === 'staff' && <StaffPage staff={staff} onEdit={employee => setModal(employee.isDirector ? { type: 'director' } : { type: 'staff', employee })}/>} 
        {page === 'settings' && <SettingsPage director={director} staff={staff} onEditDirector={() => setModal({ type: 'director' })} onEditStaff={employee => setModal({ type: 'staff', employee })} onSave={() => showToast('Настройки клиники сохранены')}/>} 
      </main>
    </div>
    <nav className="mobile-nav">{navItems.slice(0,5).map(([key, icon, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon name={icon}/><span>{label === 'Расписание' ? 'Календарь' : label}</span></button>)}</nav>
    {modal === 'patient' && <PatientForm onClose={() => setModal(null)} onSave={addPatient}/>} 
    {modal === 'appointment' && <AppointmentForm patients={patients} doctors={doctors} onClose={() => setModal(null)} onSave={addAppointment}/>} 
    {modal?.type === 'payment' && <PaymentForm invoice={modal.invoice} onClose={() => setModal(null)} onSave={payInvoice}/>} 
    {modal?.type === 'patient-edit' && <PatientForm patient={modal.patient} onClose={() => setModal(null)} onSave={updatePatient} onDelete={deletePatient}/>} 
    {modal?.type === 'staff' && <StaffForm employee={modal.employee} onClose={() => setModal(null)} onSave={saveStaff}/>} 
    {modal?.type === 'director' && <DirectorForm director={director} onClose={() => setModal(null)} onSave={saveDirector} onLogout={logout}/>} 
    {selectedPatient && <PatientDrawer patient={selectedPatient} appointments={appointments.filter(a => a.patientId === selectedPatient.id)} onClose={() => setSelectedPatient(null)} onOpenFull={() => { setModal({ type: 'patient-edit', patient: selectedPatient }); setSelectedPatient(null) }} onAppointment={() => { setSelectedPatient(null); setModal('appointment') }}/>} 
    {toast && <div className="toast"><span><Icon name="check" size={16}/></span>{toast}</div>}
  </div>
}

function Dashboard({ appointments, patients, invoices, onPage, onPatient, onAppointment }) {
  const unpaid = invoices.reduce((sum, item) => sum + item.amount - item.paid, 0)
  const cards = [
    ['Приемов сегодня', appointments.length, 'calendar', 'blue', '+2 к прошлому дню'],
    ['Новых пациентов', '24', 'userplus', 'green', '+12% за месяц'],
    ['Доход за месяц', '1,84 млн ₽', 'trend', 'purple', '+8,4% к июлю'],
    ['Задолженность', rub(unpaid), 'wallet', 'orange', '3 неоплаченных счета'],
  ]
  return <>
    <section className="stat-grid">{cards.map(([label, value, icon, color, note]) => <article className="stat-card" key={label}><div className={`stat-icon ${color}`}><Icon name={icon}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small className={color === 'orange' ? 'negative' : ''}>{note}</small></div><button><Icon name="dots"/></button></article>)}</section>
    <div className="dashboard-grid">
      <section className="panel schedule-panel">
        <div className="panel-heading"><div><h2>Расписание на сегодня</h2><p>Воскресенье, 2 августа</p></div><button className="text-button" onClick={() => onPage('calendar')}>Все расписание <Icon name="arrow" size={16}/></button></div>
        <div className="appointment-list">{appointments.slice(0,4).map(a => <button className="appointment-row" key={a.id} onClick={() => onPatient(patients.find(p => p.id === a.patientId))}><div className="appointment-time"><b>{a.time}</b><span>{a.end}</span></div><div className={`timeline-dot ${a.status}`}/><Avatar initials={a.initials} color={a.color}/><div className="appointment-person"><b>{a.patient}</b><span>{a.type}</span></div><div className="appointment-doctor"><small>Врач</small><span>{a.doctor}</span></div><Status value={a.status}/><Icon name="arrow" className="row-arrow" size={17}/></button>)}</div>
        <button className="quick-add" onClick={onAppointment}><Icon name="plus" size={18}/>Добавить прием</button>
      </section>
      <aside className="dashboard-side">
        <section className="panel occupancy-card"><div className="panel-heading"><div><h2>Загрузка клиники</h2><p>Сегодня</p></div><span className="live-dot">Онлайн</span></div><div className="occupancy-number"><strong>78%</strong><span>занято времени</span></div><div className="progress"><i style={{width:'78%'}}/></div><div className="occupancy-meta"><span><i className="teal-dot"/>14 приемов</span><span><i className="gray-dot"/>4 свободных окна</span></div></section>
        <section className="panel reminders"><div className="panel-heading"><div><h2>Ближайшие задачи</h2><p>3 требуют внимания</p></div><button><Icon name="dots"/></button></div><ul><li><span className="task-icon orange"><Icon name="phone" size={17}/></span><div><b>Подтвердить прием</b><p>София Лебедева · 12:00</p></div><small>Через 2 ч</small></li><li><span className="task-icon purple"><Icon name="file" size={17}/></span><div><b>Подписать план лечения</b><p>Дмитрий Попов</p></div><small>Сегодня</small></li><li><span className="task-icon green"><Icon name="wallet" size={17}/></span><div><b>Ожидается оплата</b><p>Счет INV-0801 · 7 400 ₽</p></div><small>До 5 авг</small></li></ul></section>
      </aside>
    </div>
    <div className="bottom-grid"><section className="panel mini-chart"><div className="panel-heading"><div><h2>Динамика выручки</h2><p>Последние 7 дней</p></div><span className="metric-up">↗ 12,5%</span></div><div className="bars">{[42,65,51,76,68,90,82].map((h,i) => <div key={i}><i style={{height:`${h}%`}} className={i === 5 ? 'peak' : ''}/><span>{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</span></div>)}</div></section><section className="panel new-patients"><div className="panel-heading"><div><h2>Новые пациенты</h2><p>На этой неделе</p></div><button className="text-button" onClick={() => onPage('patients')}>Смотреть всех <Icon name="arrow" size={16}/></button></div>{patients.slice(4,6).map(p => <button key={p.id} onClick={() => onPatient(p)}><Avatar initials={p.initials} color={p.color}/><span><b>{p.name}</b><small>{p.phone}</small></span><em>Новый</em><Icon name="arrow" size={16}/></button>)}</section></div>
  </>
}

function CalendarPage({ appointments, onNew, onPatient, patients, doctors }) {
  const [view, setView] = useState('День')
  const hours = Array.from({length:10}, (_,i) => `${String(i+9).padStart(2,'0')}:00`)
  return <section className="panel calendar-panel">
    <div className="calendar-toolbar"><div className="segmented">{['День','Неделя','Месяц'].map(v => <button className={view === v ? 'active' : ''} onClick={() => setView(v)} key={v}>{v}</button>)}</div><div className="calendar-date"><button>‹</button><b>2 августа 2026</b><button>›</button><button className="today-button">Сегодня</button></div><div className="doctor-filter"><span className="doctor-stack">{doctors.map(d => <Avatar key={d.id} initials={d.initials} color={d.color} size="xs"/>)}</span><b>Все врачи ({doctors.length})</b></div></div>
    {view === 'День' ? <div className="day-calendar"><div className="calendar-head"><span/><div><Avatar initials="МО" color="blue" size="sm"/><b>Михаил Орлов</b><small>Кабинет 2</small></div><div><Avatar initials="ИБ" color="pink" size="sm"/><b>Ирина Белова</b><small>Кабинет 1</small></div><div><Avatar initials="АТ" color="orange" size="sm"/><b>Андрей Титов</b><small>Кабинет 3</small></div></div><div className="calendar-body">{hours.map(hour => <div className="calendar-line" key={hour}><span>{hour}</span><i/><i/><i/></div>)}{appointments.map((a,i) => <button key={a.id} className={`calendar-event event-${a.color}`} style={{top:`${i * 68 + 18}px`, left:`calc(${(a.doctorId-1)*33.333 + 8.5}% + 38px)`}} onClick={() => onPatient(patients.find(p => p.id === a.patientId))}><b>{a.time} · {a.patient}</b><span>{a.type}</span><small>{a.room}</small></button>)}<button className="free-slot" style={{top:'355px',left:'calc(41.8% + 38px)'}} onClick={onNew}><Icon name="plus" size={15}/>Свободное окно</button></div></div> : <CalendarSummary view={view} appointments={appointments}/>} 
  </section>
}

function CalendarSummary({ view, appointments }) { return <div className="calendar-summary"><div className="calendar-summary-icon"><Icon name="calendar" size={34}/></div><h3>{view === 'Неделя' ? 'Неделя 3–9 августа' : 'Август 2026'}</h3><p>{appointments.length * (view === 'Неделя' ? 6 : 24)} приемов запланировано · загрузка 78%</p><div className="week-strip">{['Пн 3','Вт 4','Ср 5','Чт 6','Пт 7','Сб 8','Вс 9'].map((d,i) => <span className={i===0?'active':''} key={d}><b>{d.split(' ')[1]}</b><small>{d.split(' ')[0]}</small><i style={{height: `${30+i*7}%`}}/></span>)}</div></div> }

function PatientsPage({ patients, onPatient, onNew }) {
  const [query, setQuery] = useState('')
  const filtered = patients.filter(p => `${p.name} ${p.phone} ${p.card}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="panel table-panel"><div className="table-tools"><div className="table-search"><Icon name="search" size={18}/><input placeholder="Найти пациента..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="filter-button">Все пациенты⌄</button><span className="table-count">Всего: {patients.length}</span></div><div className="data-table patient-table"><div className="table-header"><span>Пациент</span><span>Контакты</span><span>Последний прием</span><span>Посещений</span><span>Баланс</span><span/></div>{filtered.map(p => <button className="table-row" key={p.id} onClick={() => onPatient(p)}><span className="person-cell"><Avatar initials={p.initials} color={p.color}/><span><b>{p.name}</b><small>{p.card} · {p.age} лет</small></span></span><span className="contact-cell"><b>{p.phone}</b><small>{p.email}</small></span><span><b>{p.lastVisit}</b><small>Михаил Орлов</small></span><span className="visit-count">{p.visits}</span><span className={p.debt ? 'debt' : 'clear'}>{p.debt ? `− ${rub(p.debt)}` : 'Нет долга'}</span><Icon name="dots" size={19}/></button>)}</div>{filtered.length === 0 && <Empty icon="search" title="Ничего не найдено" text="Попробуйте изменить запрос или создайте нового пациента" action="Новый пациент" onAction={onNew}/>}<div className="pagination"><span>Показано {filtered.length} из {patients.length}</span><div><button disabled>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div></div></section>
}

function FinancePage({ invoices, onPay }) {
  const monthIncome = 1842500
  const debt = invoices.reduce((s,i)=>s+i.amount-i.paid,0)
  return <><section className="finance-summary"><article><span>Доход за сегодня</span><strong>{rub(186400)}</strong><small>↗ 14% к прошлому воскресенью</small></article><article><span>Доход за август</span><strong>{rub(monthIncome)}</strong><small>68% от плана 2,7 млн ₽</small><div className="progress"><i style={{width:'68%'}}/></div></article><article className="debt-card"><span>Общая задолженность</span><strong>{rub(debt)}</strong><small>{invoices.filter(i=>i.status!=='paid').length} активных счета</small></article></section><section className="panel table-panel"><div className="panel-heading"><div><h2>Последние счета</h2><p>Все операции клиники</p></div><div className="segmented"><button className="active">Все</button><button>Ожидают</button><button>Оплачены</button></div></div><div className="data-table invoice-table"><div className="table-header"><span>Счет</span><span>Пациент / услуга</span><span>Сумма</span><span>Оплачено</span><span>Статус</span><span/></div>{invoices.map(i=><div className="table-row" key={i.id}><span><b>{i.id}</b><small>{i.date}</small></span><span><b>{i.patient}</b><small>{i.service}</small></span><span><b>{rub(i.amount)}</b></span><span><b>{rub(i.paid)}</b><small>Остаток {rub(i.amount-i.paid)}</small></span><Status value={i.status}/><span>{i.status !== 'paid' ? <button className="pay-button" onClick={()=>onPay(i)}>Принять оплату</button> : <Icon name="check" className="paid-check"/>}</span></div>)}</div></section></>
}

function TreatmentPage({ appointments }) { return <div className="treatment-grid"><section className="panel"><div className="panel-heading"><div><h2>Активные планы лечения</h2><p>Требуют продолжения</p></div><button className="text-button">Все планы <Icon name="arrow" size={16}/></button></div>{appointments.slice(0,3).map((a,i)=><div className="treatment-plan" key={a.id}><Avatar initials={a.initials} color={a.color}/><div><b>{a.patient}</b><span>{['Терапевтическое лечение','Ортодонтическая коррекция','Имплантация'][i]}</span><div className="mini-progress"><i style={{width:`${[65,30,80][i]}%`}}/></div><small>{[65,30,80][i]}% завершено</small></div><strong>{rub([28400,89000,156000][i])}</strong><Icon name="arrow" size={18}/></div>)}</section><section className="panel tooth-card"><div className="panel-heading"><div><h2>Карта зубов</h2><p>Быстрый обзор состояний</p></div></div><div className="teeth-map">{Array.from({length:16},(_,i)=><span className={i===3||i===11?'attention':i===6?'treated':''} key={i}><Icon name="tooth" size={24}/><small>{i<8?18-i:21+i-8}</small></span>)}</div><div className="teeth-legend"><span><i/>Здоров</span><span><i className="attention"/>Требует лечения</span><span><i className="treated"/>Вылечен</span></div><button className="button secondary full">Открыть карту лечения</button></section></div> }

function DocumentsPage() { const docs=[['План лечения — Кузнецова М.А.','PDF · 1,2 МБ','Сегодня, 10:14'],['Согласие на обработку данных','DOCX · 86 КБ','1 августа, 16:40'],['КТ челюсти — Смирнов А.В.','JPG · 4,8 МБ','30 июля, 11:05'],['Договор №184/26','PDF · 540 КБ','28 июля, 09:30']]; return <section className="panel"><div className="document-hero"><div><span><Icon name="upload" size={24}/></span><h3>Загрузите документы или фотографии</h3><p>PDF, Word, JPG и PNG до 25 МБ</p><button className="button primary">Выбрать файлы</button></div></div><div className="panel-heading"><div><h2>Недавние файлы</h2><p>Все документы клиники</p></div><button className="text-button">Фильтры</button></div><div className="document-grid">{docs.map((d,i)=><article key={d[0]}><span className={`file-type file-${i===2?'image':i===1?'word':'pdf'}`}><Icon name="file"/></span><div><b>{d[0]}</b><small>{d[1]}</small></div><small>{d[2]}</small><button><Icon name="dots"/></button></article>)}</div></section> }

function ReportsPage({ doctors }) { return <><div className="report-grid"><section className="panel report-chart"><div className="panel-heading"><div><h2>Выручка по месяцам</h2><p>2026 год</p></div><b className="report-total">12,4 млн ₽</b></div><div className="line-chart"><svg viewBox="0 0 700 210" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3bb5a3" stopOpacity=".25"/><stop offset="1" stopColor="#3bb5a3" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 180 C60 170 70 140 120 145 S200 100 250 120 S330 80 380 90 S470 35 520 60 S620 30 700 25 L700 210 L0 210Z"/><path className="line" d="M0 180 C60 170 70 140 120 145 S200 100 250 120 S330 80 380 90 S470 35 520 60 S620 30 700 25"/></svg><div>{['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг'].map(x=><span key={x}>{x}</span>)}</div></div></section><section className="panel doctor-report"><div className="panel-heading"><div><h2>По врачам</h2><p>Август</p></div></div>{doctors.map((d,i)=><div key={d.id}><Avatar initials={d.initials} color={d.color} size="sm"/><span><b>{d.name}</b><small>{[46,38,29][i] || 0} приемов</small></span><strong>{rub([684000,522000,438000][i] || 0)}</strong></div>)}</section></div><section className="kpi-strip"><article><span>Новых пациентов</span><strong>124</strong><small>↗ 12,4%</small></article><article><span>Повторных визитов</span><strong>73%</strong><small>↗ 4,1%</small></article><article><span>Средний чек</span><strong>8 640 ₽</strong><small>↗ 6,8%</small></article><article><span>Отмен приемов</span><strong>4,2%</strong><small className="negative">↘ 1,3%</small></article></section></> }

function StaffPage({ staff, onEdit }) { return <section className="staff-grid">{staff.map((employee,i)=><article className="panel staff-card" key={employee.id}><span className={`staff-cover cover-${i % 4}`}/><Avatar initials={employee.initials} color={employee.color || 'teal'} size="lg"/><h3>{employee.name}</h3><p>{employee.specialty || employee.role}</p><span className="role-chip">{employee.role}</span><Status value={employee.active ? 'active' : 'inactive'}/><div><span><b>{employee.role === 'Врач' ? [46,38,29][employee.id - 1] || 0 : '—'}</b><small>приемов</small></span><span><b>{employee.permissions?.length || 0}</b><small>разделов доступа</small></span></div><button className="button secondary full" onClick={() => onEdit(employee)}>Открыть профиль</button></article>)}</section> }

function SettingsPage({ director, staff, onEditDirector, onEditStaff, onSave }) {
  const [section, setSection] = useState('clinic')
  return <div className="settings-layout">
    <aside className="panel settings-nav">
      <button className={section === 'clinic' ? 'active' : ''} onClick={() => setSection('clinic')}><Icon name="tooth"/>Профиль клиники</button>
      <button className={section === 'access' ? 'active' : ''} onClick={() => setSection('access')}><Icon name="users"/>Директор и права</button>
      <button onClick={() => setSection('access')}><Icon name="staff"/>Пользователи и роли</button>
      <button><Icon name="calendar"/>Расписание работы</button><button><Icon name="bell"/>Уведомления</button><button><Icon name="wallet"/>Платежи</button><button><Icon name="file"/>Шаблоны документов</button>
    </aside>
    {section === 'clinic' ? <section className="panel settings-form"><div className="panel-heading"><div><h2>Профиль клиники</h2><p>Эта информация отображается в документах и уведомлениях</p></div></div><div className="clinic-logo-setting"><span><Icon name="tooth" size={31}/></span><div><b>Логотип клиники</b><p>PNG или JPG, не менее 512 × 512</p><button className="link-button">Загрузить новый</button></div></div><div className="form-grid"><label className="full-field">Название клиники<input defaultValue="Дента Плюс"/></label><label>Телефон<input defaultValue="+7 495 120-45-45"/></label><label>Email<input defaultValue="hello@dentaplus.ru"/></label><label className="full-field">Адрес<input defaultValue="Москва, ул. Спокойная, 12"/></label><label>Часовой пояс<select defaultValue="moscow"><option value="moscow">Москва (UTC+3)</option></select></label><label>Валюта<select defaultValue="rub"><option value="rub">Российский рубль (₽)</option></select></label></div><div className="settings-footer"><button className="button secondary">Отменить</button><button className="button primary" onClick={onSave}>Сохранить изменения</button></div></section> : <section className="panel settings-form access-settings"><div className="panel-heading"><div><h2>Директор и распределение прав</h2><p>Изменяйте данные руководителя и доступ каждого сотрудника</p></div></div><div className="director-settings-card"><Avatar initials={director.initials} color="navy" size="lg"/><span><b>{director.name}</b><small>{director.role} · {director.email}</small><em>Доступно разделов: {director.permissions.length}</em></span><button className="button secondary" onClick={onEditDirector}>Изменить директора</button></div><div className="access-section-title"><div><h3>Сотрудники и роли</h3><p>Откройте профиль, чтобы изменить роль или выдать права вручную</p></div><span>{staff.length} сотрудников</span></div><div className="settings-team-list">{staff.map(employee => <button key={employee.id} onClick={() => employee.isDirector ? onEditDirector() : onEditStaff(employee)}><Avatar initials={employee.initials} color={employee.color} size="sm"/><span><b>{employee.name}</b><small>{employee.role} · {employee.permissions?.length || 0} разделов</small></span><Status value={employee.active ? 'active' : 'inactive'}/><Icon name="arrow" size={17}/></button>)}</div></section>}
  </div>
}

function PatientDrawer({ patient, appointments, onClose, onOpenFull, onAppointment }) { return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="patient-drawer" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><button onClick={onClose}><Icon name="close"/></button><span>Карточка пациента</span><button onClick={onOpenFull} title="Редактировать"><Icon name="settings"/></button></div><div className="patient-hero"><Avatar initials={patient.initials} color={patient.color} size="xl"/><h2>{patient.name}</h2><p>{patient.card} · {patient.age} лет</p><div><button><Icon name="phone"/>Позвонить</button><button><Icon name="mail"/>Написать</button></div></div>{patient.allergy && <div className="allergy-alert"><b>Аллергия</b><span>{patient.allergy}</span></div>}<div className="patient-meta"><label>Телефон<b>{patient.phone}</b></label><label>Email<b>{patient.email || 'Не указан'}</b></label><label>Дата рождения<b>{patient.birth || 'Не указана'}</b></label><label>Баланс<b className={patient.debt?'debt':'clear'}>{patient.debt ? `Долг ${rub(patient.debt)}` : 'Нет задолженности'}</b></label></div>{(patient.chronicDiseases || patient.medicalInfo) && <div className="drawer-section"><div><h3>Медицинская информация</h3></div><p className="medical-note">{patient.chronicDiseases || patient.medicalInfo}</p></div>}<div className="drawer-section"><div><h3>История приемов</h3><button>Вся история</button></div>{appointments.length ? appointments.map(a=><article key={a.id}><span className={`visit-mark ${a.status}`}><Icon name="tooth"/></span><div><b>{a.type}</b><small>Сегодня, {a.time} · {a.doctor}</small></div><Status value={a.status}/></article>) : <p className="muted">Приемов пока не было</p>}</div><div className="drawer-section"><div><h3>План лечения</h3><button>Открыть</button></div><div className="plan-summary"><span><b>2 из 5</b><small>этапов завершено</small></span><strong>{rub(28400)}</strong></div><div className="progress"><i style={{width:'40%'}}/></div></div><div className="drawer-actions"><button className="button secondary" onClick={onOpenFull}>Открыть полную карту</button><button className="button primary" onClick={onAppointment}><Icon name="plus"/>Записать на прием</button></div></aside></div> }

function Modal({ title, subtitle, onClose, children, footer }) { return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button onClick={onClose}><Icon name="close"/></button></div><div className="modal-body">{children}</div>{footer && <div className="modal-footer">{footer}</div>}</section></div> }

function PatientForm({ patient, onClose, onSave, onDelete }) {
  const editing = Boolean(patient)
  const [data, setData] = useState(() => ({ name: '', phone: '', email: '', birth: '', gender: '', address: '', allergy: '', chronicDiseases: '', medicalInfo: '', notes: '', ...patient, birth: toInputDate(patient?.birth) }))
  const field = key => ({ value: data[key] || '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const submit = event => { event.preventDefault(); onSave({ ...data, id: patient?.id, card: patient?.card, visits: patient?.visits || 0, debt: patient?.debt || 0, lastVisit: patient?.lastVisit || 'Еще не было', color: patient?.color || 'teal' }) }
  return <Modal title={editing ? 'Полная карта пациента' : 'Новый пациент'} subtitle={editing ? `${patient.card} · редактирование медицинских и контактных данных` : 'Создайте медицинскую карточку пациента'} onClose={onClose} footer={<>{editing && <button className="button danger" type="button" onClick={() => onDelete(patient)}>Удалить пациента</button>}<span className="footer-spacer"/><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="patient-form">{editing ? 'Сохранить изменения' : 'Создать карточку'}</button></>}>
    <form id="patient-form" className="modal-form" onSubmit={submit}>
      <label className="full-field">ФИО пациента<input required placeholder="Например, Иванова Мария Сергеевна" {...field('name')}/></label>
      <label>Телефон<input required placeholder="+7 900 000-00-00" {...field('phone')}/></label>
      <label>Email<input type="email" placeholder="patient@mail.ru" {...field('email')}/></label>
      <label>Дата рождения<input type="date" {...field('birth')}/></label>
      <label>Пол<select {...field('gender')}><option value="">Не указан</option><option>Женский</option><option>Мужской</option><option>Другой</option></select></label>
      <label className="full-field">Адрес<input placeholder="Город, улица, дом" {...field('address')}/></label>
      <label className="full-field">Аллергии<textarea placeholder="Известные аллергии" {...field('allergy')}/></label>
      <label className="full-field">Хронические заболевания<textarea placeholder="Диагнозы и важные ограничения" {...field('chronicDiseases')}/></label>
      <label className="full-field">Медицинская информация<textarea placeholder="Состояние зубов, противопоказания, особенности лечения" {...field('medicalInfo')}/></label>
      <label className="full-field">Примечание<textarea placeholder="Дополнительная информация о пациенте" {...field('notes')}/></label>
    </form>
  </Modal>
}

function AppointmentForm({ patients, doctors, onClose, onSave }) { const [data,setData]=useState({patientId:patients[0]?.id||'',doctorId:doctors[0]?.id||'',date:'2026-08-02',time:'09:00',end:'10:00',type:'Консультация',room:'Кабинет 2',comment:''}); const submit=e=>{e.preventDefault();onSave(data)}; return <Modal title="Новая запись" subtitle="Запланируйте прием пациента" onClose={onClose} footer={<><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="appointment-form" disabled={!patients.length || !doctors.length}><Icon name="calendar"/>Записать пациента</button></>}><form id="appointment-form" className="modal-form" onSubmit={submit}><label className="full-field">Пациент<select value={data.patientId} onChange={e=>setData({...data,patientId:e.target.value})}>{patients.map(p=><option value={p.id} key={p.id}>{p.name} · {p.phone}</option>)}</select></label><label>Дата<input type="date" value={data.date} onChange={e=>setData({...data,date:e.target.value})}/></label><label>Врач<select required value={data.doctorId} onChange={e=>setData({...data,doctorId:e.target.value})}>{doctors.length ? doctors.map(d=><option value={d.id} key={d.id}>{d.name} · {d.specialty || 'Врач'}</option>) : <option value="">Сначала добавьте врача</option>}</select></label><label>Начало<input type="time" value={data.time} onChange={e=>setData({...data,time:e.target.value})}/></label><label>Окончание<input type="time" value={data.end} onChange={e=>setData({...data,end:e.target.value})}/></label><label>Тип приема<input list="appointment-types" value={data.type} onChange={e=>setData({...data,type:e.target.value})}/><datalist id="appointment-types"><option value="Консультация"/><option value="Лечение кариеса"/><option value="Профессиональная гигиена"/><option value="Имплантация"/><option value="Ортодонтия"/></datalist></label><label>Кабинет<select value={data.room} onChange={e=>setData({...data,room:e.target.value})}><option>Кабинет 1</option><option>Кабинет 2</option><option>Кабинет 3</option></select></label><label className="full-field">Комментарий<textarea placeholder="Пожелания или важная информация" value={data.comment} onChange={e=>setData({...data,comment:e.target.value})}/></label><div className="slot-hint full-field"><Icon name="check"/><span><b>{doctors.length ? 'Врач выбран' : 'Нет доступных врачей'}</b><small>{doctors.length ? 'Новый врач появится здесь после добавления в разделе «Сотрудники»' : 'Добавьте активного сотрудника с ролью «Врач»'}</small></span></div></form></Modal> }

function StaffForm({ employee, onClose, onSave }) {
  const editing = Boolean(employee)
  const [data, setData] = useState(() => ({ name: '', role: 'Врач', specialty: '', phone: '', email: '', active: true, permissions: permissionsByRole['Врач'], ...employee }))
  const field = key => ({ value: data[key] || '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const setRole = role => setData({ ...data, role, permissions: permissionsByRole[role] || [] })
  const togglePermission = key => setData({ ...data, permissions: data.permissions.includes(key) ? data.permissions.filter(item => item !== key) : [...data.permissions, key] })
  const submit = event => { event.preventDefault(); onSave({ ...data, id: employee?.id, isDirector: employee?.isDirector || false }) }
  return <Modal title={editing ? 'Профиль сотрудника' : 'Новый сотрудник'} subtitle="Данные, роль и доступ к разделам CRM" onClose={onClose} footer={<><span className="footer-spacer"/><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="staff-form">{editing ? 'Сохранить изменения' : 'Добавить сотрудника'}</button></>}>
    <form id="staff-form" className="modal-form" onSubmit={submit}>
      <label className="full-field">ФИО сотрудника<input required placeholder="Фамилия Имя Отчество" {...field('name')}/></label>
      <label>Роль<select value={data.role} onChange={event => setRole(event.target.value)}>{roleOptions.map(role => <option key={role}>{role}</option>)}</select></label>
      <label>Должность / специализация<input placeholder="Например, стоматолог-терапевт" {...field('specialty')}/></label>
      <label>Телефон<input placeholder="+7 900 000-00-00" {...field('phone')}/></label>
      <label>Email<input type="email" placeholder="employee@clinic.ru" {...field('email')}/></label>
      <div className="full-field permission-field"><span>Доступ к разделам</span><div className="permission-grid">{permissionOptions.map(([key,label]) => <label className="permission-check" key={key}><input type="checkbox" checked={data.permissions.includes(key)} onChange={() => togglePermission(key)}/><span><Icon name="check" size={13}/></span>{label}</label>)}</div></div>
      <label className="full-field active-switch"><input type="checkbox" checked={data.active} onChange={event => setData({ ...data, active: event.target.checked })}/><span/>Активная учетная запись</label>
    </form>
  </Modal>
}

function DirectorForm({ director, onClose, onSave, onLogout }) {
  const [data, setData] = useState({ ...director })
  const field = key => ({ value: data[key] || '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const togglePermission = key => setData({ ...data, permissions: data.permissions.includes(key) ? data.permissions.filter(item => item !== key) : [...data.permissions, key] })
  return <Modal title="Директор и права доступа" subtitle="Данные руководителя, которые отображаются в системе" onClose={onClose} footer={<><button className="button secondary" type="button" onClick={() => { onClose(); onLogout() }}>Выйти из системы</button><span className="footer-spacer"/><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" type="button" onClick={() => onSave(data)}>Сохранить</button></>}>
    <div className="director-form-head"><Avatar initials={getInitials(data.name)} color="navy" size="lg"/><div><b>{data.name}</b><span>Директор клиники</span></div></div>
    <div className="modal-form"><label className="full-field">ФИО директора<input required {...field('name')}/></label><label>Телефон<input {...field('phone')}/></label><label>Email<input type="email" {...field('email')}/></label><label className="full-field">Должность<input {...field('specialty')}/></label><div className="full-field permission-field"><span>Права директора</span><div className="permission-grid">{permissionOptions.map(([key,label]) => <label className="permission-check" key={key}><input type="checkbox" checked={data.permissions.includes(key)} onChange={() => togglePermission(key)}/><span><Icon name="check" size={13}/></span>{label}</label>)}</div></div></div>
  </Modal>
}

function PaymentForm({ invoice, onClose, onSave }) { const balance=invoice.amount-invoice.paid; const [amount,setAmount]=useState(balance); return <Modal title="Прием оплаты" subtitle={`${invoice.id} · ${invoice.patient}`} onClose={onClose} footer={<><button className="button secondary" onClick={onClose}>Отменить</button><button className="button primary" onClick={()=>onSave({id:invoice.id,amount})}>Принять {rub(Number(amount)||0)}</button></>}><div className="payment-summary"><span>Сумма счета<b>{rub(invoice.amount)}</b></span><span>Уже оплачено<b>{rub(invoice.paid)}</b></span><span>К оплате<b>{rub(balance)}</b></span></div><div className="modal-form payment-fields"><label>Сумма оплаты<input type="number" min="1" max={balance} value={amount} onChange={e=>setAmount(e.target.value)}/></label><label>Способ оплаты<select><option>Банковская карта</option><option>Наличные</option><option>Банковский перевод</option></select></label></div><label className="receipt-check checkbox"><input type="checkbox" defaultChecked/><span/>Отправить чек пациенту на email</label></Modal> }

function Notifications({ onClose }) { return <div className="notifications-pop"><div><h3>Уведомления</h3><button onClick={onClose}><Icon name="close" size={18}/></button></div><button><span className="task-icon green"><Icon name="userplus"/></span><div><b>Новый пациент</b><p>Полина Власова добавлена в базу</p><small>12 минут назад</small></div><i/></button><button><span className="task-icon blue"><Icon name="calendar"/></span><div><b>Прием подтвержден</b><p>Мария Кузнецова · сегодня, 09:00</p><small>36 минут назад</small></div><i/></button><button><span className="task-icon orange"><Icon name="clock"/></span><div><b>Изменено время приема</b><p>Дмитрий Попов перенесен на 14:30</p><small>1 час назад</small></div></button><button className="all-notifications">Показать все уведомления</button></div> }

function Empty({ icon, title, text, action, onAction }) { return <div className="empty"><span><Icon name={icon} size={28}/></span><h3>{title}</h3><p>{text}</p>{action&&<button className="button secondary" onClick={onAction}>{action}</button>}</div> }

export default App
