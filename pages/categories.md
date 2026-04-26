---
layout: default
permalink: /categories/
title: "Категории гайдов"
description: "Категории гайдов по специализированному английскому: релокация, IT, медицина, право, логистика, лидерство, английский для родителей."
breadcrumbs:
  - title: "Категории"
---

<section class="page-content container">
  {% include breadcrumbs.html %}
  <header class="page-content__header">
    <h1>Категории</h1>
    <p class="page-content__subtitle">
      Семь профессиональных и жизненных направлений. Внутри каждой категории —
      обзорная статья и конкретные гайды под задачи.
    </p>
  </header>

  <div class="categories-grid">
    {% for cat in site.data.categories %}
      <a class="category-card" href="{{ '/categories/' | append: cat.slug | append: '/' | relative_url }}">
        <h3>{{ cat.title }}</h3>
        <p>{{ cat.short }}</p>
      </a>
    {% endfor %}
  </div>
</section>
