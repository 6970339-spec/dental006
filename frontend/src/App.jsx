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
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
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

const initialDirector = { id: 100, name: 'Ислам Парчиев', initials: 'ИП', role: 'Директор', specialty: 'Руководитель клиники', phone: '+7 900 000-00-01', email: 'director@dentaplus.ru', login: 'director', password: 'demo1234', active: true, color: 'navy', permissions: permissionsByRole['Директор'], isDirector: true }

const initialStaff = [
  { id: 1, name: 'Михаил Орлов', initials: 'МО', color: 'blue', role: 'Врач', specialty: 'Стоматолог-терапевт', phone: '+7 916 201-10-10', email: 'orlov@dentaplus.ru', login: 'orlov', password: 'doctor123', active: true, permissions: permissionsByRole['Врач'] },
  { id: 2, name: 'Ирина Белова', initials: 'ИБ', color: 'pink', role: 'Врач', specialty: 'Ортодонт', phone: '+7 916 202-20-20', email: 'belova@dentaplus.ru', login: 'belova', password: 'doctor123', active: true, permissions: permissionsByRole['Врач'] },
  { id: 3, name: 'Андрей Титов', initials: 'АТ', color: 'orange', role: 'Врач', specialty: 'Хирург-имплантолог', phone: '+7 916 203-30-30', email: 'titov@dentaplus.ru', login: 'titov', password: 'doctor123', active: true, permissions: permissionsByRole['Врач'] },
  { id: 4, name: 'Елена Волкова', initials: 'ЕВ', color: 'teal', role: 'Администратор', specialty: 'Старший администратор', phone: '+7 916 204-40-40', email: 'volkova@dentaplus.ru', login: 'volkova', password: 'admin123', active: true, permissions: permissionsByRole['Администратор'] },
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
  { id: 1, date: '2026-08-17', time: '09:00', end: '10:00', patientId: 1, patient: 'Мария Кузнецова', initials: 'МК', type: 'Профилактический осмотр', doctor: 'Михаил Орлов', doctorId: 1, status: 'confirmed', room: 'Кабинет 2', color: 'blue' },
  { id: 2, date: '2026-08-17', time: '10:30', end: '11:30', patientId: 2, patient: 'Алексей Смирнов', initials: 'АС', type: 'Лечение кариеса', doctor: 'Михаил Орлов', doctorId: 1, status: 'progress', room: 'Кабинет 2', color: 'green' },
  { id: 3, date: '2026-08-17', time: '12:00', end: '12:45', patientId: 3, patient: 'София Лебедева', initials: 'СЛ', type: 'Консультация ортодонта', doctor: 'Ирина Белова', doctorId: 2, status: 'waiting', room: 'Кабинет 1', color: 'pink' },
  { id: 4, date: '2026-08-17', time: '14:30', end: '15:30', patientId: 4, patient: 'Дмитрий Попов', initials: 'ДП', type: 'Профессиональная гигиена', doctor: 'Михаил Орлов', doctorId: 1, status: 'confirmed', room: 'Кабинет 2', color: 'orange' },
  { id: 5, date: '2026-08-17', time: '16:00', end: '17:30', patientId: 5, patient: 'Полина Власова', initials: 'ПВ', type: 'Установка импланта', doctor: 'Андрей Титов', doctorId: 3, status: 'confirmed', room: 'Кабинет 3', color: 'purple' },
]

const initialInvoices = [
  { id: 'INV-0801', patientId: 1, patient: 'Мария Кузнецова', doctorId: 1, service: 'Лечение кариеса', amount: 12400, date: '01.08.2026', status: 'partial', payments: [{ id: 1, amount: 5000, method: 'Карта', date: '01.08.2026', comment: 'Предоплата' }] },
  { id: 'INV-0794', patientId: 4, patient: 'Дмитрий Попов', doctorId: 1, service: 'Профессиональная гигиена', amount: 12300, date: '29.07.2026', status: 'unpaid', payments: [] },
  { id: 'INV-0788', patientId: 6, patient: 'Сергей Морозов', doctorId: 3, service: 'Коронка E-max', amount: 34200, date: '27.07.2026', status: 'partial', payments: [{ id: 2, amount: 30000, method: 'Перевод', date: '27.07.2026', comment: '' }] },
  { id: 'INV-0783', patientId: 3, patient: 'София Лебедева', doctorId: 2, service: 'Консультация ортодонта', amount: 2500, date: '25.07.2026', status: 'paid', payments: [{ id: 3, amount: 2500, method: 'Наличные', date: '25.07.2026', comment: '' }] },
]

const initialTreatments = [
  { id: 1, patientId: 1, doctorId: 1, appointmentId: 1, title: 'Терапевтическое лечение', diagnosis: 'Кариес дентина', procedures: 'Лечение кариеса, реставрация зуба 16', total: 28400, progress: 40, status: 'active', teeth: '16, 26', comment: 'Следующий этап после контрольного осмотра', stages: [{ id: 11, title: 'Диагностика', cost: 2500, done: true }, { id: 12, title: 'Лечение зуба 16', cost: 12400, done: true }, { id: 13, title: 'Лечение зуба 26', cost: 13500, done: false }] },
  { id: 2, patientId: 3, doctorId: 2, appointmentId: 3, title: 'Ортодонтическая коррекция', diagnosis: 'Скученность зубов', procedures: 'Диагностика и установка брекет-системы', total: 89000, progress: 30, status: 'active', teeth: 'Верхняя и нижняя челюсть', comment: 'Контроль каждые четыре недели', stages: [{ id: 21, title: 'Консультация и снимки', cost: 2500, done: true }, { id: 22, title: 'Установка системы', cost: 65000, done: false }, { id: 23, title: 'Контрольные визиты', cost: 21500, done: false }] },
  { id: 3, patientId: 5, doctorId: 3, appointmentId: 5, title: 'Имплантация', diagnosis: 'Отсутствие зуба 36', procedures: 'Имплантация и установка коронки', total: 156000, progress: 80, status: 'active', teeth: '36', comment: 'Ожидается установка постоянной коронки', stages: [{ id: 31, title: 'Подготовка', cost: 12000, done: true }, { id: 32, title: 'Установка импланта', cost: 96000, done: true }, { id: 33, title: 'Постоянная коронка', cost: 48000, done: false }] },
  { id: 4, patientId: 4, doctorId: 1, appointmentId: 4, title: 'Профессиональная гигиена', diagnosis: 'Зубные отложения', procedures: 'Ультразвуковая чистка и Air Flow', total: 12300, progress: 100, status: 'completed', teeth: 'Все зубы', comment: 'Рекомендован повтор через 6 месяцев', stages: [{ id: 41, title: 'Профессиональная гигиена', cost: 12300, done: true }] },
]

const navItems = [
  ['dashboard', 'grid', 'Главная'], ['calendar', 'calendar', 'Расписание'], ['patients', 'users', 'Пациенты'], ['treatment', 'tooth', 'Лечение'], ['finance', 'wallet', 'Финансы'], ['documents', 'file', 'Документы'], ['reports', 'chart', 'Отчеты'], ['staff', 'staff', 'Сотрудники'], ['settings', 'settings', 'Настройки'],
]

const pageTitles = { calendar: ['Расписание', 'Управляйте приемами и рабочим временем'], patients: ['Пациенты', 'База пациентов вашей клиники'], treatment: ['Лечение', 'Карты лечения и медицинская история'], finance: ['Финансы', 'Счета, оплаты и задолженности'], documents: ['Документы', 'Файлы пациентов и шаблоны клиники'], reports: ['Отчеты', 'Ключевые показатели работы клиники'], staff: ['Сотрудники', 'Команда, роли и доступы'], settings: ['Настройки', 'Профиль клиники, директор и права доступа'] }

const statusMap = { confirmed: ['Подтвержден', 'success'], scheduled: ['Запланирован', 'info'], active: ['Активен', 'success'], inactive: ['Отключен', 'danger'], progress: ['Идет прием', 'info'], in_progress: ['Идет прием', 'info'], waiting: ['Ожидает', 'warning'], completed: ['Завершен', 'success'], cancelled: ['Отменен', 'danger'], paid: ['Оплачен', 'success'], partial: ['Частично', 'warning'], unpaid: ['Не оплачен', 'danger'] }
const treatmentStatusMap = { active: 'Активный план', planned: 'Запланирован', completed: 'Завершен' }

const rub = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽'

const getInitials = name => name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()
const readStored = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback } }
const accountLogin = account => account?.login || account?.email?.split('@')[0] || `employee${account?.id || ''}`
const hydrateAccount = (account, fallback = {}) => ({ ...fallback, ...account, login: account?.login || fallback.login || accountLogin(account), password: account?.password || fallback.password || 'demo1234' })
const readStaff = () => readStored('dental-staff-v2', initialStaff).map(account => hydrateAccount(account, initialStaff.find(item => item.id === account.id)))
const readDirector = () => hydrateAccount(readStored('dental-director-v2', initialDirector), initialDirector)
const readSession = () => { try { const value = sessionStorage.getItem('dental-session-v1'); if (value) return JSON.parse(value); return sessionStorage.getItem('dental-demo') === '1' ? { id: initialDirector.id, isDirector: true } : null } catch { return null } }
const toInputDate = value => { if (!value) return ''; const parts = value.split('.'); return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value }
const toDisplayDate = value => { if (!value) return ''; const parts = value.split('-'); return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : value }
const getAge = value => { const iso = toInputDate(value); if (!iso) return 0; const birth = new Date(`${iso}T00:00:00`); const now = new Date(); let age = now.getFullYear() - birth.getFullYear(); if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--; return Math.max(age, 0) }
const paymentTotal = invoice => (invoice.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
const invoiceBalance = invoice => Math.max(0, Number(invoice.amount || 0) - paymentTotal(invoice))
const normalizedInvoiceStatus = invoice => invoiceBalance(invoice) <= 0 ? 'paid' : paymentTotal(invoice) > 0 ? 'partial' : 'unpaid'
const readInvoices = () => readStored('dental-invoices', initialInvoices).map((invoice, index) => {
  const patient = initialPatients.find(item => item.id === invoice.patientId || item.name === invoice.patient)
  const payments = Array.isArray(invoice.payments) ? invoice.payments : Number(invoice.paid || 0) > 0 ? [{ id: `legacy-${index}`, amount: Number(invoice.paid), method: 'Карта', date: invoice.date, comment: 'Ранее внесенная оплата' }] : []
  const normalized = { ...invoice, patientId: invoice.patientId || patient?.id, doctorId: invoice.doctorId || 1, payments }
  return { ...normalized, paid: paymentTotal(normalized), status: normalizedInvoiceStatus(normalized) }
})
const todayIso = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
const todayDisplay = () => toDisplayDate(todayIso())
const sortDateValue = value => { const iso = toInputDate(value); return iso ? new Date(`${iso}T00:00:00`).getTime() : 0 }

function Avatar({ initials, color = 'blue', size = 'md' }) { return <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span> }

function Status({ value }) {
  const [label, tone] = statusMap[value] || [value, 'neutral']
  return <span className={`status status-${tone}`}><i />{label}</span>
}

function Login({ onLogin, director }) {
  const [loading, setLoading] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const [sent, setSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ login: director.login || 'director', password: director.password || 'demo1234' })
  const [error, setError] = useState('')
  const submit = event => {
    event.preventDefault()
    setError('')
    setLoading(true)
    if (recovering) {
      setTimeout(() => { setLoading(false); setSent(true) }, 550)
      return
    }
    setTimeout(() => {
      const result = onLogin(credentials)
      setLoading(false)
      if (!result.ok) setError(result.message)
    }, 450)
  }
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
          <label>Логин или email<input key="login-username" required value={credentials.login} onChange={event => setCredentials({ ...credentials, login: event.target.value })} autoComplete="username" /></label>
          <label>Пароль<div className="password-input"><input type={showPassword ? 'text' : 'password'} required value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} autoComplete="current-password"/><button type="button" aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? '×' : '◉'}</button></div></label>
          {error && <div className="login-error" role="alert">{error}</div>}
          <div className="login-row"><label className="checkbox"><input type="checkbox" defaultChecked/><span/>Запомнить меня</label><button type="button" className="link-button" onClick={() => setRecovering(true)}>Забыли пароль?</button></div>
          <button className="button primary login-button" disabled={loading}>{loading ? <span className="spinner"/> : 'Войти в систему'}</button>
          <div className="demo-hint"><Icon name="check" size={17}/><span><b>Демо-доступ директора:</b> {director.login || 'director'} / {director.password || 'demo1234'}</span></div>
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
  const [session, setSession] = useState(readSession)
  const [page, setPage] = useState('dashboard')
  const [patients, setPatients] = useState(() => readStored('dental-patients', initialPatients))
  const [appointments, setAppointments] = useState(() => readStored('dental-appointments', initialAppointments))
  const [treatments, setTreatments] = useState(() => readStored('dental-treatments-v1', initialTreatments))
  const [invoices, setInvoices] = useState(readInvoices)
  const [staff, setStaff] = useState(readStaff)
  const [director, setDirector] = useState(readDirector)
  const [modal, setModal] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('dental-patients', JSON.stringify(patients)), [patients])
  useEffect(() => localStorage.setItem('dental-appointments', JSON.stringify(appointments)), [appointments])
  useEffect(() => localStorage.setItem('dental-treatments-v1', JSON.stringify(treatments)), [treatments])
  useEffect(() => localStorage.setItem('dental-invoices', JSON.stringify(invoices)), [invoices])
  useEffect(() => localStorage.setItem('dental-staff-v2', JSON.stringify(staff)), [staff])
  useEffect(() => localStorage.setItem('dental-director-v2', JSON.stringify(director)), [director])

  const showToast = message => { setToast(message); setTimeout(() => setToast(''), 2600) }
  const accounts = useMemo(() => [director, ...staff.filter(employee => !employee.isDirector)], [director, staff])
  const currentAccount = accounts.find(account => account.id === session?.id && Boolean(account.isDirector) === Boolean(session?.isDirector))
  const login = credentials => {
    const enteredLogin = credentials.login.trim().toLowerCase()
    const account = accounts.find(item => [item.login, item.email].filter(Boolean).some(value => value.toLowerCase() === enteredLogin))
    if (!account || account.password !== credentials.password) return { ok: false, message: 'Неверный логин или пароль' }
    if (!account.active) return { ok: false, message: 'Учетная запись отключена. Обратитесь к директору.' }
    const nextSession = { id: account.id, isDirector: Boolean(account.isDirector) }
    sessionStorage.setItem('dental-session-v1', JSON.stringify(nextSession))
    sessionStorage.removeItem('dental-demo')
    setSession(nextSession)
    setPage('dashboard')
    return { ok: true }
  }
  const logout = () => { sessionStorage.removeItem('dental-session-v1'); sessionStorage.removeItem('dental-demo'); setSession(null) }
  const doctors = useMemo(() => staff.filter(employee => employee.role === 'Врач' && employee.active), [staff])
  const invoicesWithTotals = useMemo(() => invoices.map(invoice => ({ ...invoice, paid: paymentTotal(invoice), balance: invoiceBalance(invoice), status: normalizedInvoiceStatus(invoice) })), [invoices])
  const patientsWithMetrics = useMemo(() => patients.map(patient => {
    const visits = appointments.filter(appointment => appointment.patientId === patient.id)
    const patientInvoices = invoicesWithTotals.filter(invoice => invoice.patientId === patient.id || (!invoice.patientId && invoice.patient === patient.name))
    const latestVisit = [...visits].sort((left, right) => `${right.date || ''}${right.time || ''}`.localeCompare(`${left.date || ''}${left.time || ''}`))[0]
    return { ...patient, visits: visits.length, debt: patientInvoices.reduce((sum, invoice) => sum + invoice.balance, 0), lastVisit: latestVisit ? `${latestVisit.date ? toDisplayDate(latestVisit.date) : 'Сегодня'}, ${latestVisit.time}` : 'Еще не было' }
  }), [patients, appointments, invoicesWithTotals])
  const selectedPatientDetails = selectedPatient ? patientsWithMetrics.find(patient => patient.id === selectedPatient.id) || selectedPatient : null
  const addPatient = patient => { setPatients(prev => [{ ...patient, id: Date.now(), card: `P-${String(Math.max(0, ...prev.map(item => Number(item.card?.replace(/\D/g, '')) || 0)) + 1).padStart(5, '0')}`, initials: getInitials(patient.name), birth: toDisplayDate(patient.birth), age: getAge(patient.birth), createdAt: todayIso(), color: 'teal' }, ...prev]); setModal(null); showToast('Карточка пациента создана') }
  const updatePatient = patient => { const previous = patients.find(item => item.id === patient.id); const updated = { ...patient, initials: getInitials(patient.name), birth: toDisplayDate(patient.birth), age: getAge(patient.birth) }; setPatients(prev => prev.map(item => item.id === patient.id ? updated : item)); setAppointments(prev => prev.map(item => item.patientId === patient.id ? { ...item, patient: updated.name, initials: updated.initials } : item)); if (previous) setInvoices(prev => prev.map(item => item.patient === previous.name ? { ...item, patient: updated.name } : item)); setSelectedPatient(null); setModal(null); showToast('Карта пациента обновлена') }
  const deletePatient = patient => { if (!window.confirm(`Удалить пациента «${patient.name}»? Приемы, лечение и счета этого пациента также будут удалены.`)) return; setPatients(prev => prev.filter(item => item.id !== patient.id)); setAppointments(prev => prev.filter(item => item.patientId !== patient.id)); setTreatments(prev => prev.filter(item => item.patientId !== patient.id)); setInvoices(prev => prev.filter(item => item.patientId !== patient.id && item.patient !== patient.name)); setSelectedPatient(null); setModal(null); showToast('Пациент удален') }
  const deletePatients = ids => {
    const selectedIds = new Set(ids)
    const selected = patients.filter(patient => selectedIds.has(patient.id))
    if (!selected.length) return false
    const label = selected.length === 1 ? `пациента «${selected[0].name}»` : `${selected.length} пациентов`
    if (!window.confirm(`Удалить ${label}? Связанные приемы и счета также будут удалены.`)) return false
    const names = new Set(selected.map(patient => patient.name))
    setPatients(prev => prev.filter(patient => !selectedIds.has(patient.id)))
    setAppointments(prev => prev.filter(appointment => !selectedIds.has(appointment.patientId)))
    setTreatments(prev => prev.filter(treatment => !selectedIds.has(treatment.patientId)))
    setInvoices(prev => prev.filter(invoice => !selectedIds.has(invoice.patientId) && !names.has(invoice.patient)))
    if (selectedPatient && selectedIds.has(selectedPatient.id)) setSelectedPatient(null)
    showToast(selected.length === 1 ? 'Пациент удален' : `Удалено пациентов: ${selected.length}`)
    return true
  }
  const saveStaff = employee => {
    const normalizedLogin = employee.login.trim().toLowerCase()
    if (accounts.some(item => item.id !== employee.id && item.login?.toLowerCase() === normalizedLogin)) { showToast('Этот логин уже используется'); return }
    if (employee.password.length < 6) { showToast('Пароль должен содержать не менее 6 символов'); return }
    const normalized = { ...employee, login: normalizedLogin, initials: getInitials(employee.name), permissions: employee.permissions?.length ? employee.permissions : permissionsByRole[employee.role] || [] }
    setStaff(prev => prev.some(item => item.id === employee.id) ? prev.map(item => item.id === employee.id ? normalized : item) : [...prev, { ...normalized, id: Date.now(), color: ['blue', 'pink', 'orange', 'teal', 'purple'][prev.length % 5] }])
    setModal(null)
    showToast(employee.id ? 'Профиль и данные входа обновлены' : 'Сотрудник и учетная запись добавлены')
  }
  const saveDirector = data => {
    const normalizedLogin = data.login.trim().toLowerCase()
    if (staff.some(item => !item.isDirector && item.login?.toLowerCase() === normalizedLogin)) { showToast('Этот логин уже используется'); return }
    if (data.password.length < 6) { showToast('Пароль должен содержать не менее 6 символов'); return }
    const updated = { ...director, ...data, login: normalizedLogin, role: 'Директор', initials: getInitials(data.name), isDirector: true }
    setDirector(updated)
    setStaff(prev => prev.some(item => item.isDirector) ? prev.map(item => item.isDirector ? updated : item) : [...prev, updated])
    setModal(null)
    showToast('Данные директора, вход и права сохранены')
  }
  const addAppointment = appointment => { const patient = patients.find(p => p.id === Number(appointment.patientId)); const doctor = doctors.find(d => d.id === Number(appointment.doctorId)); if (!patient || !doctor) { showToast('Выберите пациента и врача'); return } setAppointments(prev => [...prev, { ...appointment, patientId: Number(appointment.patientId), doctorId: Number(appointment.doctorId), id: Date.now(), patient: patient.name, initials: patient.initials, doctor: doctor.name, status: 'confirmed', color: patient.color }].sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))); setModal(null); showToast('Пациент записан на прием') }
  const payInvoice = ({ id, amount, method, date, comment }) => {
    const numericAmount = Number(amount)
    const invoice = invoicesWithTotals.find(item => item.id === id)
    if (!invoice || numericAmount <= 0 || numericAmount > invoice.balance) { showToast('Проверьте сумму оплаты'); return }
    setInvoices(prev => prev.map(item => item.id === id ? { ...item, payments: [...(item.payments || []), { id: Date.now(), amount: numericAmount, method, date: toDisplayDate(date), comment } ] } : item))
    setModal(null)
    showToast(`Оплата ${rub(numericAmount)} принята`)
  }
  const saveInvoice = data => {
    const patient = patients.find(item => item.id === Number(data.patientId))
    if (!patient || Number(data.amount) <= 0) { showToast('Выберите пациента и укажите сумму счета'); return }
    const number = `INV-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.max(0, ...invoices.map(item => Number(String(item.id).replace(/\D/g, '').slice(-4)) || 0)) + 1).padStart(4, '0')}`
    setInvoices(prev => [{ id: number, patientId: patient.id, patient: patient.name, doctorId: Number(data.doctorId) || null, treatmentId: data.treatmentId || null, service: data.service, amount: Number(data.amount), date: toDisplayDate(data.date || todayIso()), dueDate: data.dueDate, payments: [] }, ...prev])
    setModal(null)
    showToast(`Счет ${number} создан`)
  }
  const saveTreatment = data => {
    const patient = patients.find(item => item.id === Number(data.patientId))
    const doctor = doctors.find(item => item.id === Number(data.doctorId))
    if (!patient || !doctor || !data.title.trim()) { showToast('Выберите пациента, врача и название лечения'); return }
    const treatmentId = data.id || Date.now()
    let linkedInvoiceId = data.invoiceId || null
    if (data.createInvoice && !linkedInvoiceId) linkedInvoiceId = `INV-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.max(0, ...invoices.map(item => Number(String(item.id).replace(/\D/g, '').slice(-4)) || 0)) + 1).padStart(4, '0')}`
    const normalized = { ...data, id: treatmentId, patientId: patient.id, doctorId: doctor.id, total: Number(data.total) || 0, progress: Number(data.progress) || 0, invoiceId: linkedInvoiceId, createInvoice: undefined }
    setTreatments(prev => prev.some(item => item.id === treatmentId) ? prev.map(item => item.id === treatmentId ? normalized : item) : [normalized, ...prev])
    if (linkedInvoiceId) {
      setInvoices(prev => prev.some(item => item.id === linkedInvoiceId)
        ? prev.map(item => item.id === linkedInvoiceId ? { ...item, patientId: patient.id, patient: patient.name, doctorId: doctor.id, treatmentId, service: data.title, amount: Number(data.total) || 0 } : item)
        : [{ id: linkedInvoiceId, patientId: patient.id, patient: patient.name, doctorId: doctor.id, treatmentId, service: data.title, amount: Number(data.total) || 0, date: todayDisplay(), payments: [] }, ...prev])
    }
    setModal(null)
    showToast(data.id ? 'План лечения обновлен' : 'План лечения создан')
  }
  const searchResults = search.trim().length > 1 ? patientsWithMetrics.filter(p => `${p.name} ${p.phone} ${p.card}`.toLowerCase().includes(search.toLowerCase())).slice(0,5) : []

  if (!currentAccount?.active) return <Login onLogin={login} director={director}/>
  const visibleNavItems = navItems.filter(([key]) => key === 'dashboard' || currentAccount.permissions?.includes(key))
  const openCurrentProfile = () => setModal(currentAccount.isDirector ? { type: 'director' } : { type: 'staff', employee: currentAccount })
  const [title, subtitle] = page === 'dashboard' ? [`Добрый день, ${currentAccount.name.split(' ')[0]}!`, 'Вот что происходит в клинике сегодня'] : pageTitles[page]
  const headingAction = page === 'patients' ? { label: 'Новый пациент', action: () => setModal('patient') } : page === 'staff' ? { label: 'Добавить сотрудника', action: () => setModal({ type: 'staff' }) } : page === 'treatment' ? { label: 'Новый план лечения', action: () => setModal({ type: 'treatment' }) } : page === 'finance' ? { label: 'Новый счет', action: () => setModal({ type: 'invoice' }) } : ['dashboard', 'calendar'].includes(page) ? { label: 'Новая запись', action: () => setModal('appointment') } : null
  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <nav>{visibleNavItems.map(([key, icon, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon name={icon}/><span>{label}</span>{key === 'finance' && <em>3</em>}</button>)}</nav>
      <div className="sidebar-help"><span><Icon name="tooth" size={18}/></span><b>Нужна помощь?</b><p>Мы на связи каждый день</p><button>Центр поддержки</button></div>
      <button className="sidebar-profile" onClick={openCurrentProfile}><Avatar initials={currentAccount.initials} color="white"/><span><b>{currentAccount.name}</b><small>{currentAccount.role}</small></span><Icon name="settings" size={17}/></button>
    </aside>
    <div className="app-main">
      <header className="topbar">
        <button className="mobile-logo" onClick={() => setPage('dashboard')}><Logo dark/></button>
        <div className="global-search"><Icon name="search" size={19}/><input placeholder="Поиск пациента по имени, телефону или карте..." value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd>
          {searchResults.length > 0 && <div className="search-results">{searchResults.map(p => <button key={p.id} onClick={() => { setSelectedPatient(p); setSearch('') }}><Avatar initials={p.initials} color={p.color} size="sm"/><span><b>{p.name}</b><small>{p.card} · {p.phone}</small></span><Icon name="arrow" size={16}/></button>)}</div>}
        </div>
        <div className="top-actions"><button className="round-button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Icon name="bell"/><i/></button><button className="top-profile" onClick={openCurrentProfile} title="Открыть профиль"><Avatar initials={currentAccount.initials} color={currentAccount.color || 'navy'} size="sm"/><span><b>{currentAccount.name}</b><small>{currentAccount.role} · профиль</small></span></button></div>
        {notificationsOpen && <Notifications onClose={() => setNotificationsOpen(false)}/>} 
      </header>
      <main className="content">
        <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="heading-actions">{!['settings', 'staff'].includes(page) && <button className="button secondary"><Icon name="upload" size={17}/>Экспорт</button>}{headingAction && <button className="button primary" onClick={headingAction.action}><Icon name="plus" size={18}/>{headingAction.label}</button>}</div></div>
        {page === 'dashboard' && <Dashboard appointments={appointments} patients={patientsWithMetrics} invoices={invoicesWithTotals} onPage={setPage} onPatient={setSelectedPatient} onAppointment={() => setModal('appointment')}/>}
        {page === 'calendar' && <CalendarPage appointments={appointments} onNew={() => setModal('appointment')} onPatient={setSelectedPatient} patients={patientsWithMetrics} doctors={doctors}/>}
        {page === 'patients' && <PatientsPage patients={patientsWithMetrics} onPatient={setSelectedPatient} onOpenFull={patient => setModal({ type: 'patient-card', patientId: patient.id })} onNew={() => setModal('patient')} onDelete={patient => deletePatients([patient.id])} onDeleteMany={deletePatients}/>}
        {page === 'finance' && <FinancePage invoices={invoicesWithTotals} patients={patientsWithMetrics} doctors={doctors} onPay={invoice => setModal({ type: 'payment', invoice })} onNew={() => setModal({ type: 'invoice' })} onPatient={patientId => setModal({ type: 'patient-card', patientId, initialTab: 'finance' })}/>}
        {page === 'treatment' && <TreatmentPage treatments={treatments} patients={patientsWithMetrics} doctors={doctors} invoices={invoicesWithTotals} onOpen={treatment => setModal({ type: 'treatment', treatment })} onNew={() => setModal({ type: 'treatment' })} onPatient={patientId => setModal({ type: 'patient-card', patientId, initialTab: 'treatment' })}/>}
        {page === 'documents' && <DocumentsPage/>}
        {page === 'reports' && <ReportsPage doctors={doctors} appointments={appointments} invoices={invoicesWithTotals} patients={patientsWithMetrics} onDoctor={doctor => setModal({ type: 'doctor-report', doctor })}/>}
        {page === 'staff' && <StaffPage staff={staff} appointments={appointments} invoices={invoicesWithTotals} onEdit={employee => setModal(employee.isDirector ? { type: 'director' } : { type: 'staff', employee })}/>}
        {page === 'settings' && <SettingsPage director={director} staff={staff} onEditDirector={() => setModal({ type: 'director' })} onEditStaff={employee => setModal({ type: 'staff', employee })} onSave={() => showToast('Настройки клиники сохранены')}/>} 
      </main>
    </div>
    <nav className="mobile-nav">{visibleNavItems.slice(0,5).map(([key, icon, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon name={icon}/><span>{label === 'Расписание' ? 'Календарь' : label}</span></button>)}</nav>
    {modal === 'patient' && <PatientForm onClose={() => setModal(null)} onSave={addPatient}/>} 
    {modal === 'appointment' && <AppointmentForm patients={patients} doctors={doctors} onClose={() => setModal(null)} onSave={addAppointment}/>} 
    {modal?.type === 'payment' && <PaymentForm invoice={modal.invoice} onClose={() => setModal(null)} onSave={payInvoice}/>} 
    {modal?.type === 'invoice' && <InvoiceForm patients={patientsWithMetrics} doctors={doctors} treatment={modal.treatment} onClose={() => setModal(null)} onSave={saveInvoice}/>}
    {modal?.type === 'treatment' && <TreatmentForm treatment={modal.treatment} patients={patientsWithMetrics} doctors={doctors} onClose={() => setModal(null)} onSave={saveTreatment}/>}
    {modal?.type === 'patient-card' && <PatientRecord patient={patientsWithMetrics.find(patient => patient.id === modal.patientId)} initialTab={modal.initialTab} appointments={appointments.filter(appointment => appointment.patientId === modal.patientId)} treatments={treatments.filter(treatment => treatment.patientId === modal.patientId)} invoices={invoicesWithTotals.filter(invoice => invoice.patientId === modal.patientId)} doctors={doctors} onClose={() => setModal(null)} onSave={updatePatient} onDelete={deletePatient} onTreatment={treatment => setModal({ type: 'treatment', treatment })} onNewTreatment={() => setModal({ type: 'treatment', treatment: { patientId: modal.patientId } })} onPay={invoice => setModal({ type: 'payment', invoice })} onNewInvoice={() => setModal({ type: 'invoice', treatment: { patientId: modal.patientId } })}/>}
    {modal?.type === 'doctor-report' && <DoctorReport doctor={modal.doctor} appointments={appointments.filter(appointment => appointment.doctorId === modal.doctor.id)} invoices={invoicesWithTotals.filter(invoice => invoice.doctorId === modal.doctor.id)} patients={patientsWithMetrics} onClose={() => setModal(null)} onPatient={patientId => setModal({ type: 'patient-card', patientId })}/>}
    {modal?.type === 'staff' && <StaffForm employee={modal.employee} onClose={() => setModal(null)} onSave={saveStaff} onLogout={modal.employee?.id === currentAccount.id ? logout : null}/>}
    {modal?.type === 'director' && <DirectorForm director={director} onClose={() => setModal(null)} onSave={saveDirector} onLogout={logout}/>} 
    {selectedPatientDetails && <PatientDrawer patient={selectedPatientDetails} appointments={appointments.filter(a => a.patientId === selectedPatientDetails.id)} treatments={treatments.filter(treatment => treatment.patientId === selectedPatientDetails.id)} invoices={invoicesWithTotals.filter(invoice => invoice.patientId === selectedPatientDetails.id)} onClose={() => setSelectedPatient(null)} onOpenFull={initialTab => { setModal({ type: 'patient-card', patientId: selectedPatientDetails.id, initialTab }); setSelectedPatient(null) }} onAppointment={() => { setSelectedPatient(null); setModal('appointment') }}/>}
    {toast && <div className="toast"><span><Icon name="check" size={16}/></span>{toast}</div>}
  </div>
}

function Dashboard({ appointments, patients, invoices, onPage, onPatient, onAppointment }) {
  const unpaid = invoices.reduce((sum, item) => sum + item.amount - item.paid, 0)
  const income = invoices.reduce((sum, item) => sum + item.paid, 0)
  const cards = [
    ['Приемов сегодня', appointments.length, 'calendar', 'blue', '+2 к прошлому дню'],
    ['Пациентов в базе', patients.length, 'userplus', 'green', `${patients.filter(patient => patient.createdAt === todayIso()).length} добавлено сегодня`],
    ['Получено оплат', rub(income), 'trend', 'purple', `${invoices.reduce((sum, invoice) => sum + (invoice.payments?.length || 0), 0)} операций`],
    ['Задолженность', rub(unpaid), 'wallet', 'orange', `${invoices.filter(invoice => invoice.status !== 'paid').length} неоплаченных счетов`],
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
  const [selectedDate, setSelectedDate] = useState(todayIso())
  const changeDate = days => { const date = new Date(`${selectedDate}T12:00:00`); date.setDate(date.getDate() + days); setSelectedDate(date.toISOString().slice(0, 10)) }
  const dateLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${selectedDate}T12:00:00`))
  const visibleAppointments = appointments.filter(appointment => !appointment.date || appointment.date === selectedDate)
  const hours = Array.from({length:10}, (_,i) => `${String(i+9).padStart(2,'0')}:00`)
  return <section className="panel calendar-panel">
    <div className="calendar-toolbar"><div className="segmented">{['День','Неделя','Месяц'].map(v => <button className={view === v ? 'active' : ''} onClick={() => setView(v)} key={v}>{v}</button>)}</div><div className="calendar-date"><button onClick={() => changeDate(-1)}>‹</button><b>{dateLabel}</b><button onClick={() => changeDate(1)}>›</button><button className="today-button" onClick={() => setSelectedDate(todayIso())}>Сегодня</button></div><div className="doctor-filter"><span className="doctor-stack">{doctors.map(d => <Avatar key={d.id} initials={d.initials} color={d.color} size="xs"/>)}</span><b>Все врачи ({doctors.length})</b></div></div>
    {view === 'День' ? <div className="day-calendar"><div className="calendar-head"><span/>{doctors.slice(0,3).map(doctor => <div key={doctor.id}><Avatar initials={doctor.initials} color={doctor.color} size="sm"/><b>{doctor.name}</b><small>{doctor.specialty || 'Врач'}</small></div>)}</div><div className="calendar-body">{hours.map(hour => <div className="calendar-line" key={hour}><span>{hour}</span><i/><i/><i/></div>)}{visibleAppointments.map((appointment,index) => <button key={appointment.id} className={`calendar-event event-${appointment.color}`} style={{top:`${index * 68 + 18}px`, left:`calc(${Math.max(0, doctors.findIndex(doctor => doctor.id === appointment.doctorId))*33.333 + 8.5}% + 38px)`}} onClick={() => onPatient(patients.find(patient => patient.id === appointment.patientId))}><b>{appointment.time} · {appointment.patient}</b><span>{appointment.type}</span><small>{appointment.room}</small></button>)}<button className="free-slot" style={{top:'355px',left:'calc(41.8% + 38px)'}} onClick={onNew}><Icon name="plus" size={15}/>Свободное окно</button></div></div> : <CalendarSummary view={view} appointments={visibleAppointments}/>}
  </section>
}

function CalendarSummary({ view, appointments }) { return <div className="calendar-summary"><div className="calendar-summary-icon"><Icon name="calendar" size={34}/></div><h3>{view === 'Неделя' ? 'Неделя 3–9 августа' : 'Август 2026'}</h3><p>{appointments.length * (view === 'Неделя' ? 6 : 24)} приемов запланировано · загрузка 78%</p><div className="week-strip">{['Пн 3','Вт 4','Ср 5','Чт 6','Пт 7','Сб 8','Вс 9'].map((d,i) => <span className={i===0?'active':''} key={d}><b>{d.split(' ')[1]}</b><small>{d.split(' ')[0]}</small><i style={{height: `${30+i*7}%`}}/></span>)}</div></div> }

function PatientsPage({ patients, onPatient, onOpenFull, onNew, onDelete, onDeleteMany }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])
  const filtered = patients.filter(patient => `${patient.name} ${patient.phone} ${patient.card}`.toLowerCase().includes(query.toLowerCase()))
  const visibleIds = filtered.map(patient => patient.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selected.includes(id))
  useEffect(() => setSelected(previous => previous.filter(id => patients.some(patient => patient.id === id))), [patients])
  const togglePatient = id => setSelected(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])
  const toggleVisible = () => setSelected(previous => allVisibleSelected ? previous.filter(id => !visibleIds.includes(id)) : [...new Set([...previous, ...visibleIds])])
  const removeSelected = () => { if (onDeleteMany(selected) !== false) setSelected([]) }
  return <section className="panel table-panel">
    <div className="table-tools"><div className="table-search"><Icon name="search" size={18}/><input placeholder="Найти пациента..." value={query} onChange={event => setQuery(event.target.value)}/></div><button className="filter-button">Все пациенты⌄</button><span className="table-count">Всего: {patients.length}</span></div>
    {selected.length > 0 && <div className="bulk-actions"><span><b>Выбрано: {selected.length}</b><small>Можно удалить сразу несколько пациентов</small></span><button className="link-button" onClick={() => setSelected([])}>Снять выбор</button><button className="button danger compact" onClick={removeSelected}><Icon name="trash" size={15}/>Удалить выбранных</button></div>}
    <div className="data-table patient-table">
      <div className="table-header"><label className="selection-check" title="Выбрать всех показанных"><input type="checkbox" checked={allVisibleSelected} onChange={toggleVisible}/><span><Icon name="check" size={12}/></span></label><span>Пациент</span><span>Контакты</span><span>Последний прием</span><span>Посещений</span><span>Баланс</span><span>Действия</span></div>
      {filtered.map(patient => <div className={`table-row patient-selectable-row ${selected.includes(patient.id) ? 'selected' : ''}`} key={patient.id} role="button" tabIndex="0" onClick={() => onPatient(patient)} onKeyDown={event => { if (event.key === 'Enter') onPatient(patient) }}>
        <label className="selection-check" aria-label={`Выбрать ${patient.name}`} onClick={event => event.stopPropagation()}><input type="checkbox" checked={selected.includes(patient.id)} onChange={() => togglePatient(patient.id)}/><span><Icon name="check" size={12}/></span></label>
        <span className="person-cell"><Avatar initials={patient.initials} color={patient.color}/><span><b>{patient.name}</b><small>{patient.card} · {patient.age} лет</small></span></span>
        <span className="contact-cell"><b>{patient.phone}</b><small>{patient.email}</small></span>
        <span><b>{patient.lastVisit}</b><small>Михаил Орлов</small></span>
        <span className="visit-count">{patient.visits}</span>
        <span className={patient.debt ? 'debt' : 'clear'}>{patient.debt ? `− ${rub(patient.debt)}` : 'Нет долга'}</span>
        <span className="patient-row-actions"><button className="quick-card" title="Открыть полную карту" aria-label={`Открыть полную карту ${patient.name}`} onClick={event => { event.stopPropagation(); onOpenFull(patient) }}><Icon name="settings" size={17}/></button><button className="quick-delete" title="Быстро удалить пациента" aria-label={`Удалить ${patient.name}`} onClick={event => { event.stopPropagation(); onDelete(patient) }}><Icon name="trash" size={16}/></button></span>
      </div>)}
    </div>
    {filtered.length === 0 && <Empty icon="search" title="Ничего не найдено" text="Попробуйте изменить запрос или создайте нового пациента" action="Новый пациент" onAction={onNew}/>}<div className="pagination"><span>Показано {filtered.length} из {patients.length}</span><div><button disabled>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div></div>
  </section>
}

function FinancePage({ invoices, patients, doctors, onPay, onNew, onPatient }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('all')
  const filtered = invoices.filter(invoice => {
    const statusMatch = filter === 'all' || (filter === 'waiting' ? invoice.status !== 'paid' : invoice.status === 'paid')
    const doctorMatch = doctorFilter === 'all' || invoice.doctorId === Number(doctorFilter)
    const queryMatch = `${invoice.id} ${invoice.patient} ${invoice.service}`.toLowerCase().includes(query.toLowerCase())
    return statusMatch && doctorMatch && queryMatch
  })
  const allPayments = invoices.flatMap(invoice => (invoice.payments || []).map(payment => ({ ...payment, invoiceId: invoice.id, patient: invoice.patient, patientId: invoice.patientId, service: invoice.service })))
  const todayIncome = allPayments.filter(payment => payment.date === todayDisplay()).reduce((sum, payment) => sum + Number(payment.amount), 0)
  const income = allPayments.reduce((sum, payment) => sum + Number(payment.amount), 0)
  const debt = invoices.reduce((sum, invoice) => sum + invoice.balance, 0)
  return <>
    <section className="finance-summary">
      <article><span>Принято сегодня</span><strong>{rub(todayIncome)}</strong><small>{todayIncome ? `${allPayments.filter(payment => payment.date === todayDisplay()).length} операций` : 'Сегодня оплат пока не было'}</small></article>
      <article><span>Всего принято оплат</span><strong>{rub(income)}</strong><small>{allPayments.length} подтвержденных операций</small><div className="progress"><i style={{width: `${Math.min(100, invoices.length ? income / invoices.reduce((sum, invoice) => sum + invoice.amount, 0) * 100 : 0)}%`}}/></div></article>
      <article className="debt-card"><span>Общая задолженность</span><strong>{rub(debt)}</strong><small>{invoices.filter(invoice => invoice.status !== 'paid').length} активных счетов</small></article>
    </section>
    <section className="panel table-panel">
      <div className="panel-heading finance-heading"><div><h2>Счета пациентов</h2><p>Суммы, задолженности и прием оплат</p></div><button className="button primary compact" onClick={onNew}><Icon name="plus" size={16}/>Создать счет</button></div>
      <div className="finance-tools"><div className="table-search"><Icon name="search" size={18}/><input placeholder="Счет, пациент или услуга..." value={query} onChange={event => setQuery(event.target.value)}/></div><select value={doctorFilter} onChange={event => setDoctorFilter(event.target.value)}><option value="all">Все врачи</option>{doctors.map(doctor => <option value={doctor.id} key={doctor.id}>{doctor.name}</option>)}</select><div className="segmented">{[['all','Все'],['waiting','Ожидают'],['paid','Оплачены']].map(([key,label]) => <button key={key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div></div>
      <div className="data-table invoice-table"><div className="table-header"><span>Счет</span><span>Пациент / услуга</span><span>Сумма</span><span>Оплачено</span><span>Статус</span><span/></div>{filtered.map(invoice => <div className="table-row" key={invoice.id}><span><b>{invoice.id}</b><small>{invoice.date}</small></span><button className="invoice-patient" onClick={() => onPatient(invoice.patientId)}><b>{invoice.patient}</b><small>{invoice.service}</small></button><span><b>{rub(invoice.amount)}</b></span><span><b>{rub(invoice.paid)}</b><small>Остаток {rub(invoice.balance)}</small></span><Status value={invoice.status}/><span>{invoice.status !== 'paid' ? <button className="pay-button" onClick={() => onPay(invoice)}>Принять оплату</button> : <span className="payment-complete"><Icon name="check" size={16}/>Оплачено</span>}</span></div>)}</div>
      {!filtered.length && <Empty icon="wallet" title="Счетов не найдено" text="Измените фильтр или создайте новый счет" action="Создать счет" onAction={onNew}/>}
    </section>
    <section className="panel payment-log"><div className="panel-heading"><div><h2>Журнал оплат</h2><p>Каждая принятая операция с указанием способа оплаты</p></div><strong>{allPayments.length} операций</strong></div>{allPayments.length ? allPayments.slice().reverse().map(payment => <button key={`${payment.invoiceId}-${payment.id}`} onClick={() => onPatient(payment.patientId)}><span className="payment-icon"><Icon name="wallet" size={17}/></span><span><b>{payment.patient}</b><small>{payment.invoiceId} · {payment.service}</small></span><span><b>{payment.method}</b><small>{payment.date}</small></span><strong>{rub(payment.amount)}</strong></button>) : <p className="muted">Оплаты появятся здесь после проведения первой операции.</p>}</section>
  </>
}

function TreatmentPage({ treatments, patients, doctors, invoices, onOpen, onNew, onPatient }) {
  const [selectedId, setSelectedId] = useState(treatments[0]?.id || null)
  useEffect(() => { if (!treatments.some(treatment => treatment.id === selectedId)) setSelectedId(treatments[0]?.id || null) }, [treatments, selectedId])
  const selected = treatments.find(treatment => treatment.id === selectedId)
  const patient = selected ? patients.find(item => item.id === selected.patientId) : null
  const doctor = selected ? doctors.find(item => item.id === selected.doctorId) : null
  const invoice = selected ? invoices.find(item => item.id === selected.invoiceId || item.treatmentId === selected.id) : null
  return <div className="treatment-grid live-treatment-grid">
    <section className="panel treatment-list-panel">
      <div className="panel-heading"><div><h2>Планы лечения</h2><p>{treatments.filter(item => item.status === 'active').length} активных · {treatments.filter(item => item.status === 'completed').length} завершено</p></div><button className="button primary compact" onClick={onNew}><Icon name="plus" size={16}/>Новый план</button></div>
      {treatments.map(treatment => { const itemPatient = patients.find(item => item.id === treatment.patientId); const itemDoctor = doctors.find(item => item.id === treatment.doctorId); return <button className={`treatment-plan ${selectedId === treatment.id ? 'selected' : ''}`} key={treatment.id} onClick={() => setSelectedId(treatment.id)}><Avatar initials={itemPatient?.initials || 'П'} color={itemPatient?.color}/><span className="treatment-plan-copy"><b>{itemPatient?.name || 'Пациент удален'}</b><span>{treatment.title}</span><div className="mini-progress"><i style={{width: `${treatment.progress}%`}}/></div><small>{treatment.progress}% · {itemDoctor?.name || 'Врач не указан'}</small></span><span className="treatment-plan-total"><strong>{rub(treatment.total)}</strong><small>{treatmentStatusMap[treatment.status] || treatment.status}</small></span><Icon name="arrow" size={18}/></button> })}
      {!treatments.length && <Empty icon="tooth" title="Планов лечения пока нет" text="Создайте первый план и привяжите его к пациенту и врачу" action="Новый план" onAction={onNew}/>}
    </section>
    <section className="panel treatment-detail">
      {selected && patient ? <>
        <div className="treatment-detail-head"><div><span className={`treatment-state treatment-${selected.status}`}>{treatmentStatusMap[selected.status] || selected.status}</span><h2>{selected.title}</h2><button className="link-button" onClick={() => onPatient(patient.id)}>{patient.name} · {patient.card}</button></div><button className="button secondary" onClick={() => onOpen(selected)}><Icon name="settings" size={16}/>Редактировать</button></div>
        <div className="treatment-facts"><span><small>Лечащий врач</small><b>{doctor?.name || 'Не указан'}</b></span><span><small>Стоимость плана</small><b>{rub(selected.total)}</b></span><span><small>Оплачено</small><b>{rub(invoice?.paid || 0)}</b></span><span><small>Остаток</small><b className={invoice?.balance ? 'debt' : 'clear'}>{rub(invoice?.balance || 0)}</b></span></div>
        <div className="treatment-notes"><article><small>Диагноз</small><p>{selected.diagnosis || 'Не указан'}</p></article><article><small>Процедуры</small><p>{selected.procedures || 'Не указаны'}</p></article></div>
        <div className="panel-heading stages-heading"><div><h3>Этапы лечения</h3><p>{(selected.stages || []).filter(stage => stage.done).length} из {(selected.stages || []).length} завершено</p></div><strong>{selected.progress}%</strong></div>
        <div className="treatment-stages">{(selected.stages || []).map(stage => <div key={stage.id}><span className={stage.done ? 'done' : ''}><Icon name="check" size={14}/></span><b>{stage.title}</b><strong>{rub(stage.cost)}</strong></div>)}</div>
        <div className="tooth-card inline-tooth-card"><div className="panel-heading"><div><h3>Карта зубов</h3><p>{selected.teeth || 'Зубы не отмечены'}</p></div></div><div className="teeth-map">{Array.from({length:16},(_,index) => { const number = index < 8 ? 18 - index : 21 + index - 8; const marked = String(selected.teeth || '').includes(String(number)); return <span className={marked ? selected.status === 'completed' ? 'treated' : 'attention' : ''} key={number}><Icon name="tooth" size={24}/><small>{number}</small></span> })}</div></div>
        <button className="button primary full open-treatment-button" onClick={() => onOpen(selected)}>Открыть и изменить карту лечения</button>
      </> : <Empty icon="tooth" title="Выберите план лечения" text="Слева отображаются все связанные с пациентами планы" action="Создать план" onAction={onNew}/>}
    </section>
  </div>
}

function DocumentsPage() { const docs=[['План лечения — Кузнецова М.А.','PDF · 1,2 МБ','Сегодня, 10:14'],['Согласие на обработку данных','DOCX · 86 КБ','1 августа, 16:40'],['КТ челюсти — Смирнов А.В.','JPG · 4,8 МБ','30 июля, 11:05'],['Договор №184/26','PDF · 540 КБ','28 июля, 09:30']]; return <section className="panel"><div className="document-hero"><div><span><Icon name="upload" size={24}/></span><h3>Загрузите документы или фотографии</h3><p>PDF, Word, JPG и PNG до 25 МБ</p><button className="button primary">Выбрать файлы</button></div></div><div className="panel-heading"><div><h2>Недавние файлы</h2><p>Все документы клиники</p></div><button className="text-button">Фильтры</button></div><div className="document-grid">{docs.map((d,i)=><article key={d[0]}><span className={`file-type file-${i===2?'image':i===1?'word':'pdf'}`}><Icon name="file"/></span><div><b>{d[0]}</b><small>{d[1]}</small></div><small>{d[2]}</small><button><Icon name="dots"/></button></article>)}</div></section> }

function ReportsPage({ doctors, appointments, invoices, patients, onDoctor }) {
  const totalIncome = invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
  const doctorStats = doctors.map(doctor => {
    const doctorInvoices = invoices.filter(invoice => invoice.doctorId === doctor.id)
    const doctorAppointments = appointments.filter(appointment => appointment.doctorId === doctor.id)
    return { doctor, appointments: doctorAppointments.length, patients: new Set(doctorAppointments.map(appointment => appointment.patientId)).size, billed: doctorInvoices.reduce((sum, invoice) => sum + invoice.amount, 0), income: doctorInvoices.reduce((sum, invoice) => sum + invoice.paid, 0), debt: doctorInvoices.reduce((sum, invoice) => sum + invoice.balance, 0) }
  }).sort((left, right) => right.income - left.income)
  const averageCheck = invoices.length ? Math.round(invoices.reduce((sum, invoice) => sum + invoice.amount, 0) / invoices.length) : 0
  const cancelled = appointments.filter(appointment => appointment.status === 'cancelled').length
  const cancellationRate = appointments.length ? Math.round(cancelled / appointments.length * 100) : 0
  const monthly = Array.from({ length: 8 }, (_, month) => invoices.flatMap(invoice => invoice.payments || []).filter(payment => Number(payment.date?.split('.')[1]) === month + 1).reduce((sum, payment) => sum + Number(payment.amount), 0))
  const maxMonth = Math.max(1, ...monthly)
  return <>
    <div className="report-grid"><section className="panel report-chart"><div className="panel-heading"><div><h2>Фактическая выручка</h2><p>По проведенным оплатам за 2026 год</p></div><b className="report-total">{rub(totalIncome)}</b></div><div className="report-bars">{monthly.map((value,index) => <div key={index}><span title={rub(value)}><i style={{height: `${Math.max(4, value / maxMonth * 100)}%`}}/></span><b>{['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг'][index]}</b><small>{value ? rub(value) : '—'}</small></div>)}</div></section><section className="panel doctor-report live-doctor-report"><div className="panel-heading"><div><h2>Доход по врачам</h2><p>Только реальные оплаты по связанным счетам</p></div></div>{doctorStats.map(stat => <button key={stat.doctor.id} onClick={() => onDoctor(stat.doctor)}><Avatar initials={stat.doctor.initials} color={stat.doctor.color} size="sm"/><span><b>{stat.doctor.name}</b><small>{stat.appointments} приемов · {stat.patients} пациентов</small></span><strong>{rub(stat.income)}<small>долг {rub(stat.debt)}</small></strong><Icon name="arrow" size={17}/></button>)}</section></div>
    <section className="kpi-strip"><article><span>Пациентов в базе</span><strong>{patients.length}</strong><small>Связаны с картами и счетами</small></article><article><span>Всего приемов</span><strong>{appointments.length}</strong><small>{new Set(appointments.map(appointment => appointment.patientId)).size} уникальных пациентов</small></article><article><span>Средний счет</span><strong>{rub(averageCheck)}</strong><small>{invoices.length} выставленных счетов</small></article><article><span>Отмен приемов</span><strong>{cancellationRate}%</strong><small className={cancellationRate > 10 ? 'negative' : ''}>{cancelled} отменено</small></article></section>
  </>
}

function StaffPage({ staff, appointments, invoices, onEdit }) { return <section className="staff-grid">{staff.map((employee,index) => { const visitCount = appointments.filter(appointment => appointment.doctorId === employee.id).length; const income = invoices.filter(invoice => invoice.doctorId === employee.id).reduce((sum, invoice) => sum + invoice.paid, 0); return <article className="panel staff-card" key={employee.id}><span className={`staff-cover cover-${index % 4}`}/><Avatar initials={employee.initials} color={employee.color || 'teal'} size="lg"/><h3>{employee.name}</h3><p>{employee.specialty || employee.role}</p><span className="role-chip">{employee.role}</span><small className="staff-account">Логин: {employee.login || accountLogin(employee)}</small><Status value={employee.active ? 'active' : 'inactive'}/><div><span><b>{employee.role === 'Врач' ? visitCount : '—'}</b><small>приемов</small></span><span><b>{employee.role === 'Врач' ? rub(income) : employee.permissions?.length || 0}</b><small>{employee.role === 'Врач' ? 'принято оплат' : 'разделов доступа'}</small></span></div><button className="button secondary full" onClick={() => onEdit(employee)}>Открыть профиль</button></article> })}</section> }

function SettingsPage({ director, staff, onEditDirector, onEditStaff, onSave }) {
  const [section, setSection] = useState('clinic')
  return <div className="settings-layout">
    <aside className="panel settings-nav">
      <button className={section === 'clinic' ? 'active' : ''} onClick={() => setSection('clinic')}><Icon name="tooth"/>Профиль клиники</button>
      <button className={section === 'access' ? 'active' : ''} onClick={() => setSection('access')}><Icon name="users"/>Директор и права</button>
      <button onClick={() => setSection('access')}><Icon name="staff"/>Пользователи и роли</button>
      <button><Icon name="calendar"/>Расписание работы</button><button><Icon name="bell"/>Уведомления</button><button><Icon name="wallet"/>Платежи</button><button><Icon name="file"/>Шаблоны документов</button>
    </aside>
    {section === 'clinic' ? <section className="panel settings-form"><div className="panel-heading"><div><h2>Профиль клиники</h2><p>Эта информация отображается в документах и уведомлениях</p></div></div><div className="clinic-logo-setting"><span><Icon name="tooth" size={31}/></span><div><b>Логотип клиники</b><p>PNG или JPG, не менее 512 × 512</p><button className="link-button">Загрузить новый</button></div></div><div className="form-grid"><label className="full-field">Название клиники<input defaultValue="Дента Плюс"/></label><label>Телефон<input defaultValue="+7 495 120-45-45"/></label><label>Email<input defaultValue="hello@dentaplus.ru"/></label><label className="full-field">Адрес<input defaultValue="Москва, ул. Спокойная, 12"/></label><label>Часовой пояс<select defaultValue="moscow"><option value="moscow">Москва (UTC+3)</option></select></label><label>Валюта<select defaultValue="rub"><option value="rub">Российский рубль (₽)</option></select></label></div><div className="settings-footer"><button className="button secondary">Отменить</button><button className="button primary" onClick={onSave}>Сохранить изменения</button></div></section> : <section className="panel settings-form access-settings"><div className="panel-heading"><div><h2>Директор и распределение прав</h2><p>Изменяйте данные руководителя и доступ каждого сотрудника</p></div></div><div className="director-settings-card"><Avatar initials={director.initials} color="navy" size="lg"/><span><b>{director.name}</b><small>{director.role} · {director.email} · логин {director.login}</small><em>Доступно разделов: {director.permissions.length}</em></span><button className="button secondary" onClick={onEditDirector}>Изменить директора</button></div><div className="access-section-title"><div><h3>Сотрудники и роли</h3><p>Откройте профиль, чтобы изменить роль, логин, пароль или права</p></div><span>{staff.length} сотрудников</span></div><div className="settings-team-list">{staff.map(employee => <button key={employee.id} onClick={() => employee.isDirector ? onEditDirector() : onEditStaff(employee)}><Avatar initials={employee.initials} color={employee.color} size="sm"/><span><b>{employee.name}</b><small>{employee.role} · логин {employee.login || accountLogin(employee)} · {employee.permissions?.length || 0} разделов</small></span><Status value={employee.active ? 'active' : 'inactive'}/><Icon name="arrow" size={17}/></button>)}</div></section>}
  </div>
}

function PatientDrawer({ patient, appointments, treatments, invoices, onClose, onOpenFull, onAppointment }) {
  const activeTreatment = treatments.find(treatment => treatment.status === 'active') || treatments[0]
  const paid = invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="patient-drawer" onMouseDown={event => event.stopPropagation()}><div className="drawer-head"><button onClick={onClose}><Icon name="close"/></button><span>Краткая карточка пациента</span><button onClick={() => onOpenFull('overview')} title="Открыть полную карту"><Icon name="settings"/></button></div><div className="patient-hero"><Avatar initials={patient.initials} color={patient.color} size="xl"/><h2>{patient.name}</h2><p>{patient.card} · {patient.age} лет</p><div><button><Icon name="phone"/>Позвонить</button><button><Icon name="mail"/>Написать</button></div></div>{patient.allergy && <div className="allergy-alert"><b>Аллергия</b><span>{patient.allergy}</span></div>}<div className="patient-meta"><label>Телефон<b>{patient.phone}</b></label><label>Email<b>{patient.email || 'Не указан'}</b></label><label>Приемов<b>{appointments.length}</b></label><label>Баланс<b className={patient.debt ? 'debt' : 'clear'}>{patient.debt ? `Долг ${rub(patient.debt)}` : 'Нет задолженности'}</b></label></div>{(patient.chronicDiseases || patient.medicalInfo) && <div className="drawer-section"><div><h3>Медицинская информация</h3></div><p className="medical-note">{patient.chronicDiseases || patient.medicalInfo}</p></div>}<div className="drawer-section"><div><h3>Последние приемы</h3><button onClick={() => onOpenFull('visits')}>Вся история</button></div>{appointments.length ? appointments.slice(-3).map(appointment => <article key={appointment.id}><span className={`visit-mark ${appointment.status}`}><Icon name="tooth"/></span><div><b>{appointment.type}</b><small>{appointment.date ? toDisplayDate(appointment.date) : 'Сегодня'}, {appointment.time} · {appointment.doctor}</small></div><Status value={appointment.status}/></article>) : <p className="muted">Приемов пока не было</p>}</div><div className="drawer-section"><div><h3>План лечения</h3><button onClick={() => onOpenFull('treatment')}>Открыть</button></div>{activeTreatment ? <><div className="plan-summary"><span><b>{activeTreatment.title}</b><small>{activeTreatment.progress}% завершено</small></span><strong>{rub(activeTreatment.total)}</strong></div><div className="progress"><i style={{width: `${activeTreatment.progress}%`}}/></div></> : <p className="muted">План лечения еще не создан</p>}</div><div className="drawer-finance-summary"><span><small>Выставлено</small><b>{rub(invoices.reduce((sum, invoice) => sum + invoice.amount, 0))}</b></span><span><small>Оплачено</small><b>{rub(paid)}</b></span><button onClick={() => onOpenFull('finance')}>Открыть финансы <Icon name="arrow" size={15}/></button></div><div className="drawer-actions"><button className="button secondary" onClick={() => onOpenFull('overview')}><Icon name="settings" size={16}/>Полная карта</button><button className="button primary" onClick={onAppointment}><Icon name="plus"/>Записать на прием</button></div></aside></div>
}

function Modal({ title, subtitle, onClose, children, footer, className = '' }) { return <div className="modal-backdrop" onMouseDown={onClose}><section className={`modal ${className}`} onMouseDown={event => event.stopPropagation()}><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button onClick={onClose}><Icon name="close"/></button></div><div className="modal-body">{children}</div>{footer && <div className="modal-footer">{footer}</div>}</section></div> }

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

function PatientRecord({ patient, initialTab = 'overview', appointments, treatments, invoices, doctors, onClose, onSave, onDelete, onTreatment, onNewTreatment, onPay, onNewInvoice }) {
  const [tab, setTab] = useState(initialTab || 'overview')
  const [data, setData] = useState(() => ({ ...patient, birth: toInputDate(patient?.birth) }))
  if (!patient) return null
  const field = key => ({ value: data[key] || '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const save = event => { event.preventDefault(); onSave({ ...data, birth: data.birth, visits: patient.visits, debt: patient.debt, lastVisit: patient.lastVisit }) }
  const billed = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paid = invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
  return <Modal className="patient-record-modal" title="Полная карта пациента" subtitle={`${patient.card} · все данные, лечение и взаиморасчеты`} onClose={onClose}>
    <div className="record-hero"><Avatar initials={patient.initials} color={patient.color} size="xl"/><span><h2>{patient.name}</h2><p>{patient.phone} · {patient.email || 'email не указан'}</p></span><div><small>Текущий баланс</small><b className={patient.debt ? 'debt' : 'clear'}>{patient.debt ? `Долг ${rub(patient.debt)}` : 'Нет задолженности'}</b></div></div>
    <nav className="record-tabs">{[['overview','Данные'],['treatment','Лечение'],['finance','Финансы'],['visits','Приемы']].map(([key,label]) => <button className={tab === key ? 'active' : ''} onClick={() => setTab(key)} key={key}>{label}{key === 'treatment' && <em>{treatments.length}</em>}{key === 'finance' && <em>{invoices.length}</em>}{key === 'visits' && <em>{appointments.length}</em>}</button>)}</nav>
    {tab === 'overview' && <form className="modal-form record-form" onSubmit={save}>
      <label className="full-field">ФИО пациента<input required {...field('name')}/></label>
      <label>Телефон<input required {...field('phone')}/></label>
      <label>Email<input type="email" {...field('email')}/></label>
      <label>Дата рождения<input type="date" {...field('birth')}/></label>
      <label>Пол<select {...field('gender')}><option value="">Не указан</option><option>Женский</option><option>Мужской</option><option>Другой</option></select></label>
      <label className="full-field">Адрес<input {...field('address')}/></label>
      <label className="full-field">Аллергии<textarea {...field('allergy')}/></label>
      <label className="full-field">Хронические заболевания<textarea {...field('chronicDiseases')}/></label>
      <label className="full-field">Медицинская информация<textarea {...field('medicalInfo')}/></label>
      <label className="full-field">Примечание<textarea {...field('notes')}/></label>
      <div className="record-form-actions full-field">
        <button type="button" className="button danger" onClick={() => onDelete(patient)}><Icon name="trash" size={16}/>Удалить пациента</button>
        <span></span>
        <button type="button" className="button secondary" onClick={onClose}>Закрыть</button>
        <button className="button primary">Сохранить изменения</button>
      </div>
    </form>}
    {tab === 'treatment' && <section className="record-section"><div className="record-section-head"><div><h3>Планы лечения</h3><p>Назначения, этапы, стоимость и лечащий врач</p></div><button className="button primary compact" onClick={onNewTreatment}><Icon name="plus" size={16}/>Добавить лечение</button></div>{treatments.length ? treatments.map(treatment => { const doctor = doctors.find(item => item.id === treatment.doctorId); return <button className="record-treatment-row" key={treatment.id} onClick={() => onTreatment(treatment)}><span className={`treatment-state treatment-${treatment.status}`}>{treatmentStatusMap[treatment.status]}</span><span><b>{treatment.title}</b><small>{treatment.diagnosis || 'Диагноз не указан'} · {doctor?.name || 'врач не указан'}</small><i><em style={{width: `${treatment.progress}%`}}/></i></span><strong>{rub(treatment.total)}<small>{treatment.progress}% завершено</small></strong><Icon name="arrow" size={17}/></button> }) : <Empty icon="tooth" title="Лечение еще не назначено" text="Создайте план и при необходимости сразу выставьте счет" action="Добавить лечение" onAction={onNewTreatment}/>}</section>}
    {tab === 'finance' && <section className="record-section"><div className="record-finance-cards"><article><small>Выставлено</small><b>{rub(billed)}</b></article><article><small>Оплачено</small><b className="clear">{rub(paid)}</b></article><article><small>Остаток</small><b className={billed - paid > 0 ? 'debt' : 'clear'}>{rub(billed - paid)}</b></article></div><div className="record-section-head"><div><h3>Счета пациента</h3><p>Оплата принимается прямо из этой карты</p></div><button className="button primary compact" onClick={onNewInvoice}><Icon name="plus" size={16}/>Новый счет</button></div>{invoices.length ? invoices.map(invoice => <div className="record-invoice-row" key={invoice.id}><span><b>{invoice.id}</b><small>{invoice.date}</small></span><span><b>{invoice.service}</b><small>Сумма {rub(invoice.amount)}</small></span><span><b>{rub(invoice.paid)}</b><small>Остаток {rub(invoice.balance)}</small></span><Status value={invoice.status}/>{invoice.status !== 'paid' ? <button className="pay-button" onClick={() => onPay(invoice)}>Принять оплату</button> : <span className="payment-complete"><Icon name="check" size={15}/>Оплачено</span>}</div>) : <Empty icon="wallet" title="Счетов пока нет" text="Выставьте счет за консультацию или лечение" action="Создать счет" onAction={onNewInvoice}/>}</section>}
    {tab === 'visits' && <section className="record-section"><div className="record-section-head"><div><h3>История приемов</h3><p>Все записи пациента и их текущий статус</p></div></div>{appointments.length ? appointments.map(appointment => <div className="record-visit-row" key={appointment.id}><span className={`visit-mark ${appointment.status}`}><Icon name="calendar" size={17}/></span><span><b>{appointment.type}</b><small>{appointment.date ? toDisplayDate(appointment.date) : 'Сегодня'} · {appointment.time}–{appointment.end}</small></span><span><small>Врач</small><b>{appointment.doctor}</b></span><span><small>Кабинет</small><b>{appointment.room}</b></span><Status value={appointment.status}/></div>) : <Empty icon="calendar" title="Приемов пока нет" text="Запишите пациента через раздел расписания"/>}</section>}
  </Modal>
}

function TreatmentForm({ treatment, patients, doctors, onClose, onSave }) {
  const editing = Boolean(treatment?.id)
  const [data, setData] = useState(() => ({ patientId: treatment?.patientId || patients[0]?.id || '', doctorId: treatment?.doctorId || doctors[0]?.id || '', title: '', diagnosis: '', procedures: '', total: '', progress: 0, status: 'active', teeth: '', comment: '', createInvoice: !treatment?.invoiceId, ...treatment }))
  const [stagesText, setStagesText] = useState(() => (treatment?.stages || []).map(stage => `${stage.title} | ${stage.cost} | ${stage.done ? 'готово' : 'ожидает'}`).join('\n'))
  const field = key => ({ value: data[key] ?? '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const submit = event => {
    event.preventDefault()
    const stages = stagesText.split('\n').map((line, index) => { const [title, cost, state] = line.split('|').map(part => part?.trim()); return title ? { id: treatment?.stages?.[index]?.id || Date.now() + index, title, cost: Number(cost) || 0, done: /готов|да|выполн|^x$/i.test(state || '') } : null }).filter(Boolean)
    onSave({ ...data, patientId: Number(data.patientId), doctorId: Number(data.doctorId), total: Number(data.total), progress: Number(data.progress), stages })
  }
  return <Modal className="wide-modal" title={editing ? 'Карта лечения' : 'Новый план лечения'} subtitle={editing ? 'Измените диагноз, этапы, стоимость и прогресс' : 'Свяжите лечение с пациентом, врачом и счетом'} onClose={onClose} footer={<><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="treatment-form">{editing ? 'Сохранить карту' : 'Создать план'}</button></>}><form id="treatment-form" className="modal-form" onSubmit={submit}><label>Пациент<select required value={data.patientId} onChange={event => setData({ ...data, patientId: event.target.value })}>{patients.map(patient => <option value={patient.id} key={patient.id}>{patient.name} · {patient.card}</option>)}</select></label><label>Лечащий врач<select required value={data.doctorId} onChange={event => setData({ ...data, doctorId: event.target.value })}>{doctors.map(doctor => <option value={doctor.id} key={doctor.id}>{doctor.name} · {doctor.specialty}</option>)}</select></label><label className="full-field">Название плана<input required placeholder="Например, ортодонтическая коррекция" {...field('title')}/></label><label>Статус<select {...field('status')}><option value="planned">Запланирован</option><option value="active">Активный</option><option value="completed">Завершен</option></select></label><label>Выполнено, %<input type="number" min="0" max="100" {...field('progress')}/></label><label>Стоимость плана<input type="number" min="0" step="100" {...field('total')}/></label><label>Зубы / область<input placeholder="Например, 16, 26" {...field('teeth')}/></label><label className="full-field">Диагноз<textarea required placeholder="Диагноз пациента" {...field('diagnosis')}/></label><label className="full-field">Назначенные процедуры<textarea placeholder="Что необходимо выполнить" {...field('procedures')}/></label><label className="full-field stages-input">Этапы лечения<textarea value={stagesText} onChange={event => setStagesText(event.target.value)} placeholder={'Диагностика | 2500 | готово\nЛечение зуба 16 | 12400 | ожидает'}/><small>Каждый этап с новой строки: название | сумма | готово/ожидает</small></label><label className="full-field">Комментарий<textarea placeholder="Рекомендации и следующий шаг" {...field('comment')}/></label>{!treatment?.invoiceId && <label className="full-field active-switch"><input type="checkbox" checked={Boolean(data.createInvoice)} onChange={event => setData({ ...data, createInvoice: event.target.checked })}/><span/>Сразу создать связанный счет на стоимость лечения</label>}</form></Modal>
}

function InvoiceForm({ patients, doctors, treatment, onClose, onSave }) {
  const [data, setData] = useState(() => ({ patientId: treatment?.patientId || patients[0]?.id || '', doctorId: treatment?.doctorId || doctors[0]?.id || '', treatmentId: treatment?.id || null, service: treatment?.title || '', amount: treatment?.total || '', date: todayIso(), dueDate: '' }))
  const submit = event => { event.preventDefault(); onSave(data) }
  return <Modal title="Новый счет" subtitle="Выставьте пациенту счет за услугу или лечение" onClose={onClose} footer={<><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="invoice-form">Создать счет</button></>}><form id="invoice-form" className="modal-form" onSubmit={submit}><label className="full-field">Пациент<select required value={data.patientId} onChange={event => setData({ ...data, patientId: event.target.value })}>{patients.map(patient => <option value={patient.id} key={patient.id}>{patient.name} · {patient.card}</option>)}</select></label><label>Врач<select value={data.doctorId} onChange={event => setData({ ...data, doctorId: event.target.value })}><option value="">Не указан</option>{doctors.map(doctor => <option value={doctor.id} key={doctor.id}>{doctor.name}</option>)}</select></label><label>Дата счета<input type="date" value={data.date} onChange={event => setData({ ...data, date: event.target.value })}/></label><label className="full-field">Услуга<input required placeholder="Название услуги" value={data.service} onChange={event => setData({ ...data, service: event.target.value })}/></label><label>Сумма<input required type="number" min="1" step="100" value={data.amount} onChange={event => setData({ ...data, amount: event.target.value })}/></label><label>Оплатить до<input type="date" value={data.dueDate} onChange={event => setData({ ...data, dueDate: event.target.value })}/></label></form></Modal>
}

function DoctorReport({ doctor, appointments, invoices, patients, onClose, onPatient }) {
  const income = invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
  const billed = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const patientIds = [...new Set([...appointments.map(appointment => appointment.patientId), ...invoices.map(invoice => invoice.patientId)])]
  return <Modal className="wide-modal" title={`Финансовый отчет · ${doctor.name}`} subtitle="Из каких пациентов, счетов и оплат сложился результат врача" onClose={onClose}><div className="doctor-report-summary"><article><small>Приемов</small><b>{appointments.length}</b></article><article><small>Пациентов</small><b>{patientIds.length}</b></article><article><small>Выставлено</small><b>{rub(billed)}</b></article><article><small>Получено оплат</small><b className="clear">{rub(income)}</b></article><article><small>Задолженность</small><b className={billed - income ? 'debt' : 'clear'}>{rub(billed - income)}</b></article></div><div className="record-section-head"><div><h3>Счета врача</h3><p>Нажмите на пациента, чтобы открыть его полную карту</p></div></div><div className="doctor-invoice-list">{invoices.map(invoice => <button key={invoice.id} onClick={() => onPatient(invoice.patientId)}><Avatar initials={patients.find(patient => patient.id === invoice.patientId)?.initials || 'П'} color={patients.find(patient => patient.id === invoice.patientId)?.color} size="sm"/><span><b>{invoice.patient}</b><small>{invoice.id} · {invoice.service}</small></span><span><small>Выставлено</small><b>{rub(invoice.amount)}</b></span><span><small>Оплачено</small><b>{rub(invoice.paid)}</b></span><Status value={invoice.status}/><Icon name="arrow" size={16}/></button>)}{!invoices.length && <p className="muted">У врача пока нет связанных счетов.</p>}</div></Modal>
}

function AppointmentForm({ patients, doctors, onClose, onSave }) { const [data,setData]=useState({patientId:patients[0]?.id||'',doctorId:doctors[0]?.id||'',date:todayIso(),time:'09:00',end:'10:00',type:'Консультация',room:'Кабинет 2',comment:''}); const submit=e=>{e.preventDefault();onSave(data)}; return <Modal title="Новая запись" subtitle="Запланируйте прием пациента" onClose={onClose} footer={<><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="appointment-form" disabled={!patients.length || !doctors.length}><Icon name="calendar"/>Записать пациента</button></>}><form id="appointment-form" className="modal-form" onSubmit={submit}><label className="full-field">Пациент<select value={data.patientId} onChange={e=>setData({...data,patientId:e.target.value})}>{patients.map(p=><option value={p.id} key={p.id}>{p.name} · {p.phone}</option>)}</select></label><label>Дата<input type="date" value={data.date} onChange={e=>setData({...data,date:e.target.value})}/></label><label>Врач<select required value={data.doctorId} onChange={e=>setData({...data,doctorId:e.target.value})}>{doctors.length ? doctors.map(d=><option value={d.id} key={d.id}>{d.name} · {d.specialty || 'Врач'}</option>) : <option value="">Сначала добавьте врача</option>}</select></label><label>Начало<input type="time" value={data.time} onChange={e=>setData({...data,time:e.target.value})}/></label><label>Окончание<input type="time" value={data.end} onChange={e=>setData({...data,end:e.target.value})}/></label><label>Тип приема<input list="appointment-types" value={data.type} onChange={e=>setData({...data,type:e.target.value})}/><datalist id="appointment-types"><option value="Консультация"/><option value="Лечение кариеса"/><option value="Профессиональная гигиена"/><option value="Имплантация"/><option value="Ортодонтия"/></datalist></label><label>Кабинет<select value={data.room} onChange={e=>setData({...data,room:e.target.value})}><option>Кабинет 1</option><option>Кабинет 2</option><option>Кабинет 3</option></select></label><label className="full-field">Комментарий<textarea placeholder="Пожелания или важная информация" value={data.comment} onChange={e=>setData({...data,comment:e.target.value})}/></label><div className="slot-hint full-field"><Icon name="check"/><span><b>{doctors.length ? 'Врач выбран' : 'Нет доступных врачей'}</b><small>{doctors.length ? 'Новый врач появится здесь после добавления в разделе «Сотрудники»' : 'Добавьте активного сотрудника с ролью «Врач»'}</small></span></div></form></Modal> }

function StaffForm({ employee, onClose, onSave, onLogout }) {
  const editing = Boolean(employee)
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState(() => employee
    ? hydrateAccount(employee, initialStaff.find(item => String(item.id) === String(employee.id)))
    : { name: '', role: 'Врач', specialty: '', phone: '', email: '', login: '', password: '', active: true, permissions: permissionsByRole['Врач'] })
  const field = key => ({ value: data[key] || '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const setRole = role => setData({ ...data, role, permissions: permissionsByRole[role] || [] })
  const togglePermission = key => setData({ ...data, permissions: data.permissions.includes(key) ? data.permissions.filter(item => item !== key) : [...data.permissions, key] })
  const submit = event => { event.preventDefault(); onSave({ ...data, id: employee?.id, isDirector: employee?.isDirector || false }) }
  return <Modal title={editing ? 'Профиль сотрудника' : 'Новый сотрудник'} subtitle="Данные, вход, роль и доступ к разделам CRM" onClose={onClose} footer={<>{onLogout && <button className="button secondary" type="button" onClick={() => { onClose(); onLogout() }}><Icon name="logout" size={16}/>Выйти</button>}<span className="footer-spacer"/><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" form="staff-form">{editing ? 'Сохранить изменения' : 'Добавить сотрудника'}</button></>}>
    <form id="staff-form" className="modal-form" onSubmit={submit}>
      <label className="full-field">ФИО сотрудника<input required placeholder="Фамилия Имя Отчество" {...field('name')}/></label>
      <label>Роль<select value={data.role} onChange={event => setRole(event.target.value)}>{roleOptions.map(role => <option key={role}>{role}</option>)}</select></label>
      <label>Должность / специализация<input placeholder="Например, стоматолог-терапевт" {...field('specialty')}/></label>
      <label>Телефон<input placeholder="+7 900 000-00-00" {...field('phone')}/></label>
      <label>Email<input type="email" placeholder="employee@clinic.ru" {...field('email')}/></label>
      <label>Логин для входа<input required minLength="3" autoComplete="username" placeholder="Например, ivanov" {...field('login')}/></label>
      <label>Пароль<div className="password-input form-password"><input required minLength="6" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Не менее 6 символов" {...field('password')}/><button type="button" aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? '×' : '◉'}</button></div></label>
      <div className="full-field account-note"><Icon name="check" size={16}/><span><b>Данные для входа</b><small>Сотрудник сможет войти по логину или email и указанному паролю.</small></span></div>
      <div className="full-field permission-field"><span>Доступ к разделам</span><div className="permission-grid">{permissionOptions.map(([key,label]) => <label className="permission-check" key={key}><input type="checkbox" checked={data.permissions.includes(key)} onChange={() => togglePermission(key)}/><span><Icon name="check" size={13}/></span>{label}</label>)}</div></div>
      <label className="full-field active-switch"><input type="checkbox" checked={data.active} onChange={event => setData({ ...data, active: event.target.checked })}/><span/>Активная учетная запись</label>
    </form>
  </Modal>
}

function DirectorForm({ director, onClose, onSave, onLogout }) {
  const [data, setData] = useState(() => hydrateAccount(director, initialDirector))
  const [showPassword, setShowPassword] = useState(false)
  const field = key => ({ value: data[key] || '', onChange: event => setData({ ...data, [key]: event.target.value }) })
  const togglePermission = key => setData({ ...data, permissions: data.permissions.includes(key) ? data.permissions.filter(item => item !== key) : [...data.permissions, key] })
  return <Modal title="Директор и права доступа" subtitle="Данные руководителя, которые отображаются в системе" onClose={onClose} footer={<><button className="button secondary" type="button" onClick={() => { onClose(); onLogout() }}>Выйти из системы</button><span className="footer-spacer"/><button className="button secondary" type="button" onClick={onClose}>Отменить</button><button className="button primary" type="button" onClick={() => onSave(data)}>Сохранить</button></>}>
    <div className="director-form-head"><Avatar initials={getInitials(data.name)} color="navy" size="lg"/><div><b>{data.name}</b><span>Директор клиники</span></div></div>
    <div className="modal-form"><label className="full-field">ФИО директора<input required {...field('name')}/></label><label>Телефон<input {...field('phone')}/></label><label>Email<input type="email" {...field('email')}/></label><label className="full-field">Должность<input {...field('specialty')}/></label><label>Логин для входа<input required minLength="3" autoComplete="username" {...field('login')}/></label><label>Пароль<div className="password-input form-password"><input required minLength="6" type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...field('password')}/><button type="button" aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? '×' : '◉'}</button></div></label><div className="full-field account-note"><Icon name="check" size={16}/><span><b>Данные для входа директора</b><small>Вход работает по логину или email и указанному паролю.</small></span></div><div className="full-field permission-field"><span>Права директора</span><div className="permission-grid">{permissionOptions.map(([key,label]) => <label className="permission-check" key={key}><input type="checkbox" checked={data.permissions.includes(key)} onChange={() => togglePermission(key)}/><span><Icon name="check" size={13}/></span>{label}</label>)}</div></div></div>
  </Modal>
}

function PaymentForm({ invoice, onClose, onSave }) {
  const balance = invoice.balance ?? invoiceBalance(invoice)
  const [data, setData] = useState({ amount: balance, method: 'Банковская карта', date: todayIso(), comment: '' })
  const valid = Number(data.amount) > 0 && Number(data.amount) <= balance
  return <Modal title="Прием оплаты" subtitle={`${invoice.id} · ${invoice.patient}`} onClose={onClose} footer={<><button className="button secondary" onClick={onClose}>Отменить</button><button className="button primary" disabled={!valid} onClick={() => onSave({ id: invoice.id, ...data })}>Принять {rub(Number(data.amount) || 0)}</button></>}><div className="payment-summary"><span>Сумма счета<b>{rub(invoice.amount)}</b></span><span>Уже оплачено<b>{rub(invoice.paid)}</b></span><span>Остаток по счету<b>{rub(balance)}</b></span></div><div className="modal-form payment-fields"><label>Сумма оплаты<input type="number" min="1" max={balance} value={data.amount} onChange={event => setData({ ...data, amount: event.target.value })}/></label><label>Способ оплаты<select value={data.method} onChange={event => setData({ ...data, method: event.target.value })}><option>Банковская карта</option><option>Наличные</option><option>Банковский перевод</option></select></label><label>Дата оплаты<input type="date" value={data.date} onChange={event => setData({ ...data, date: event.target.value })}/></label><label className="full-field">Комментарий<input placeholder="Например, аванс или окончательный расчет" value={data.comment} onChange={event => setData({ ...data, comment: event.target.value })}/></label></div>{!valid && <p className="form-error">Сумма должна быть больше нуля и не превышать остаток {rub(balance)}.</p>}<label className="receipt-check checkbox"><input type="checkbox" defaultChecked/><span/>Сформировать запись об оплате в журнале</label></Modal>
}

function Notifications({ onClose }) { return <div className="notifications-pop"><div><h3>Уведомления</h3><button onClick={onClose}><Icon name="close" size={18}/></button></div><button><span className="task-icon green"><Icon name="userplus"/></span><div><b>Новый пациент</b><p>Полина Власова добавлена в базу</p><small>12 минут назад</small></div><i/></button><button><span className="task-icon blue"><Icon name="calendar"/></span><div><b>Прием подтвержден</b><p>Мария Кузнецова · сегодня, 09:00</p><small>36 минут назад</small></div><i/></button><button><span className="task-icon orange"><Icon name="clock"/></span><div><b>Изменено время приема</b><p>Дмитрий Попов перенесен на 14:30</p><small>1 час назад</small></div></button><button className="all-notifications">Показать все уведомления</button></div> }

function Empty({ icon, title, text, action, onAction }) { return <div className="empty"><span><Icon name={icon} size={28}/></span><h3>{title}</h3><p>{text}</p>{action&&<button className="button secondary" onClick={onAction}>{action}</button>}</div> }

export default App
