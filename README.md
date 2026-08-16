# Dental CRM — MVP

Рабочий прототип CRM для стоматологической клиники. В репозитории есть адаптивное React PWA и API на Django REST Framework с ролевым доступом, PostgreSQL, Redis, Celery и Nginx.

## Онлайн-демо

После включения GitHub Pages интерфейс доступен по адресу:

https://6970339-spec.github.io/dental006/

Онлайн-демо работает без сервера: изменения сохраняются локально в браузере посетителя. Это удобно для показа клиенту, но не предназначено для хранения настоящих медицинских данных.

## Что реализовано

- авторизация по JWT и роли директора, администратора и врача;
- смена и безопасное восстановление пароля по одноразовой ссылке;
- главная панель с приемами, задачами, загрузкой и ключевыми показателями;
- база пациентов с поиском по имени, телефону и номеру карты;
- медицинская карточка, аллергии, история приемов и план лечения;
- календарь «день / неделя / месяц», запись пациента и поиск свободных слотов;
- лечение, диагнозы, процедуры, стоимость и JSON-карта зубов;
- счета, частичная/полная оплата, баланс и отчеты по врачам;
- загрузка PDF, Word и изображений с привязкой к пациенту;
- уведомления, разграничение прав и аудит изменяющих API-запросов;
- ежедневные сжатые резервные копии PostgreSQL с хранением за 14 дней;
- PWA-манифест и service worker для установки на телефон/планшет;
- демонстрационные данные и интерактивный frontend fallback.

## Быстрый запуск интерфейса

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Откройте `http://localhost:5173`. На экране входа уже заполнена демо-учетная запись — достаточно нажать «Войти».

## Полный запуск через Docker

1. Скопируйте `.env.example` в `.env`.
2. Замените `SECRET_KEY` и пароли PostgreSQL.
3. Запустите:

```bash
docker compose up --build
```

Приложение будет доступно на `http://localhost:8080`.

Демо-пользователи создаются автоматически:

| Роль | Логин | Пароль |
|---|---|---|
| Директор | `director` | `demo1234` |
| Администратор | `admin` | `demo1234` |
| Врач | `doctor` | `demo1234` |

## Локальный backend без Docker

При отсутствии переменной `POSTGRES_HOST` backend использует SQLite — это удобно для разработки.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python manage.py makemigrations
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py seed_demo
.venv\Scripts\python manage.py runserver
```

API: `http://localhost:8000/api/`, JWT: `POST /api/auth/login/`.

## Основные endpoints

- `/api/dashboard/`, `/api/reports/`, `/api/me/`
- `/api/auth/password/change/`, `/api/auth/password/reset/`, `/api/auth/password/reset/confirm/`
- `/api/patients/`, `/api/appointments/`, `/api/appointments/free_slots/`
- `/api/treatments/`, `/api/invoices/`, `/api/invoices/{id}/pay/`
- `/api/attachments/`, `/api/notifications/`, `/api/users/`, `/api/clinics/`

## Перед production

- настроить HTTPS-сертификат и отдельные production secrets;
- выгружать локальные `pg_dump`-копии контейнера `backup` в зашифрованное объектное хранилище;
- подключить frontend к API вместо демонстрационного store;
- добавить S3-совместимое хранилище, антивирусную проверку файлов и лимиты tenant-а;
- настроить SMTP, мониторинг, error tracking и политику хранения медицинских данных.
