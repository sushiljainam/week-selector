class WeekSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    render() {
        const style = `
        <style>
          :host {
            display: inline-block;
            font-family: Arial, sans-serif;
          }
          .container {
            display: flex;
            align-items: center;
          }
          button {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
          }
          span {
            margin: 0 10px;
          }
        </style>
      `;

        const html = `
        <div class="container">
          <button id="prevWeek">&lt;</button>
          <span id="weekLabel"></span>
          <button id="nextWeek">&gt;</button>
        </div>
      `;

        this.shadowRoot.innerHTML = style + html;
    }

    setupListeners() {
        this.shadowRoot.getElementById('prevWeek').addEventListener('click', () => this.changeWeek(-1));
        this.shadowRoot.getElementById('nextWeek').addEventListener('click', () => this.changeWeek(1));
    }

    changeWeek(offset) {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + offset * 7);
        this.setSelectedDate(newDate);
    }

    setSelectedDate(date) {
        this.selectedDate = this.getNextFriday(date);
        this.updateWeekLabel();
        this.dispatchEvent(new CustomEvent('week-changed', { detail: this.selectedDate }));
    }

    getNextFriday(date) {
        const dayOfWeek = date.getDay();
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
        const nextFriday = new Date(date);
        nextFriday.setDate(date.getDate() + daysUntilFriday);
        return nextFriday;
    }

    updateWeekLabel() {
        const startDate = new Date(this.selectedDate);
        startDate.setDate(this.selectedDate.getDate() - 6);
        const weekLabel = this.shadowRoot.getElementById('weekLabel');
        weekLabel.textContent = `${this.formatDate(startDate)} - ${this.formatDate(this.selectedDate)}`;
    }

    formatDate(date) {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    }

    static get observedAttributes() {
        return ['selected-date'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-date') {
            this.setSelectedDate(new Date(newValue));
        }
    }
}

customElements.define('week-selector', WeekSelector);
