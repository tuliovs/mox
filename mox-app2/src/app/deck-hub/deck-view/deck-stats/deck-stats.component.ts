import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {  TYPE_SUMARY_ICONS,
          TYPE_SUMARY_TOOLTIP,
          MANA_DEVO_TOOLTIP,
          MANA_DEVO_ICONS,
          CHART_COLORS
        } from '@application/_constraints/ICON_LISTS';
import { ActionStateService } from '@application/_services/action-state/action-state.service';


@Component({
  selector: 'app-mox-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.sass']
})
export class DeckStatsComponent implements OnInit, AfterViewInit {
  public object = Object;
  @Input() deckStats;
  public typeIcons = TYPE_SUMARY_ICONS;
  public typeTooltips = TYPE_SUMARY_TOOLTIP;
  public manaDevoIcons = MANA_DEVO_ICONS;
  public manaDevotips = MANA_DEVO_TOOLTIP;
  public formOptions;
  public _chartSelection: string;
  public _chartData: any;

  public chartPie = {
    chartType: 'PieChart',
    dataTable: [ ],
    options: {
      'is3D': true,
      'width': 320,
      'height': 200,
      backgroundColor: '#132030',
      fontName: 'Exo 2',
      chartArea: {
        left: 0,
        top: 45,
        width: '100%',
        height: '70%'
      },
      colors: CHART_COLORS,
      pieSliceTextStyle: {
        color: '#132030',
      },
      legend: {
        position: 'labeled',
        textStyle: { color: '#f9ffff', fontName: 'Exo 2', bold: true }
      },
      tooltip: {
        textStyle: {color: '#132030', fontName: 'Exo 2'},
        showColorCode: true
      },
      slices: {
        0: {offset: 0.1},
        2: {offset: 0.2},
        4: {offset: 0.3},
        6: {offset: 0.4},
        8: {offset: 0.5},
      },
    },
  };

  chartColumn = {
    chartType: 'ColumnChart',
    dataTable: [ ],
    options: {
      title: 'Amount of Cards group by Coverted Mana Cost (CMC)',
      titleTextStyle: {
        color: '#fff',
        fontName: 'Exo 2',
        fontSize: '15px',
        bold: 'true'
      },
      vAxis: {
        textStyle: {
          color: '#667a95',
          fontName: 'Exo 2',
        }
      },
      hAxis: {
        textStyle: {
          color: '#667a95',
          fontName: 'Exo 2',
        }
      },
      backgroundColor: '#132030',
      fontName: 'Exo 2',
      width: 350,
      bar: {groupWidth: '55%'},
      legend: { position: 'none' },
      tooltip: {
        textStyle: {color: '#132030', fontName: 'Exo 2'},
        showColorCode: true
      },
    }
  };
  constructor(
    public _formbuilder: FormBuilder,
    public _state: ActionStateService,
    public _deckService: MoxDeckService,
    public _router: Router,
  ) { }

  ngOnInit() {
    if (this.deckStats) {
      const s = this._deckService.deckProcess._deckStats;
      let data;
      data = [
        ['Types', 'N in deck'],
        ['Lands', s.typeLineData[0]],
        ['Creatures', s.typeLineData[1]],
        ['Instants', s.typeLineData[2]],
        ['Sorcerys', s.typeLineData[3]],
        ['Artifacts', s.typeLineData[4]],
        ['Enchantments', s.typeLineData[5]],
        ['Planeswalker', s.typeLineData[6]]
      ];
      this.chartPie.dataTable = data;
      this._chartSelection = 'cardtypes';
      this._chartData = this.chartPie;
      this.formOptions = this._formbuilder.group({
        color: 'accent',
        chartSelection: this._chartSelection,
      });
    }
  }

  ngAfterViewInit() {
  }

  changeDataChart() {
    const s = this._deckService.deckProcess._deckStats;
    let data;
    switch (this._chartSelection) {
      case 'cmcCourve':
        data = [];
        data.push(['Cost', 'Amount of Cards', { role: 'style' }, { role: 'annotation' }]);
        s.cmcTotals.forEach(
          (v, i) => {
            data.push([i, v , CHART_COLORS[i] , i]);
          }
        );
        this.chartColumn.dataTable = data;
        this._chartData = this.chartColumn;
        break;
      case 'cardtypes':
        data = [
          ['Types', 'N in deck'],
          ['Lands', s.typeLineData[0]],
          ['Creatures', s.typeLineData[1]],
          ['Instants', s.typeLineData[2]],
          ['Sorcerys', s.typeLineData[3]],
          ['Artifacts', s.typeLineData[4]],
          ['Enchantments', s.typeLineData[5]],
          ['Planeswalker', s.typeLineData[6]]
        ];
        this.chartPie.dataTable = data;
        this._chartData = this.chartPie;
        break;
    }
  }

  async proCmc() {
    const dk = this._deckService;
    this._state.setState('loading');
    await dk.statTools.proCmcTotals(dk.deckProcess)
    .then(p => dk.updateDeckStats(p))
    .then(() => {
        this._state.setState('nav');
      }
    )
    .catch((err) => {
      console.error(err);
      this._state.setState('error');
    });
  }

  async proGuild() {
    const dk = this._deckService;
    this._state.setState('loading');
    await dk.statTools.proColorId(dk.deckProcess)
    .then(p => dk.updateDeckStats(p))
    .then(() => {
        this._state.setState('nav');
      }
    )
    .catch((err) => {
      console.error(err);
      this._state.setState('error');
    });
  }

  async proPrice() {
    const dk = this._deckService;
    this._state.setState('loading');
    await dk.statTools.proPrice(dk.deckProcess)
    .then(p => dk.updateDeckStats(p))
    .then(() => {
        this._state.setState('nav');
      }
    )
    .catch((err) => {
      console.error(err);
      this._state.setState('error');
    });
  }

  async proLegal() {
    const dk = this._deckService;
    this._state.setState('loading');
    await dk.statTools.proLegalities(dk.deckProcess)
    .then(p => dk.updateDeckStats(p))
    .then(() => {
        this._state.setState('nav');
      }
    )
    .catch((err) => {
      console.error(err);
      this._state.setState('error');
    });
  }

  async proTypes() {
    const dk = this._deckService;
    this._state.setState('loading');
    await dk.statTools.proCardTypesTotals(dk.deckProcess)
    .then(p => dk.updateDeckStats(p))
    .then(() => {
        this._state.setState('nav');
      }
    )
    .catch((err) => {
      console.error(err);
      this._state.setState('error');
    });
  }

  async proDevo() {
    const dk = this._deckService;
    this._state.setState('loading');
    await dk.statTools.proColorDevo(dk.deckProcess)
    .then(p => dk.updateDeckStats(p))
    .then(() => {
        this._state.setState('nav');
      }
    )
    .catch((err) => {
      console.error(err);
      this._state.setState('error');
    });
  }

}
