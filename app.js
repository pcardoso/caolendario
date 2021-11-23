/**
 * Generate calendar <table>
 *
 * @param integer year
 * @param integer month
 * @param integer loop the number of months to generate
 * @returns {String} calendar table string
 */

import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
}

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const isWeekend = (someDate) => {
  return [0, 6].indexOf(someDate.getDay()) !== -1;
};

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

var monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function getCalendar(year, month) {
  var totalFeb = calcFebDays(month, year);

  var totalDays = [31, totalFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var isLoop = true;

  var prevMonth = month - 1;
  var prevYear = year;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  var nextMonth = month + 1;
  var nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear = year + 1;
  }

  month = month - 1;

  var thedate = new Date(year, month, 1);

  const weeks = [];
  let W = [];
  isLoop = true;
  const w = getWeekNumber(thedate)[1];
  var week = w;
  var first = thedate.getDay();
  //first day of the month starts on Monday instead on Sunday
  if (first === 0) {
    first = 7;
  }

  // initiate the day with negative value so that the loop can render properly
  var day = 1 - first + 1;
  while (isLoop) {
    // loop for 7 days
    for (let j = 1; j <= 7; j++) {
      W.push({
        meta:
          day >= 1
            ? [
                "day",
                isToday(new Date(year, month, day)) ? "today" : "",
                isWeekend(new Date(year, month, day)) ? "weekend" : "",
              ].join(" ")
            : "",
        value: day >= 1 ? day : "",
      });

      if (day === totalDays[thedate.getMonth()]) {
        isLoop = false;
        break;
      } else {
        day++;
      }
    }

    weeks.push({
      meta: "week week-" + week,
      values: W,
    });

    W = [];

    week++;
  }

  return html`
    <caption>
      ${monthNames[thedate.getMonth()]} ${thedate.getFullYear()}
    </caption>
    <div class="js-calendar">
      <table class="month">
        <tbody>
          <tr>
            ${weekDays.map((d) => html`<th>${d}</th`)}
          </tr>
          ${weeks.map(
            (w) =>
              html`<tr class="${w.meta}">${w.values.map(
                (d) => html`<td class="${d.meta}">${d.value}</td>`
              )}</tr`
          )}
        </tbody>
      </table>
    </div>
  `;
}

function calcFebDays(month, year) {
  var totalFeb = 28;
  if (month === 1) {
    if ((year % 100 !== 0 && year % 4 === 0) || year % 400 === 0) {
      totalFeb = 29;
    } else {
      totalFeb = 28;
    }
  }
  return totalFeb;
}
