---
layout: default
permalink: /guides/
title: "Каталог гайдов по специализированному английскому"
description: "Все платные PDF-гайды по специализированному английскому: для релокантов, IT, медиков, юристов, логистов, руководителей, родителей, геймеров и стримеров."
breadcrumbs:
  - title: "Все гайды"
---

<section class="page-content container">
  {% include breadcrumbs.html %}
  <header class="page-content__header">
    <h1>Все гайды</h1>
    <p class="page-content__subtitle">
      9 узкоспециализированных PDF-гайдов по английскому. Один платёж — вечный
      доступ. Бесплатные обновления. Возврат в течение 14 дней.
    </p>
  </header>

  <div class="guides-grid">
    {% for g in site.data.guides %}
      {% include guide-card.html guide=g %}
    {% endfor %}
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <h2 class="section__title">Категории</h2>
    <div class="categories-grid">
      {% for cat in site.data.categories %}
        <a class="category-card" href="{{ '/categories/' | append: cat.slug | append: '/' | relative_url }}">
          <h3>{{ cat.title }}</h3>
          <p>{{ cat.short }}</p>
        </a>
      {% endfor %}
    </div>
  </div>
</section>
