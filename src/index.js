import reactDOM from 'react-dom';
import React, { Component } from 'react';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
// import "./styles/litera.min.css";
import 'normalize.css';
import './styles/style.css';
import {
  APPLICATION_LOCK,
  APPLICATION_STEP,
  MODE,
  AGGREGATION_MODE
} from './utils/Constants';

import TicketHandlers from './utils/ticketHandlers';
import SampleHandlers from './utils/sampleHandlers';
import AlertHandlers from './utils/AlertHandlers';
import InputHandlers from './utils/InputHandlers';
import RepeatHandlers from './utils/RepeatHandlers';
import StatisticHandlers from './utils/StatisticHandlers';
import FilterHandlers from './utils/FilterHandlers';

import Tickets from './components/box/Tickets';
import Histogram from './components/Histogram';
import Samples from './components/sample/Samples';
import Alert from './components/Alert';
import Statistic from './components/statistic/Statistic';
import Cycle from './components/Cycle';
import BoxControl from './components/box/BoxControl';
import SampleControl from './components/sample/SampleControl';
import Repeat from './components/Repeat';
import StatisticControl from './components/statistic/StatisticControl';
import Bar from './components/Bar';
import FilterControl from './components/FilterControl';
import ChartInfo from './components/ChartInfo';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleAddTicket = TicketHandlers.handleAddTicket.bind(this);
    this.handleRemoveTicket = TicketHandlers.handleRemoveTicket.bind(this);
    this.handleResetTicket = TicketHandlers.handleResetTicket.bind(this);
    this.handleSampleTicket = SampleHandlers.handleSampleTicket.bind(this);
    this.handleEditTicket = TicketHandlers.handleEditTicket.bind(this);
    this.handleSetTicket = TicketHandlers.handleSetTicket.bind(this);

    this.handleResetSample = SampleHandlers.handleResetSample.bind(this);
    this.handleAlert = AlertHandlers.handleAlert.bind(this);
    this.clearAlert = AlertHandlers.clearAlert.bind(this);

    this.handleAggregate = StatisticHandlers.handleAggregate.bind(this);
    this.handleClearStats = StatisticHandlers.handleClearStats.bind(this);
    this.handleCount = StatisticHandlers.handleCount.bind(this);

    this.handleChangeAggregate = InputHandlers.handleChangeAggregate.bind(this);
    this.OnAmountChange = InputHandlers.OnAmountChange.bind(this);
    this.OnModeChange = InputHandlers.OnModeChange.bind(this);
    this.onQuickChange = InputHandlers.onQuickChange.bind(this);

    this.handleRepeat = RepeatHandlers.handleRepeat.bind(this);
    this.quickMode = RepeatHandlers.quickMode.bind(this);

    this.calculateSD = FilterHandlers.calculateSD.bind(this);
    this.setFilterOperator = FilterHandlers.setFilterOperator.bind(this);
    this.setFilterValue = FilterHandlers.setFilterValue.bind(this);
    this.calculateMean = FilterHandlers.calculateMean.bind(this);

    this.setAnimationTime = this.setAnimationTime.bind(this);
    this.state = {
      tickets: [1, 2, 3, 4, 5],
      samples: [],
      lock: APPLICATION_LOCK.NONE,
      sampled: null,
      stats: [],
      amount: 3,
      mode: MODE.WITH,
      aggregate: AGGREGATION_MODE.SUM,
      count: 0,
      step: APPLICATION_STEP.SAMPLE,
      isLooping: false,
      filterOperator: 'GE',
      filterValue: 10,
      animationTime: 700
    };
  }

  setAnimationTime(time) {
    return this.setState({ animationTime: time });
  }

  componentWillUpdate() {
    if (
      this.state.step < APPLICATION_STEP.ANALYZE &&
      this.state.stats.length >= 2
    ) {
      this.setState({ step: APPLICATION_STEP.ANALYZE });
    }
  }

  componentDidUpdate(prop, prevState) {
    if (
      prevState.stats.length != this.state.stats.length &&
      this.state.step == APPLICATION_STEP.DONE
    ) {
      console.log('auto calculate');
      this.handleCount(this.state.filterValue, this.state.filterOperator);
    }
  }

  render() {
    return (
      <div>
        {this.state.alert ? (
          <Alert msg={this.state.alert} clearAlert={this.clearAlert} />
        ) : (
          ''
        )}
        <div className="container-fluid">
          <h1 className="display-4 text-center my-0">
            The Box Model Simulator
          </h1>
          <p className="lead text-center">
            By{' '}
            <a href="https://bentzkast.github.io/" target="_blank">
              Joseph Alfredo
            </a>{' '}
            &{' '}
            <a href="http://www.calpoly.edu/~dsun09" target="_blank">
              Dennis L. Sun
            </a>
          </p>

          <Bar step={this.state.step} />
          <div className="row no-gutters">
            <div className="col-2">
              <Repeat
                step={this.state.step}
                amount={this.state.amount}
                aggregate={this.state.aggregate}
                handleRepeat={this.handleRepeat}
                quickMode={this.state.quickMode}
                onQuickChange={this.onQuickChange}
                handleAlert={this.handleAlert}
                lock={
                  this.state.lock !== APPLICATION_LOCK.NONE ||
                  this.state.isLooping
                }
                setAnimationTime={this.setAnimationTime}
              />
            </div>
            <div className={`col-10`}>
              <Cycle
                step={this.state.step}
                template={
                  <div className="form-inline">
                    <select
                      className="form-control"
                      id="template"
                      onChange={this.handleSetTicket}
                      disabled={
                        this.state.lock !== APPLICATION_LOCK.NONE ||
                        this.state.isLooping
                      }
                    >
                      <option value="DEFAULT">
                        Edit the tickets in the box below, or choose a template
                        from this menu.
                      </option>
                      <option value="DICE">Roll a fair, 6-sided die</option>
                      <option value="COIN">Toss a fair coin</option>
                    </select>
                  </div>
                }
                boxControls={
                  <BoxControl
                    lock={
                      this.state.lock !== APPLICATION_LOCK.NONE ||
                      this.state.isLooping
                    }
                    handleAddTicket={this.handleAddTicket}
                    handleResetTicket={this.handleResetTicket}
                    handleAlert={this.handleAlert}
                    tickets={
                      this.state.sampled !== null
                        ? this.state.sampled
                        : this.state.tickets
                    }
                    handleEditTicket={this.handleEditTicket}
                  />
                }
                box={
                  <Tickets
                    lock={this.state.lock !== APPLICATION_LOCK.NONE}
                    tickets={
                      this.state.sampled !== null
                        ? this.state.sampled
                        : this.state.tickets
                    }
                    handleRemoveTicket={this.handleRemoveTicket}
                  />
                }
                boxChartInfo={
                  <ChartInfo
                    count={this.state.tickets.length}
                    mean={this.calculateMean(this.state.tickets)}
                    sd={this.calculateSD(this.state.tickets)}
                  />
                }
                boxHist={
                  <Histogram
                    data={this.state.tickets}
                    dataXlim={this.state.tickets}
                  />
                }
                samples={
                  <Samples
                    samples={this.state.samples}
                    animationTime={this.state.animationTime}
                    lock={
                      this.state.lock !== APPLICATION_LOCK.NONE ||
                      this.state.isLooping
                    }
                  />
                }
                samplesControls={
                  <SampleControl
                    step={this.state.step}
                    handleSampleTicket={this.handleSampleTicket}
                    amount={this.state.amount}
                    mode={this.state.mode}
                    OnAmountChange={this.OnAmountChange}
                    OnModeChange={this.OnModeChange}
                    OnHandleReset={this.handleResetSample}
                    lock={
                      this.state.lock !== APPLICATION_LOCK.NONE ||
                      this.state.isLooping
                    }
                    setAnimationTime={this.setAnimationTime}
                  />
                }
                sampleRecycle={
                  <div className="d-flex flex-column align-items-stretch box-control-menu">
                    <button
                      type="button"
                      className={`btn btn-warning my-1`}
                      style={{ marginLeft: '1px' }}
                      onClick={this.handleResetSample}
                      disabled={
                        this.state.lock === APPLICATION_LOCK.PROCESSING ||
                        this.state.isLooping
                      }
                    >
                      <i className="fa fa-undo" aria-hidden="true" />
                    </button>
                  </div>
                }
                sampleChartInfo={
                  <ChartInfo
                    count={this.state.samples.length}
                    mean={this.calculateMean(this.state.samples)}
                    sd={this.calculateSD(this.state.samples)}
                  />
                }
                samplesHist={
                  <Histogram
                    data={this.state.samples}
                    dataXlim={this.state.tickets}
                    animationTime={this.state.animationTime}
                  />
                }
                stats={<Statistic stats={this.state.stats} />}
                statsChartInfo={
                  <ChartInfo
                    count={this.state.stats.length}
                    mean={this.calculateMean(this.state.stats)}
                    sd={this.calculateSD(this.state.stats)}
                  />
                }
                statsHist={
                  <Histogram
                    data={this.state.stats}
                    dataXlim={
                      this.state.aggregate == AGGREGATION_MODE.SUM
                        ? this.state.stats
                        : this.state.tickets
                    }
                  />
                }
                statsControl={
                  <StatisticControl
                    handleSum={this.handleSum}
                    handleMean={this.handleMean}
                    handleAggregate={this.handleAggregate}
                    handleChangeAggregate={this.handleChangeAggregate}
                    aggregate={this.state.aggregate}
                    step={this.state.step}
                    lock={
                      this.state.lock === APPLICATION_LOCK.PROCESSING ||
                      this.state.isLooping
                    }
                    isSampleEmpty={this.state.samples.length == 0}
                  />
                }
                statsClear={
                  <div className="d-flex flex-column align-items-stretch box-control-menu">
                    <button
                      className="btn btn-danger stats-control "
                      onClick={this.handleClearStats}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                }
                filterControl={
                  <FilterControl
                    filterOperator={this.state.filterOperator}
                    filterValue={this.state.filterValue}
                    handleCount={this.handleCount}
                    setFilterOperator={this.setFilterOperator}
                    setFilterValue={this.setFilterValue}
                  />
                }
                totalCount={this.state.stats.length}
                count={this.state.count}
              />
            </div>
          </div>
          <button
            type="button"
            className={`btn btn-danger sticky`}
            onClick={() => {
                if (window.confirm("Do you really want to start over?")) {
                  window.location.reload();
                }
              }
            }
            disabled={false}
          >
            Start Over
        </button>
        </div>
      </div>
    );
  }
}

reactDOM.render(<App />, document.getElementById('root'));
