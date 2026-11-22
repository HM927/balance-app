import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch'; // YOUR THEME
import dayGridPlugin from 'fullcalendar/daygrid';
import interactionPlugin from 'fullcalendar/interaction'

// stylesheets
import 'fullcalendar/skeleton.css'; // ALWAYS NEED SKELETON
import 'fullcalendar/themes/monarch/theme.css'; // YOUR THEME
import 'fullcalendar/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE

import { calculateBalance } from './balance.js';
import { loadBaseInfo } from './storage.js';
import { showCalculatedBalance, showSelectedTransactions } from './view.js';
import { getTransactionsByDate } from './transactions.js';
import { fetchTransactions } from './api.js';

const calendarEl = document.getElementById('calendar');

let prevdayEl = null;
const calendar = new Calendar(calendarEl, {
  plugins: [themePlugin, dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth'
  },
  dateClick: async function(info) {
    if (prevdayEl !== null) {
        prevdayEl.style.backgroundColor = '';
    }
    
    info.dayEl.style.backgroundColor = 'red';
    
    prevdayEl = info.dayEl;

    const baseInfo = loadBaseInfo();

    if (baseInfo === null) {
        return;
    }

    const transactions = await fetchTransactions();
    const targetDate = info.dateStr;

    const balance = calculateBalance(
        baseInfo,
        transactions,
        targetDate
    );

    showCalculatedBalance(balance);

    const selectedTransactions = getTransactionsByDate(transactions, info.dateStr);

    showSelectedTransactions(selectedTransactions);
  }

});
calendar.render();