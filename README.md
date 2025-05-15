<p align="center">

[//]: # (  <!-- Положите свой логотип в resources/logo.png, и он появится здесь -->)

[//]: # (  <picture>)

[//]: # (    <img src="resources/logo.png" height="200" alt="Web Lab 4 logo">)

[//]: # (  </picture>)

  <h1 align="center">
    Игра "Попади в график"

[//]: # (    <a aria-label="English version" href="./README.md">)

[//]: # (      <img alt="" src="https://img.shields.io/badge/translation-EN-blue?style=for-the-badge">)

[//]: # (    </a>)
  </h1>
</p>

<p align="center">
  🔗 <strong>Репозиторий backend-части:</strong>  
  <a href="https://github.com/ren1kron/web_lab4_backend">
    https://github.com/ren1kron/web_lab4_backend
  </a>
</p>

<p align="center">
  <!-- Backend -->
  <img alt="Java 17"  src="https://img.shields.io/badge/Java-17-006699?style=for-the-badge&logo=openjdk">
  <img alt="Jakarta EE 9" src="https://img.shields.io/badge/Jakarta EE-9.0-f09300?style=for-the-badge">
  <img alt="Apache TomEE 9" src="https://img.shields.io/badge/TomEE-9.x-e2244e?style=for-the-badge">
  <img alt="Gradle 8.8" src="https://img.shields.io/badge/Gradle-8.8-02303a?style=for-the-badge&logo=gradle">

  <!-- Front-end -->
  <img alt="Angular 19" src="https://img.shields.io/badge/Angular-19.0.2-dd0031?style=for-the-badge&logo=angular">
  <img alt="Tailwind CSS 3" src="https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwindcss">
  <img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript">

  <!-- Infrastructure -->
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql">
</p>

<details open>
<summary><b>Содержание</b></summary>

[//]: # (- [Демо]&#40;#демо&#41;)
- [Описание проекта](#описание)
- [Архитектура](#архитектура)
- [Быстрый старт](#быстрый-старт)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Docker Compose](#docker)
- [API](#api)
- [Схема БД](#схема-бд)
- [Вклад](#вклад)
- [Лицензия](#лицензия)

</details>

[//]: # (<a id="демо"></a>)

[//]: # (## Демо 🎥)

[//]: # (Добавьте короткий GIF или ссылку на видео, где показано:)

[//]: # (1. Регистрация / вход  )

[//]: # (2. Клик по графику для добавления точки  )

[//]: # (3. Мгновенное обновление таблицы и графика  )

<a id="описание"></a>
## Описание проекта 📖
**Web Lab 4** — учебный полнофункциональный проект для проверки попадания точек в составную геометрическую область.
Реализована авторизация и регистрация пользователей

* **Backend** — Jakarta EE 9 (JAX-RS + JPA) WAR-приложение, собираемое Gradle 8.8 и развёртываемое на Apache TomEE 9.  
  Основные модули:
  - `resources/` — REST-эндпойнты (`/api/auth`, `/api/points`)
  - `dao/` — репозитории JPA
  - `models/` — JPA-сущности и DTO
  - фильтры CORS и аутентификации  
    Итоговый артефакт — `web_lab4.war`.

* **Frontend** — Angular 19 c Tailwind CSS. Запускается на `http://localhost:4200`, обращается к API, рисует SVG-график и хранит токен сессии в `localStorage`.

* **База данных** — PostgreSQL (взаимодействие реализовано через Hibernate).

<a id="архитектура"></a>
## Архитектура 📐
```text
┌──────────┐      HTTPS       ┌────────────┐     JDBC      ┌──────────────┐
│  Клиент  │  ◄──────────────►│  TomEE 9   │◄─────────────►│  PostgreSQL  │
│ Angular  │                  │  JAX-RS    │               │     15+      │
└──────────┘                  └────────────┘               └──────────────┘
````

* **REST без состояния** (`/api/**`), защищённый простым токеном в заголовке
* **CORS-фильтр** допускает origin фронтенда
* **JPA + Hibernate** создают/валидируют схему при старте

<a id="быстрый-старт"></a>

## Быстрый старт 🚀

> ⚙️ Требования: JDK 17, Node ≥ 20, PostgreSQL ≥ 15

### <a id="backend"></a>Backend

```bash
# 1) клон и сборка
git clone https://github.com/ren1kron/web_lab4_backend.git
cd web_lab4_backend
./gradlew clean build

# 2) деплой
cp build/libs/web_lab4.war  $TOMEE_HOME/webapps/
$TOMEE_HOME/bin/startup.sh
```

API будет доступен по `http://localhost:8080/web_lab4/api`.

### <a id="frontend"></a>Frontend

```bash
git clone https://github.com/ren1kron/web_lab4.git
cd web_lab4
npm ci
ng serve
```

Откройте **[http://localhost:4200](http://localhost:4200)** — горячая перезагрузка включена.

### <a id="docker"></a>Docker Compose (одна команда)

```bash
docker compose up --build
```

Пример `docker-compose.yml` (TomEE + Postgres + Angular Nginx) лежит в `/deploy/compose/`.

<a id="api"></a>

## API 🧩

| Метод  | Endpoint           | Тело / параметры    | Описание                        |
|--------|--------------------|---------------------|---------------------------------|
| POST   | `/api/auth/signup` | `{login, password}` | Регистрация пользователя        |
| POST   | `/api/auth/login`  | `{login, password}` | Получение токена                |
| GET    | `/api/points`      | `?page=0&size=20`   | Список точек пользователя       |
| POST   | `/api/points`      | `{x, y, r}`         | Добавить точку, вернуть `isHit` |
| DELETE | `/api/points/{id}` | —                   | Удалить точку                   |

Защищённые маршруты ожидают заголовок `X-Auth-Token`.

<a id="схема-бд"></a>

## Схема БД 🗄️

```sql
CREATE TABLE users (
                     id         SERIAL PRIMARY KEY,
                     login      VARCHAR(64) UNIQUE NOT NULL,
                     password   VARCHAR(255)       NOT NULL
);

CREATE TABLE points (
                      id      SERIAL PRIMARY KEY,
                      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                      x       DOUBLE PRECISION NOT NULL,
                      y       DOUBLE PRECISION NOT NULL,
                      r       DOUBLE PRECISION NOT NULL,
                      is_hit  BOOLEAN          NOT NULL,
                      created TIMESTAMP        NOT NULL DEFAULT NOW()
);
```

[//]: # (<a id="вклад"></a>)

[//]: # ()
[//]: # (## Вклад 🤝)

[//]: # ()
[//]: # (PR приветствуются! Перед отправкой запустите тесты &#40;`./gradlew test` и `ng test`&#41; и примените форматирование `./gradlew spotlessApply`.)

[//]: # ()
[//]: # (<a id="лицензия"></a>)

[//]: # ()
[//]: # (## Лицензия 📄)

[//]: # ()
[//]: # (MIT — см. файл [`LICENSE`]&#40;LICENSE&#41;.)

[//]: # ()
[//]: # (---)

[//]: # ()
[//]: # (> Сделано с ❤️ для **Лабораторной работы № 4 по Веб-программированию**)

[//]: # (> Университет ИТМО, 2024-2025)

[//]: # ()
[//]: # (```)
