# Приём платежей через ЮKassa + автодоставка PDF через n8n

В этой папке — два готовых workflow для n8n, которые автоматизируют продажу
гайдов:

| # | Файл                                | Что делает                                                         |
| - | ----------------------------------- | ------------------------------------------------------------------ |
| 1 | `01-create-payment.workflow.json`   | Принимает запрос с сайта (slug гайда + email), создаёт платёж в ЮKassa и возвращает `confirmation_url` для редиректа покупателя на оплату. |
| 2 | `02-payment-succeeded.workflow.json` | Слушает `payment.succeeded` от ЮKassa, по slug достаёт PDF из Google Drive и шлёт письмо через Gmail. |

## Архитектура

```
┌──────────────┐  POST {slug,email}  ┌────────────────────────┐
│  Сайт (JS)   │ ───────────────────▶│ n8n: create-payment    │
└──────────────┘                     │  → POST /v3/payments   │
       ▲                             │  → return conf_url     │
       │ confirmation_url            └────────────┬───────────┘
       │                                          │
       │                                          ▼
       │                                  ЮKassa форма оплаты
       │                                          │
       │                                          ▼
       │  ┌───────────────────────────────────────┴───────────────┐
       │  │ Покупатель оплачивает → редирект на /thank-you/        │
       │  └───────────────────────────────────────┬───────────────┘
       │                                          │
       │                       webhook payment.succeeded
       │                                          ▼
       │                             ┌────────────────────────┐
       │                             │ n8n: payment-succeeded │
       │                             │  → читает metadata     │
       │                             │  → Google Drive        │
       │                             │  → Gmail (OAuth)       │
       │                             └────────────────────────┘
       │                                          │
       └──────────────────────────────────────────┘
                              письмо со ссылкой на PDF
```

## Пошаговая настройка

### 1. Подготовь ключи и креды

| Что нужно                | Где взять                                                                 |
| ------------------------ | ------------------------------------------------------------------------- |
| `YUKASSA_SHOP_ID`        | Личный кабинет ЮKassa → Интеграция → Ключи API                            |
| `YUKASSA_SECRET_KEY`     | Там же. **Это секрет, никогда не коммить в репо!**                        |
| Google account для Drive | Тот, на котором лежат PDF гайдов                                          |
| Gmail для отправки       | Тот, с которого хочешь отправлять письма (OAuth подключается из n8n)      |

### 2. Загрузи PDF в Google Drive и собери `file_id`

Открой каждый PDF → «Открыть доступ» → «Скопировать ссылку».
Из ссылки `https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing` забери
`<FILE_ID>` (он понадобится в маппинге внутри workflow 02).

В workflow 02 есть нода **«Map slug → file»**, в ней JS-объект:

```js
const map = {
  "relocation-english":   { fileId: "FILE_ID_RELOCATION", title: "Английский для релокации" },
  "english-for-parents":  { fileId: "FILE_ID_PARENTS",    title: "Английский для родителей" },
  "medical-english":      { fileId: "FILE_ID_MEDICAL",    title: "Английский для медиков" },
  "it-interview-english": { fileId: "FILE_ID_IT",         title: "English for Tech Interviews" },
  "ai-first-english":     { fileId: "FILE_ID_AI",         title: "AI-first English for Tech Stars" },
  "legal-english":        { fileId: "FILE_ID_LEGAL",      title: "Legal English: Contracts & Compliance" },
  "logistics-english":    { fileId: "FILE_ID_LOGISTICS",  title: "Logistic English" },
  "leadership-english":   { fileId: "FILE_ID_LEADERSHIP", title: "The language of Power" },
};
```

Проставь свои `FILE_ID_*`.

В workflow 01 в ноде **«Map slug → product»** — цены и человеческие названия.
Цены **должны совпадать с фронт-маттером в `_guides/*.md` и `_data/guides.yml`**.
По умолчанию проставлены текущие цены — обнови, если поменяешь.

### 3. Импортируй workflow в n8n

В n8n → меню «**…**» → **Import from File** → выбери `01-create-payment.workflow.json`.
Повтори для `02-payment-succeeded.workflow.json`.

### 4. Подключи креды в n8n

Открой каждый workflow и в нодах HTTP Request / Gmail / Google Drive подставь:

- **HTTP Request → ЮKassa API**: Authentication → **Basic Auth**.
  - Создай Credential «YooKassa Basic» с user = `YUKASSA_SHOP_ID`, password = `YUKASSA_SECRET_KEY`.
- **Google Drive**: создай Credential «Google Drive OAuth2 API» (стандартный мастер n8n).
- **Gmail**: Credential «Gmail OAuth2» (стандартный мастер n8n).

### 5. Активируй workflow и забери продакшн-URL

Включи переключатель **Active** в правом верхнем углу каждого workflow.

В ноде Webhook первого workflow рядом с полем «Webhook URLs» переключись на
**Production URL** — это ссылка вида:

```
https://ai-konfu-u70272.vm.elestio.app/webhook/yukassa-create-payment
```

Этот URL вставь в `_config.yml` сайта:

```yaml
yukassa:
  create_payment_url: "https://ai-konfu-u70272.vm.elestio.app/webhook/yukassa-create-payment"
```

Production URL вебхука второго workflow (это твой существующий URL):

```
https://ai-konfu-u70272.vm.elestio.app/webhook/yukassa
```

Зайди в личный кабинет ЮKassa → **Интеграция → HTTP-уведомления**, добавь этот
URL и отметь события: `payment.succeeded`, `payment.canceled`, `refund.succeeded`.

### 6. CORS

Сайт хостится на GitHub Pages (`https://nilolafeo-bit.github.io`), а n8n —
на elestio. Браузер делает cross-origin запрос. В ноде Webhook первого
workflow (Create Payment) выстави **Response → Response Headers**:

| Name                          | Value                                       |
| ----------------------------- | ------------------------------------------- |
| Access-Control-Allow-Origin   | `https://nilolafeo-bit.github.io`           |
| Access-Control-Allow-Methods  | `POST, OPTIONS`                             |
| Access-Control-Allow-Headers  | `Content-Type`                              |

Также включи галочку **«Allow CORS preflight»** (если используешь n8n ≥ 1.20)
или добавь второй Webhook на тот же путь с методом `OPTIONS`, отдающий 204.

### 7. Тест

1. Открой любой гайд на сайте → «Купить».
2. Введи email и подтверди согласие → должно открыться окно оплаты ЮKassa.
3. В ЮKassa есть [тестовый режим](https://yookassa.ru/developers/using-api/testing) —
   используй тестовые карты, чтобы не платить реальные деньги.
4. После «оплаты» проверь:
   - редирект на `/thank-you/` сработал;
   - в почте, указанной в форме, пришло письмо со ссылкой на PDF;
   - в ЮKassa появился чек 54-ФЗ (для самозанятого).

## 54-ФЗ для самозанятого

В workflow 01 при создании платежа уже формируется `receipt`:

```json
"receipt": {
  "customer": { "email": "<buyer-email>" },
  "items": [{
    "description": "<guide-title>",
    "quantity": "1.00",
    "amount": { "value": "2990.00", "currency": "RUB" },
    "vat_code": 1,
    "payment_subject": "service",
    "payment_mode": "full_prepayment"
  }]
}
```

Если у тебя в договоре с ЮKassa подключён режим **«Чеки для самозанятых»** —
ЮKassa сама пробьёт чек в «Мой налог» и пришлёт его на email покупателя.
Если режим не подключён — позвони в поддержку ЮKassa и попроси активировать.
Это бесплатно для самозанятых.

## Безопасность

- Секретный ключ ЮKassa и креды Gmail/Drive хранятся **только в Credentials
  внутри n8n**. В JSON-файлах workflow есть только ссылки на эти credential
  по имени — поэтому файлы безопасно коммитить в репо.
- Webhook от ЮKassa желательно дополнительно валидировать по списку их IP
  (см. https://yookassa.ru/developers/using-api/webhooks#ip). В workflow 02
  есть нода-комментарий, куда это можно добавить.
- Письмо со ссылкой на PDF можно усилить: вместо публичной Drive-ссылки
  использовать одноразовую (через `drive.permissions.create` + cron на
  снятие доступа через 24 часа). По умолчанию используется временное
  включение публичного доступа на файл с автоснятием через 7 дней.

## Что менять при добавлении нового гайда

1. Создай файл `_guides/<slug>.md` (как существующие).
2. Добавь запись в `_data/guides.yml`.
3. Залей PDF в Google Drive, запиши file_id.
4. Открой workflow 01 → нода «Map slug → product» → добавь slug, title, price.
5. Открой workflow 02 → нода «Map slug → file» → добавь slug, fileId, title.

## Локальная разработка

Хочешь потестировать без реальной ЮKassa? Создай отдельный «sandbox»
workflow, в котором HTTP Request к ЮKassa замокан и сразу отдаёт тестовый
`confirmation_url` — например, ссылку на `/thank-you/` страницу. Тогда
можно гонять весь UX без денег.
