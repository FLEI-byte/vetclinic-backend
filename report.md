# Лабораторно-практична робота №5

**на тему:** "Розширення бекенд-додатку власними сутностями та реалізація REST API."

**Мета:** Розвинути навички проєктування та реалізації серверної логіки, інтегрувавши проєкт бази даних з курсової роботи у повноцінний бекенд-додаток. Навчитись створювати пов'язані сутності за допомогою TypeORM, керувати структурою БД через міграції та будувати REST API для роботи з реляційними даними.

URL репозиторію: https://github.com/FLEI-byte/vetclinic-backend

**Реалізовані сутності:** `Client`, `Employee`, `MedicalCard`, `Appointment` (з курсової роботи "Ветеринарна клініка").

---

## Етап 1. Створення сутностей та зв'язків

1. Створення сутності Client

   У проєкті створено теку `src/orm/entities/clients` та клас-сутність `Client` з полями `id`, `phone`, `last_name`, `first_name`, `patronymic`, `birth_date`, `email`. Типи й обмеження (довжина, `unique`) взято з документа "Опис сутностей, атрибутів та їх обмежень". Первинним ключем обрано числовий автоінкрементний `id`, а номер телефону зроблено унікальним.

   ![Крок 1-1](screenshots/10_git5.png)

   Перевірка компіляції TypeScript командою `npm run tsc` пройшла без помилок.

   ![Крок 1-2](screenshots/09_git5.png)

   Лінтер (ESLint з Prettier) спершу показав помилки форматування в старих файлах проєкту з попередньої лабораторної (`src/index.ts` та міграція `AddUserBio`). Їх виправлено командою `npm run lint-fix`, після чого `npm run lint` і `tsc` пройшли чисто.

   ![Крок 1-3](screenshots/11_git5.png)

   Зміни закомічено. Історія комітів:

   ![Крок 1-4](screenshots/12_git5.png)

---

2. Створення сутності Employee

   Аналогічно створено клас `Employee` (`src/orm/entities/employees`) з полями `id`, `phone`, `last_name`, `first_name`, `patronymic`, `position`, `email`.

   ![Крок 2-1](screenshots/13_git5.png)

   Перевірка лінтером:

   ![Крок 2-2](screenshots/14_git5.png)

---

3. Створення сутності MedicalCard та зв'язку Client → MedicalCard

   Створено клас `MedicalCard` (`src/orm/entities/medical-cards`) з полями `nickname`, `species`, `breed`, `sex`, `birth_date`, `created_date`. Зв'язок із клієнтом задано декоратором `@ManyToOne` з `@JoinColumn({ name: 'client_id' })` та `onDelete: 'CASCADE'`.

   ![Крок 3-1](screenshots/16_git5.png)

   У сутність `Client` додано зворотний зв'язок `@OneToMany` (поле `medical_cards`):

   ![Крок 3-2](screenshots/17_git5.png)

   Перевірка лінтером:

   ![Крок 3-3](screenshots/18_git5.png)

---

4. Створення сутності Appointment та зв'язків із MedicalCard і Employee

   Створено клас `Appointment` (`src/orm/entities/appointments`) з полями `appointment_date`, `purpose`, `exam_results`, `diagnosis`, `total`. Два зв'язки `@ManyToOne` ведуть до `MedicalCard` (`medical_card_id`, з `CASCADE`) та до `Employee` (`employee_id`, без каскаду, щоб не можна було видалити співробітника, який має прийоми).

   ![Крок 4-1](screenshots/19_git5.png)

   У `MedicalCard` та `Employee` додано зворотні зв'язки `@OneToMany` (поле `appointments`):

   ![Крок 4-2](screenshots/20_git5.png)

   ![Крок 4-3](screenshots/21_git5.png)

   Перевірка лінтером:

   ![Крок 4-4](screenshots/22_git5.png)

**Результат етапу:** створено чотири сутності, між якими визначено зв'язки: `Client 1:M MedicalCard`, `MedicalCard 1:M Appointment`, `Employee 1:M Appointment`.

---

## Етап 2. Генерація та застосування міграцій

1. Перевірка конфігурації ORM

   У файлі `src/orm/config/ormconfig.ts` шлях до сутностей заданий шаблоном `src/orm/entities/**/*.ts`, тому нові сутності підхоплюються автоматично. Використовується `SnakeNamingStrategy`, тож поля в БД мають вигляд snake_case.

---

2. Генерація міграції

   Запущено базу даних у Docker і згенеровано міграцію командою `npm run migration:generate -- CreateVetClinicTables`. Створено файл `1792919338627-CreateVetClinicTables.ts`.

   ![Крок 2](screenshots/23_git5.png)

---

3. Перевірка згенерованої міграції

   Перед запуском міграцію прочитано (вона змінює структуру БД). У ній створюються чотири таблиці (`employees`, `appointments`, `clients`, `medical_cards`) з довжинами полів, `NOT NULL` та `UNIQUE` з опису сутностей, а також три зовнішні ключі. У методі `down` лише видалення цих ключів і таблиць. Таблиці `users` міграція не торкається.

   ![Крок 3-1](screenshots/24_git5.png)

   ![Крок 3-2](screenshots/25_git5.png)

   ![Крок 3-3](screenshots/26_git5.png)

---

4. Запуск міграції

   Міграцію застосовано командою `npm run migration:run:dev`. У виводі видно створення таблиць, додавання зовнішніх ключів та повідомлення про успішне виконання.

   ![Крок 4-1](screenshots/27_git5.png)

   ![Крок 4-2](screenshots/28_git5.png)

   ![Крок 4-3](screenshots/29_git5.png)

---

5. Перевірка структури бази даних у DBeaver

   Підключення в DBeaver переналаштовано на базу `vetclinic`. У схемі `public` з'явилися нові таблиці `appointments`, `clients`, `employees`, `medical_cards`.

   ![Крок 5-1](screenshots/30_git5.png)

   Зовнішні ключі таблиці `appointments`: `medical_card_id` → `medical_cards` та `employee_id` → `employees`.

   ![Крок 5-2](screenshots/31_git5.png)

   Зовнішній ключ таблиці `medical_cards`: `client_id` → `clients`.

   ![Крок 5-3](screenshots/32_git5.png)

   ER-діаграма чотирьох таблиць підтверджує зв'язки між ними:

   ![Крок 5-4](screenshots/33_git5.png)

---

6. Збереження результатів у Git

   Сутності та міграцію закомічено й відправлено на GitHub.

   ![Крок 6-1](screenshots/34_git5.png)

   ![Крок 6-2](screenshots/35_git5.png)

**Результат етапу:** структуру бази даних оновлено через міграцію, у БД створено чотири таблиці з коректними полями та зовнішніми ключами.

---

## Етап 3. Реалізація REST API

1. Client: DTO, Service, Controller, Router

   Для сутності `Client` створено повний набір шарів у стилі проєкту: `dto/clients/ClientDto.ts` (вхідні дані та валідація: телефон `+380XXXXXXXXX`, формат пошти, дата народження раніше за поточну), `services/clients/ClientService.ts` (робота з БД через TypeORM), `controllers/clients/index.ts` та `routes/v1/clients.ts`. Усі маршрути захищено `checkJwt`. Маршрут підключено у `routes/v1/index.ts`.

   ![Крок 1-1](screenshots/36_git5.png)

   У `ClientService` отримання даних із зв'язаної таблиці реалізовано через `relations: ['medical_cards']`:

   ![Крок 1-2](screenshots/37_git5.png)

   Перевірка лінтером і `tsc`:

   ![Крок 1-3](screenshots/38_git5.png)

---

2. Перевірка роботи Client

   Запущено сервер (`npm run dev`) з підключенням до бази `vetclinic`. Через PowerShell виконано логін, створено клієнта та отримано список клієнтів.

   ![Крок 2-1](screenshots/39_git5.png)

   ![Крок 2-2](screenshots/40_git5.png)

---

3. Employee: DTO, Service, Controller, Router

   Аналогічно реалізовано шари для `Employee`. У `EmployeeService` підтягуються прийоми співробітника (`relations: ['appointments']`).

   ![Крок 3-1](screenshots/43_git5.png)

   ![Крок 3-2](screenshots/44_git5.png)

   Перевірка лінтером і `tsc`:

   ![Крок 3-3](screenshots/42_git5.png)

---

4. MedicalCard: DTO, Service, Controller, Router

   Для `MedicalCard` у DTO додано перевірку значення `sex` (`чоловіча` або `жіноча`) та дат. У `MedicalCardService` підтягуються клієнт і прийоми (`relations: ['client', 'appointments']`), а при створенні перевіряється, що клієнт із вказаним `client_id` існує.

   ![Крок 4-1](screenshots/45_git5.png)

   ![Крок 4-2](screenshots/46_git5.png)

   ![Крок 4-3](screenshots/47_git5.png)

   Перевірка лінтером і `tsc`:

   ![Крок 4-4](screenshots/48_git5.png)

---

5. Appointment: DTO, Service, Controller, Router

   Для `Appointment` реалізовано перевірку існування картки та співробітника при створенні й оновленні. У `AppointmentService` вкладені дані підтягуються на два рівні вглиб: `['medical_card', 'medical_card.client', 'employee']`.

   ![Крок 5-1](screenshots/49_git5.png)

   ![Крок 5-2](screenshots/50_git5.png)

   ![Крок 5-3](screenshots/51_git5.png)

   Перевірка лінтером і `tsc`:

   ![Крок 5-4](screenshots/52_git5.png)

---

6. Збереження результатів у Git

   Код API закомічено й відправлено на GitHub.

   ![Крок 6](screenshots/53_git5.png)

---

7. Перевірка join через PowerShell

   Створено співробітника, медичну картку та прийом, після чого виконано `GET /v1/appointments/1`. У відповіді замість `medical_card_id` та `employee_id` повернулися вкладені об'єкти `medical_card` (з `client` усередині) та `employee`.

   ![Крок 7-1](screenshots/54_git5.png)

   ![Крок 7-2](screenshots/55_git5.png)

**Результат етапу:** для кожної з чотирьох сутностей реалізовано CRUD за архітектурою Controller, Service, DTO, Router, а отримання даних зі зв'язаних таблиць (join) працює.

---

## Етап 4. Тестування через Postman

1. Створення колекції та налаштування

   У Postman створено колекцію `VetClinic API` із п'ятьма папками: `Auth`, `Clients`, `Employees`, `Medical cards`, `Appointments`. У змінних колекції задано `baseUrl` (`http://localhost:4000/v1`) та `token`. Авторизація колекції налаштована як Bearer Token зі значенням `{{token}}`.

   ![Крок 1](screenshots/56_git5.png)

---

2. Запит Login

   Запит `POST {{baseUrl}}/auth/login` без авторизації. У скрипті After response токен автоматично записується в змінну `token`, тож інші запити підставляють його самі. Результат: `200 OK`, `Token successfully created.`

   ![Крок 2](screenshots/57_git5.png)

---

3. Запити для Clients

   У папці `Clients` створено п'ять запитів. Дерево колекції:

   ![Крок 3-1](screenshots/63_git5.png)

   **Create client** (`POST /clients`), відповідь `201`:

   ![Крок 3-2](screenshots/59_git5.png)

   **Get all clients** (`GET /clients`), відповідь `200`:

   ![Крок 3-3](screenshots/62_git5.png)

   **Get client by id** (`GET /clients/1`), `200`. У відповіді вкладений масив `medical_cards` з карткою Barsik, тобто join працює:

   ![Крок 3-4](screenshots/60_git5.png)

   **Update client** (`PATCH /clients/1`), відповідь `200`, email змінено:

   ![Крок 3-6](screenshots/64_git5.png)

   **Delete client** (`DELETE /clients/2`), відповідь `200`. Під час першої спроби токен прострочився (`jwt expired`, токен дійсний 15 хвилин), тож виконано повторний Login і запит повторено:

   ![Крок 3-7](screenshots/65_git5.png)

---

4. Запити для Employees

   Дерево колекції з папкою `Employees`:

   ![Крок 4-1](screenshots/71_git5.png)

   **Create employee** (`POST /employees`), відповідь `201`:

   ![Крок 4-2](screenshots/66_git5.png)

   **Get all employees** (`GET /employees`), відповідь `200`:

   ![Крок 4-3](screenshots/67_git5.png)

   **Get employee by id** (`GET /employees/1`), `200`, видно вкладений масив `appointments`:

   ![Крок 4-4](screenshots/68_git5.png)

   **Update employee** (`PATCH /employees/1`), відповідь `200`, змінено посаду:

   ![Крок 4-5](screenshots/69_git5.png)

   **Delete employee** (`DELETE /employees/2`), відповідь `200`:

   ![Крок 4-6](screenshots/70_git5.png)

---

5. Запити для Medical cards

   Дерево колекції з папкою `Medical cards`:

   ![Крок 5-1](screenshots/77_git5.png)

   **Create medical card** (`POST /medical-cards`), відповідь `201`:

   ![Крок 5-2](screenshots/72_git5.png)

   **Get all medical cards** (`GET /medical-cards`), відповідь `200`:

   ![Крок 5-3](screenshots/73_git5.png)

   **Get medical card by id** (`GET /medical-cards/1`), `200`, видно вкладений об'єкт `client`:

   ![Крок 5-4](screenshots/74_git5.png)

   **Update medical card** (`PATCH /medical-cards/1`), відповідь `200`:

   ![Крок 5-5](screenshots/75_git5.png)

   **Delete medical card** (`DELETE /medical-cards/2`), відповідь `200`:

   ![Крок 5-6](screenshots/76_git5.png)

---

6. Запити для Appointments

   Дерево колекції з папкою `Appointments`:

   ![Крок 6-1](screenshots/83_git5.png)

   **Create appointment** (`POST /appointments`), відповідь `201`:

   ![Крок 6-2](screenshots/78_git5.png)

   **Get all appointments** (`GET /appointments`), відповідь `200`:

   ![Крок 6-3](screenshots/79_git5.png)

   **Get appointment by id** (`GET /appointments/1`), `200`. У відповіді вкладені `medical_card`, у ньому `client`, а також `employee`. Це підтверджує коректну роботу join на два рівні вглиб:

   ![Крок 6-4](screenshots/80_git5.png)

   **Update appointment** (`PATCH /appointments/1`), відповідь `200`, внесено результати огляду та діагноз:

   ![Крок 6-5](screenshots/81_git5.png)

   **Delete appointment** (`DELETE /appointments/2`), відповідь `200`:

   ![Крок 6-6](screenshots/82_git5.png)

---

7. Збереження колекції та README

   Колекцію експортовано у форматі Collection v2.1 і збережено в `postman/VetClinic API.postman_collection.json`. Файл колекції, `README.md` та скріншоти додано в репозиторій.

**Результат етапу:** усі CRUD-ендпоінти чотирьох сутностей протестовано в Postman. Запити, що повертають пов'язані дані, підтвердили коректну роботу join.

---

## Висновок

У ході роботи boilerplate-проєкт розширено чотирма сутностями з курсової роботи (`Client`, `Employee`, `MedicalCard`, `Appointment`) та зв'язками між ними (`OneToMany` / `ManyToOne`). Структуру БД створено через міграцію, згенеровану TypeORM CLI, і перевірено в DBeaver. Для кожної сутності реалізовано повний CRUD за архітектурою Controller, Service, DTO, Router із захистом JWT та отриманням даних зі зв'язаних таблиць (join). Тестування у Postman підтвердило очікувану поведінку всіх ендпоінтів. Результати збережено в новому GitHub-репозиторії.
