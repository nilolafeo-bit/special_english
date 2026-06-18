// ============================================================
// Special English — AI Dialogue Trainer
// Version: 1.0
// ============================================================

(function() {
  'use strict';

  const PERSONAS = {
    'it-behavioral':    { name: 'Alex Chen', role: 'Engineering Manager, FAANG', emoji: '👨‍💼' },
    'it-standup':       { name: 'Sam',        role: 'Scrum Master, Amsterdam startup', emoji: '⚡' },
    'relocation-landlord': { name: 'David',   role: 'Landlord, Lisbon', emoji: '🏠' },
    'relocation-bank':  { name: 'Claire',     role: 'Banking Advisor, NatWest', emoji: '🏦' },
    'relocation-school':{ name: 'Ms. Reed',   role: 'Admissions Coordinator', emoji: '🎒' },
    'medical-gp':       { name: 'Robert',     role: 'Patient (GP consultation)', emoji: '🏥' },
    'medical-handover': { name: 'Night Nurse',role: 'NHS Ward Handover', emoji: '👩‍⚕️' },
    'legal-contract':   { name: 'Sarah Mitchell', role: 'Commercial Law Partner', emoji: '⚖️' },
    'logistics-carrier':{ name: 'Mike Torres', role: 'Freight Carrier Sales', emoji: '🚢' },
    'leadership-board': { name: 'Patricia Wells', role: 'Non-Executive Director', emoji: '📊' },
    'leadership-review':{ name: 'Jamie',      role: 'Your team member', emoji: '👤' },
    'parents-teacher':  { name: 'Ms. Johnson', role: 'Year 3 Class Teacher', emoji: '📚' },
    'gaming-callouts':  { name: 'Tyler',      role: 'Your ranked teammate', emoji: '🎮' }
  };

  class AITrainer {
    constructor(container) {
      this.container = container;
      this.webhookUrl = container.dataset.webhook;
      this.guideSlug = container.dataset.guide;
      
      this.scenarioId = null;
      this.history = [];
      this.turnCount = 0;
      this.sessionEnded = false;
      this.isLoading = false;
      
      this.els = {
        setup:        container.querySelector('#trainer-setup'),
        chat:         container.querySelector('#trainer-chat'),
        messages:     container.querySelector('#trainer-messages'),
        feedback:     container.querySelector('#trainer-feedback'),
        inputArea:    container.querySelector('#trainer-input-area'),
        input:        container.querySelector('#trainer-input'),
        sendBtn:      container.querySelector('#trainer-send'),
        persona:      container.querySelector('#trainer-persona'),
        turnCount:    container.querySelector('#trainer-turn-count'),
        progressFill: container.querySelector('#trainer-progress-fill'),
        resetBtn:     container.querySelector('#trainer-reset'),
        cta:          container.querySelector('#trainer-cta'),
        ctaText:      container.querySelector('#trainer-cta-text'),
        ctaLink:      container.querySelector('#trainer-cta-link'),
        ctaRestart:   container.querySelector('#trainer-cta-restart')
      };
      
      this._bind();
    }
    
    _bind() {
      // Scenario buttons
      this.container.querySelectorAll('.trainer__scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => this.startScenario(btn.dataset.scenarioId, btn.dataset.scenarioLabel));
      });
      
      // Send button
      this.els.sendBtn.addEventListener('click', () => this._send());
      
      // Enter to send (Shift+Enter for newline)
      this.els.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this._send();
        }
      });
      
      // Reset
      this.els.resetBtn.addEventListener('click', () => this._reset());
      this.els.ctaRestart.addEventListener('click', () => this._reset());
    }
    
    startScenario(scenarioId, label) {
      this.scenarioId = scenarioId;
      this.history = [];
      this.turnCount = 0;
      this.sessionEnded = false;
      
      // Update persona
      const persona = PERSONAS[scenarioId] || { name: 'AI', role: label, emoji: '🤖' };
      this.els.persona.innerHTML = `
        <span class="trainer__persona-emoji">${persona.emoji}</span>
        <div>
          <strong>${persona.name}</strong>
          <small>${persona.role}</small>
        </div>`;
      
      // Show chat, hide setup
      this.els.setup.hidden = true;
      this.els.chat.hidden = false;
      this.els.cta.hidden = true;
      this.els.inputArea.hidden = false;
      this.els.feedback.hidden = true;
      this.els.messages.innerHTML = '';
      
      // Load first message from server
      this._loadFirstMessage();
    }
    
    async _loadFirstMessage() {
      this._setLoading(true);
      
      try {
        const response = await this._callAPI('__init__');
        
        if (response.first_message) {
          this._addMessage('ai', response.first_message);
          this.history.push({ role: 'assistant', content: response.first_message });
        }
        
        if (response.reply && response.reply !== response.first_message) {
          this._addMessage('ai', response.reply);
          this.history.push({ role: 'assistant', content: response.reply });
        }
        
      } catch(err) {
        this._addMessage('system', 'Не удалось загрузить сценарий. Попробуй обновить страницу.');
        console.error('Trainer init error:', err);
      }
      
      this._setLoading(false);
      this.els.input.focus();
    }
    
    async _send() {
      const text = this.els.input.value.trim();
      if (!text || this.isLoading || this.sessionEnded) return;
      
      this.els.input.value = '';
      this._addMessage('user', text);
      this.history.push({ role: 'user', content: text });
      this._setLoading(true);
      
      this.turnCount++;
      this._updateProgress();
      
      try {
        const response = await this._callAPI(text);
        
        // Add AI reply
        if (response.reply) {
          this._addMessage('ai', response.reply);
          this.history.push({ role: 'assistant', content: response.reply });
        }
        
        // Show feedback if present
        if (response.feedback) {
          this._showFeedback(response.feedback);
        }
        
        // Handle session end
        if (response.session_end) {
          this._endSession(response);
        }
        
      } catch(err) {
        this._addMessage('system', 'Ошибка соединения. Попробуй ещё раз.');
        console.error('Trainer send error:', err);
        this.turnCount--;
        this._updateProgress();
      }
      
      this._setLoading(false);
    }
    
    async _callAPI(userMessage) {
      const isInit = userMessage === '__init__';
      
      const body = {
        scenario_id: this.scenarioId,
        user_message: isInit ? '' : userMessage,
        history: isInit ? [] : this.history.slice(0, -1), // exclude last user message, it's in user_message
        turn_count: this.turnCount
      };
      
      const res = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }
    
    _addMessage(role, text) {
      const div = document.createElement('div');
      div.className = `trainer__message trainer__message--${role}`;
      div.innerHTML = `<p>${this._escapeHtml(text)}</p>`;
      this.els.messages.appendChild(div);
      this.els.messages.scrollTop = this.els.messages.scrollHeight;
    }
    
    _showFeedback(feedback) {
      this.els.feedback.hidden = false;
      const block = document.createElement('div');
      block.className = 'trainer__feedback-block';
      block.innerHTML = `
        <p class="trainer__feedback-title">📝 Разбор ошибок</p>
        ${feedback.good ? `<p class="trainer__feedback-good">✅ <strong>Хорошо:</strong> ${this._escapeHtml(feedback.good)}</p>` : ''}
        ${feedback.improve ? `<p class="trainer__feedback-improve">⚠️ <strong>Исправить:</strong> ${this._escapeHtml(feedback.improve)}</p>` : ''}
        ${feedback.native ? `<p class="trainer__feedback-native">💡 <strong>Native скажет:</strong> ${this._escapeHtml(feedback.native)}</p>` : ''}
      `;
      this.els.feedback.innerHTML = '';
      this.els.feedback.appendChild(block);
      this.els.feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    _endSession(response) {
      this.sessionEnded = true;
      this.els.inputArea.hidden = true;
      this.els.cta.hidden = false;
      
      if (response.cta_text) {
        this.els.ctaText.textContent = response.cta_text;
      }
      
      if (response.guide_slug) {
        this.els.ctaLink.href = `/guides/${response.guide_slug}/`;
      }
      
      this.els.cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    _updateProgress() {
      const pct = Math.min((this.turnCount / 10) * 100, 100);
      this.els.turnCount.textContent = this.turnCount;
      this.els.progressFill.style.width = `${pct}%`;
    }
    
    _setLoading(loading) {
      this.isLoading = loading;
      this.els.sendBtn.disabled = loading;
      this.els.input.disabled = loading;
      this.els.sendBtn.classList.toggle('trainer__send-btn--loading', loading);
    }
    
    _reset() {
      this.scenarioId = null;
      this.history = [];
      this.turnCount = 0;
      this.sessionEnded = false;
      this._updateProgress();
      
      this.els.setup.hidden = false;
      this.els.chat.hidden = true;
      this.els.cta.hidden = true;
      this.els.messages.innerHTML = '';
      this.els.feedback.innerHTML = '';
      this.els.feedback.hidden = true;
      this.els.input.value = '';
    }
    
    _escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
    }
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.trainer').forEach(el => new AITrainer(el));
  });

})();
