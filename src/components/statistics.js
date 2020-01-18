import AbstractSmartComponent from './abstract-smart-component';
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

const ChartSetting = {
  BAR_COLOR: `#ffe800`,
  BAR_THICKNESS: 35,
  FONT_SIZE: 18,
  LABEL_COLOR: `#ffffff`,
  LABEL_OFFSET: 25,
  LABEL_ALIGN: `start`,
  TICKS_COLOR: `#ffffff`,
  TICKS_PADDING: 60,
  TICKS_FONT_SIZE: 22,
  TICKS_FONT_STYLE: `bold`,
  LAYOUT_PADDING_TOP: 10,
  LAYOUT_PADDING_LEFT: 20,
};

const renderGenresChart = (genresCtx, movies) => {
  return new Chart(genresCtx, {
    plugins: ChartDataLabels,
    type: `horizontalBar`,
    data: {
      labels: movies.genres.map((genre) => genre.name),
      datasets: [{
        data: movies.genres.map((genre) => genre.moviesNumber),
        backgroundColor: ChartSetting.BAR_COLOR,
        barThickness: ChartSetting.BAR_THICKNESS,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: ChartSetting.LABEL_ALIGN,
          anchor: ChartSetting.LABEL_ALIGN,
          offset: ChartSetting.LABEL_OFFSET,
          font: {
            size: ChartSetting.FONT_SIZE
          },
          color: ChartSetting.LABEL_COLOR
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            padding: ChartSetting.TICKS_PADDING,
            fontStyle: ChartSetting.TICKS_FONT_STYLE,
            fontColor: ChartSetting.TICKS_COLOR,
            fontSize: ChartSetting.TICKS_FONT_SIZE,
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
          top: ChartSetting.LAYOUT_PADDING_TOP,
          left: ChartSetting.LAYOUT_PADDING_LEFT,
        }
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = ({moviesNumber, duration, genres}, profileRank) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % hours;

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${profileRank}</span>
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
  constructor(movies, profileRank) {
    super();

    this._movies = movies;
    this._profileRank = profileRank;

    this._genresChart = null;

    this._renderChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._movies, this._profileRank);
  }

  rerender() {
    super.rerender();

    this._renderChart();
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
}
