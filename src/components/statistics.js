import AbstractSmartComponent from './abstract-smart-component';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Period} from '../models/movies';

export const StatsPeriod = {
  'statistic-all-time': Period.ALL_TIME,
  'statistic-today': Period.TODAY,
  'statistic-week': Period.WEEK,
  'statistic-month': Period.MONTH,
  'statistic-year': Period.YEAR,
};

export const PeriodIdMap = {
  [Period.ALL_TIME]: `statistic-all-time`,
  [Period.TODAY]: `statistic-today`,
  [Period.WEEK]: `statistic-week`,
  [Period.MONTH]: `statistic-month`,
  [Period.YEAR]: `statistic-year`,
};

const renderGenresChart = (genresCtx, movies) => {
  return new Chart(genresCtx, {
    plugins: ChartDataLabels,
    type: `horizontalBar`,
    data: {
      labels: movies.genres.map((genre) => genre.name),
      datasets: [{
        data: movies.genres.map((genre) => genre.moviesNumber),
        backgroundColor: `#ffe800`,
        barThickness: 35,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: `start`,
          anchor: `start`,
          offset: 25,
          font: {
            size: 18
          },
          color: `#ffffff`
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            padding: 60,
            fontStyle: `bold`,
            fontColor: `#ffffff`,
            fontSize: 22,
          },
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
          },
        }]
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {
          top: 10,
          left: 20,
        }
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = ({moviesNumber, duration, genres}, watchedFilmsNumber) => {
  const hours = moment.utc(duration).get(`hour`);
  const minutes = moment.utc(duration).get(`minutes`);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${watchedFilmsNumber}</span>
      </p>
  
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
  
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesNumber ? moviesNumber : `0`} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${duration ? hours : `0`} <span class="statistic__item-description">h</span> ${duration ? minutes : `0`} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${genres.length ? genres[0].name : `-`}</p>
        </li>
      </ul>
  
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
  
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(movies, watchedFilmsNumber) {
    super();

    this._movies = movies;
    this._watchedFilmsNumber = watchedFilmsNumber;

    this._genresChart = null;

    this._renderChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._movies, this._watchedFilmsNumber);
  }

  rerender() {
    super.rerender();

    this._renderChart();
  }

  _renderChart() {
    if (this._movies.moviesNumber === 0) {
      return;
    }

    const element = this.getElement();

    const genresCtx = element.querySelector(`.statistic__chart`);

    this._resetChart();

    this._genresChart = renderGenresChart(genresCtx, this._movies);
  }

  _resetChart() {
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
  }

  setChangePeriod(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const periodItem = evt.target.id;

      handler(StatsPeriod[periodItem]);
    });
  }

  setCheckedPeriod(period) {
    this.getElement().querySelector(`#${PeriodIdMap[period]}`).checked = true;
  }
}
