# 🎁 Giftly — Event & Gift Planning App

Giftly — це вебдодаток для створення подій, запрошення гостей та керування списком подарунків.

---

## 🚀 Технології

* ⚛️ React + TypeScript
* ⚡ Vite
* 🎨 SCSS (BEM methodology)
* 🔥 Firebase (Auth + Database)
* 📱 PWA (vite-plugin-pwa)

---

## 📦 Запуск проєкту

```bash
npm install
npm run dev
```

---

## 🏗️ Структура проєкту

```
src/
 ├── components/     # UI компоненти
 ├── pages/          # сторінки (EventPage, CreateEvent)
 ├── services/       # робота з Firebase
 ├── types/          # TypeScript типи
 ├── styles/         # SCSS (BEM)
```

---

## 🔐 Основний функціонал

* 🔑 Авторизація через Google
* 🎉 Створення подій
* 👥 Запрошення користувачів
* 🎁 Додавання подарунків
* 🔗 Шеринг подій через лінк
* 📱 PWA (встановлення як додаток)

---

## 🧹 ESLint (Production config)

У проєкті використовується **type-aware linting** для кращої якості коду.

### Конфігурація:

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      'react-x': reactX,
      'react-dom': reactDom,
    },

    rules: {
      ...reactX.configs['recommended-typescript'].rules,
      ...reactDom.configs.recommended.rules,

      'react-x/jsx-no-leaked-render': 'warn',
      'react-x/no-array-index-key': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      'no-console': 'warn',
    },
  },
])
```

---

## 📱 PWA

Додаток підтримує встановлення на телефон через браузер.

---

## ⚠️ Відомі нюанси

* Safari може не одразу відкривати deep links
* PWA кеш може вимагати hard refresh

---

## 🛠️ Scripts

```bash
npm run dev       # запуск
npm run build     # білд
npm run preview   # перегляд білду
```

---

## 📌 TODO

* [ ] QR code для запрошень
* [ ] Push notifications
* [ ] Offline mode

---

## 👨‍💻 Автор

Павло — Fullstack Developer (React + Firebase)
