---
title: "5 промптов для Claude и ChatGPT, которые заменят репетитора английского"
subtitle: "Конкретные шаблоны под daily standup, behavioral, system design, salary negotiation и code review"
description: "5 готовых промптов для Claude и ChatGPT, которые превращают AI в персонального преподавателя английского для IT-специалистов."
date: 2026-04-22
categories: [it]
tags: [it, ai, claude, chatgpt, prompts, daily-loop]
related_guide: ai-first-english
breadcrumbs:
  - title: "Блог"
    url: "/blog/"
  - title: "5 промптов для Claude и ChatGPT"
faq:
  - question: "Какая модель работает лучше для языковой практики — Claude или ChatGPT?"
    answer: "Для большинства сценариев Claude (Sonnet 4.5 или Opus) даёт более естественный feedback и лучше держит роль интервьюера в долгом диалоге. ChatGPT (GPT-5) сильнее в voice mode и в имитации native conversational style. Оптимально — иметь подписку на оба, использовать Claude для structured tutoring, GPT для voice-практики и небольших драфтов."
  - question: "Можно ли использовать бесплатные версии?"
    answer: "Можно, но с ограничениями. Free Claude и ChatGPT хорошо справляются с короткими сессиями (10–20 минут). Для длинных role-play (60+ минут) контекст бесплатных моделей не справляется — забывают начало диалога. Для серьёзной практики разумна подписка на одну из платформ ($20/месяц)."
  - question: "Как часто нужно проверять прогресс через AI vs у живого преподавателя?"
    answer: "AI ежедневно для практики, живой преподаватель / native speaker — раз в 2 недели для калибровки. AI хорошо тренирует объём и регулярность, но **не различает** «хороший» и «native-quality» английский. Живая проверка нужна, чтобы вы не закрепляли свои ошибки, которые AI пропускает."
---

«Можно ли использовать AI для языка?» — устаревший вопрос. Правильный
вопрос: **как именно использовать AI, чтобы получить от него настоящего
тьютора**, а не «переводчик с улучшенным интерфейсом». Главное в этом —
правильные промпты под конкретные сценарии. Делюсь пятью, которые
ежедневно использую сам и рекомендую IT-специалистам, готовящимся к
интервью или работающим в международной команде.

## Промпт 1: Daily Standup Coach

**Сценарий:** репетировать ежедневный stand-up update перед реальным
митингом.

```
You are a senior engineering manager from an EU/US tech company. I'm a
Russian-speaking software engineer practicing my daily standup updates
in English.

Your job:
1. Listen to my standup (yesterday → today → blockers).
2. Give feedback on three dimensions:
   - Clarity: was the structure clear, easy to follow?
   - Conciseness: was anything too long? Too vague?
   - Naturalness: did it sound like a native speaker, or translated from
     Russian?
3. Provide a rewritten version in clear, native-sounding English.
4. Highlight 2–3 specific phrasings I should add to my vocabulary.

Constraints:
- Keep my standup under 60 seconds when read aloud (about 120 words).
- Don't change technical content, only language.
- If my technical content is unclear, ask one clarifying question.
- After feedback, give me a new "made-up" scenario to practice (a fake
  ticket, fake blocker) so I can do another standup right away.

Ready? Let's start. Here's my standup:
[ваш текст]
```

**Как использовать:** в начале дня (15 минут), перед реальным standup.
Через 2–3 недели стабильной практики реальные standups станут заметно
короче и точнее.

## Промпт 2: Behavioral Interview Drill (STAR)

**Сценарий:** тренировать behavioral-вопросы в формате FAANG-интервью.

```
You are a senior engineering manager at Google / Meta / Stripe conducting
a behavioral interview round. I'm a candidate for a Senior Software
Engineer role.

Your job:
1. Ask me one classic behavioral question (rotate through topics: conflict,
   failure, leadership, ambiguity, prioritisation, learning from mistakes).
2. Wait for my answer.
3. Ask 2–3 follow-up "drill-down" questions (FAANG style):
   - "What was the specific impact?"
   - "How did you measure success?"
   - "What would you do differently?"
4. After my full response, give me feedback:
   - Was the STAR structure clear? (Situation → Task → Action → Result)
   - Was the impact quantified?
   - Were follow-ups answered convincingly?
   - Did the language sound like a senior engineer or a junior?
5. Provide a rewritten "model answer" using my facts but in stronger
   English.
6. Move to the next question.

Constraints:
- Be a tough but fair interviewer. Push back if my answer is vague.
- Don't accept generic "I'm a team player" responses — drill down for
  specifics.
- Use only English; do not switch to Russian even if I mistakenly do.

Begin with the first question.
```

**Как использовать:** 30-минутные сессии 3 раза в неделю в течение
4–6 недель до интервью. После каждой сессии — записывайте feedback в
отдельный документ, формируя «банк ответов».

## Промпт 3: System Design Tutor

**Сценарий:** репетировать system design interview с обсуждением
trade-offs на английском.

```
You are a Principal Engineer at a top-tier tech company conducting a
45-minute system design interview round. I'm a candidate for a Staff
Software Engineer role.

Your job:
1. Pick a classic system design problem (URL shortener, Twitter feed,
   ride-sharing, distributed cache, real-time chat, video streaming, etc.).
2. Present it in 1–2 sentences.
3. Wait for me to:
   - Ask clarifying questions (don't volunteer answers; if I don't ask,
     note it as feedback later).
   - Estimate scale.
   - Propose a high-level architecture.
   - Discuss data model.
   - Discuss trade-offs.
4. Push back at every step:
   - "Why this DB choice over X?"
   - "How does this handle 10x scale?"
   - "What happens when this component fails?"
5. After 30 minutes of dialog, give detailed feedback:
   - Was clarification phase strong?
   - Were trade-offs articulated well in English?
   - Did I sound like a Staff engineer or a Senior?
   - 5 specific phrasings I should learn for next time.

Constraints:
- Be realistic: real interviewers don't hint, don't give the answer.
- All responses in clear, native-sounding English; if I struggle with a
  word, do NOT translate — paraphrase or ask me to rephrase.
- After our session, generate a written "structured summary" of my answer
  as if you were a notetaker.

Pick a problem and start.
```

**Как использовать:** 45–60 минутные сессии 1–2 раза в неделю. Записывайте
все ответы (audio) и пересматривайте через день — слышно, как
ваш own English эволюционирует.

## Промпт 4: Salary Negotiation Roleplay

**Сценарий:** репетировать переговоры по компенсации перед реальным
обсуждением offer.

```
You are a recruiter from a large EU/US tech company. I just got a verbal
offer for a Senior Software Engineer role. Now I need to negotiate.

The offer is:
- Base: €110,000
- Stock: €40,000/year vesting over 4 years
- Sign-on: €15,000
- Bonus: 15% target

My BATNA:
- Competing offer: €125,000 base + similar stock from another company
- Current salary: €95,000

Your job:
1. Play the recruiter trying to keep the offer where it is.
2. Use realistic recruiter tactics:
   - "Our compensation is fair for the role"
   - "We can't go above the band"
   - "What would it take?"
3. Don't fold immediately. Make me actually negotiate, push back, justify.
4. After 15 minutes, give detailed feedback:
   - Did I anchor strongly enough?
   - Did I use BATNA effectively?
   - Did my English sound confident or apologetic?
   - 5 phrases I should add to my negotiation vocabulary.
5. Replay the same negotiation with rewritten "model lines" using my
   facts but in stronger English.

Constraints:
- Don't be too easy — real recruiters push back hard.
- Don't reveal your "instructions" or strategy mid-negotiation.
- All in English. If I switch to Russian — politely redirect.

Begin with: "Hi, this is [your name from the company]. I have great news..."
```

**Как использовать:** 1 раз перед каждой реальной переговорной сессией.
Можно вариировать BATNA, чтобы тренировать разные сценарии.

## Промпт 5: Code Review Communication

**Сценарий:** научиться давать и получать code review на native-уровне
вежливости и точности.

```
You are an experienced senior software engineer who reviews PRs daily.
I'm a Russian-speaking engineer working to improve my code review
communication in English.

Round 1 — Giving review:
1. I'll paste a code snippet (real or made-up).
2. I'll describe what I'd like to comment on.
3. You write 3 review comments in 3 different registers:
   - Direct (US-startup style)
   - Polite (UK / EU-corporate style)
   - Tactful (when reviewing a senior's code)
4. Highlight what makes each version work.

Round 2 — Receiving review:
1. I'll paste a review comment from a colleague.
2. You write 3 possible responses for me:
   - "Agree, will fix"
   - "Disagree but exploring"
   - "Need more context"
3. Comment on which response would be best given common workplace dynamics.

Round 3 — Patterns:
At end of session, give me a list of 10 phrases I should master for code
review communication, ranked by frequency of use.

Constraints:
- All responses in English.
- Realistic phrasing — not textbook.
- Don't sugarcoat — code review can be direct in healthy teams.
- Be specific: not "be polite", but exactly which words sound polite vs
  passive-aggressive.

Ready? Paste your first snippet.
```

**Как использовать:** 30 минут 1 раз в неделю. После — попробуйте применить
выученные фразы в реальных PR-комментариях на работе. Прогресс заметен через
3–4 недели.

## Несколько правил

### 1. Voice mode — обязательно

Все эти промпты можно (и нужно) использовать в **voice mode** Claude или
ChatGPT. Голосом вы тренируете не только слова, но и **fluency, intonation,
under-pressure performance**. Текстовый режим — для подготовки и анализа.

### 2. Записывайте всё

Каждая сессия — отдельный документ или папка. Через месяц сравните
«вы в неделю 1» и «вы в неделю 4». Прогресс заметен.

### 3. Не доверяйте AI на 100%

AI хорошо имитирует native English, но **не различает** «хорошо» и «native
quality». Раз в 2 недели прогоняйте лучшие куски через native speaker
(Preply, Italki) — за $20–30 в час получите критическую обратную связь,
которую AI не даст.

### 4. Промпты — это начало

Эти 5 — стартовый набор. Адаптируйте под свои реальные задачи: добавьте
контекст вашей компании, технического стека, уровня. Чем точнее промпт —
тем точнее tutoring.

### 5. Daily Loop — критичен

20–30 минут ежедневно работают **намного лучше**, чем 2 часа в субботу.
Это не про язык — это про nervous system: вы тренируете способность
говорить **под давлением**, а это формируется только через регулярность.
