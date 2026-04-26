# Special English

Контентный сайт-каталог 8 узкоспециализированных PDF-гайдов по английскому
(релокация, IT, медицина, право, логистика, лидерство, родители).

Реализован на **Jekyll**, нативно поддерживается **GitHub Pages**, оптимизирован
под **SEO** (Schema.org, sitemap, OpenGraph, semantic HTML5).

---

## Стек

- **Jekyll 3.10** — статический генератор сайтов;
- **GitHub Pages** — хостинг (без GitHub Actions);
- **kramdown** — Markdown-процессор;
- **SCSS** — нативная компиляция через Jekyll;
- **Vanilla JavaScript** — без фреймворков.

Плагины:

- `jekyll-seo-tag` — мета-теги, OpenGraph, Twitter Card, JSON-LD;
- `jekyll-sitemap` — автоматический sitemap.xml;
- `jekyll-feed` — RSS-фид;
- `jekyll-redirect-from` — редиректы старых URL.

## Локальная разработка

```bash
# 1. Установите Ruby 3.0+ (на Linux: sudo apt install ruby-full build-essential)
# 2. Установите bundler:
gem install bundler

# 3. Установите зависимости:
bundle install

# 4. Запустите dev-сервер:
bundle exec jekyll serve

# Откройте http://127.0.0.1:4000/
```

Для production-билда:

```bash
bundle exec jekyll build
# Результат — в директории _site/
```

## Структура проекта

```
.
├── _config.yml                 # Главная конфигурация Jekyll
├── _data/
│   ├── guides.yml              # Метаданные всех 8 гайдов (цена, оглавление, FAQ)
│   ├── categories.yml          # 7 категорий
│   ├── faq.yml                 # Общий FAQ для главной и /faq/
│   └── reviews.yml             # Отзывы пользователей (плейсхолдеры)
├── _includes/
│   ├── head.html               # <head> со всеми мета-тегами и Schema.org
│   ├── header.html             # Главное меню
│   ├── footer.html             # Подвал
│   ├── breadcrumbs.html        # Хлебные крошки
│   ├── guide-card.html         # Карточка гайда
│   ├── faq-block.html          # FAQ-аккордеон
│   ├── analytics.html          # Yandex.Metrika + GA (отключены до настройки)
│   └── schema/                 # JSON-LD Schema.org partials
├── _layouts/
│   ├── default.html            # Базовый layout
│   ├── page.html               # Обычная страница
│   ├── post.html               # Блог-статья
│   ├── guide.html              # Продуктовая страница гайда
│   └── category.html           # Pillar-страница категории
├── _guides/                    # Collection: 8 продуктовых страниц
├── _categories/                # Collection: 7 pillar-страниц
├── _posts/                     # Блог
├── pages/                      # Служебные страницы
├── assets/
│   ├── css/main.scss           # Дизайн-система (CSS-переменные, компоненты)
│   ├── js/main.js              # Vanilla JS (мобильное меню, аккордеон)
│   └── images/                 # SVG-обложки гайдов, OG-картинка, фавикон
├── 404.html                    # Кастомная страница 404
├── robots.txt                  # SEO
├── CNAME                       # Кастомный домен
└── README.md
```

## Перед публикацией: чек-лист

### 1. Заполните метаданные

В `_config.yml` поменяйте:

- `url` — на ваш реальный домен (например, `https://your-domain.ru`);
- `email` — реальный email поддержки;
- `social.*` — ссылки на соцсети;
- `yandex_verification`, `google_site_verification` — после регистрации в
  Webmaster / Search Console;
- `yandex_metrika_id`, `google_analytics_id` — после подключения аналитики.

В `CNAME` поменяйте `your-domain.ru` на реальный домен.

### 2. Замените плейсхолдеры в контенте

- `pages/about.md` — расскажите о себе и команде (важно для **E-E-A-T**);
- `pages/contacts.md` — реальные контакты;
- `pages/offer.md`, `pages/terms.md`, `pages/privacy.md` — юридические документы
  (адаптируйте под свою юрисдикцию, проверьте у юриста);
- `_data/guides.yml` — обновите `payment_url` каждого гайда (сейчас плейсхолдер
  `https://payment.example/{slug}`) на реальные ссылки ЮKassa / Stripe / Boosty;
- `_data/reviews.yml` — замените на реальные отзывы (или оставьте плейсхолдеры).

### 3. SVG-обложки гайдов

В `assets/images/covers/` лежат сгенерированные SVG-плейсхолдеры. Можно
заменить на реальные обложки PDF (PNG / JPG / SVG) — главное оставить ту же
файловую структуру и обновить пути в `_data/guides.yml`.

### 4. Подключение домена в GitHub Pages

1. В репозитории GitHub: Settings → Pages → Source: `main` branch.
2. Дождитесь первого билда (1–2 минуты).
3. В DNS-зоне домена добавьте `A`-записи на IP GitHub Pages
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   или `CNAME` на `<username>.github.io`.
4. В Settings → Pages → Custom domain: введите домен.
5. Дождитесь автоматической настройки HTTPS (Let's Encrypt).

### 5. Регистрация в поисковых системах

- **Яндекс.Вебмастер**: [webmaster.yandex.ru](https://webmaster.yandex.ru) —
  добавьте сайт, укажите права через `yandex_verification` в `_config.yml`,
  отправьте sitemap (`/sitemap.xml`).
- **Google Search Console**: [search.google.com/search-console](https://search.google.com/search-console) —
  то же самое через `google_site_verification`.

### 6. Подключение аналитики

В `_config.yml` укажите ID Yandex.Metrika / Google Analytics, и
`_includes/analytics.html` автоматически вставит счётчики.

### 7. Платежи

Сейчас кнопки «Купить» ведут на `https://payment.example/{slug}` (плейсхолдер).
Для запуска подключите платёжного провайдера:

- **ЮKassa** — для российских карт;
- **Stripe Payment Links** — для зарубежных карт;
- **Boosty / Patreon** — для подписки;
- **Gumroad** — простой digital product checkout.

После подключения заполните поле `payment_url` в `_data/guides.yml`. После
оплаты пользователя нужно редиректить на `/thank-you/`.

### 8. Доставка PDF

Самый простой вариант: после оплаты email-сервис отправляет письмо со
ссылкой на скачивание. Хорошо работает связка:

- **Sendpulse / Unisender / Mailerlite** — email-сервис с триггерами;
- **Webhook от платёжки** → email-сервис → пользователь получает письмо.

Альтернатива — **Gumroad**, который делает всё сам.

## Добавление новой блог-статьи

```bash
# Создайте файл с датой в имени:
touch _posts/2026-05-01-новая-тема.md
```

Минимальный front matter:

```yaml
---
title: "Заголовок (60 символов)"
subtitle: "Подзаголовок"
description: "Meta description, 140-160 символов"
date: 2026-05-01
categories: [relocation]    # из _data/categories.yml: relocation, it, medical, legal, logistics, leadership, parents
tags: [tag1, tag2]
related_guide: relocation-english   # slug из _data/guides.yml — для CTA в конце статьи
breadcrumbs:
  - title: "Блог"
    url: "/blog/"
  - title: "Короткое название"
faq:
  - question: "Вопрос 1?"
    answer: "Ответ 1."
---

Текст статьи на Markdown.
```

## Изменение цены гайда

В `_data/guides.yml` поменяйте поле `price` для нужного `slug`:

```yaml
- slug: relocation-english
  price: "2 990 ₽"   # ← меняем здесь
```

## Lighthouse-метрики

Локально:

```bash
npm install -g lighthouse
bundle exec jekyll serve &
lighthouse http://127.0.0.1:4000/ --output html --output-path ./lighthouse.html
```

Целевые метрики:

- **Performance** ≥ 90;
- **Accessibility** ≥ 95;
- **Best Practices** ≥ 95;
- **SEO** = 100.

## Лицензия

Контент сайта — все права защищены. Технический код можно использовать как
шаблон для своих проектов с указанием авторства.
