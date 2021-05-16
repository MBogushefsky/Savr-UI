import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input('title') title: string;
  @Input('showDisclaimer') showDisclaimer: boolean = true;
  @Input('scopes') scopes: any[];
  @Input('labels') labels: any[];
  @Input('values') values: any[];
  @Output('onScopeChange') onScopeChange = new EventEmitter();

  scope: string;

  chart: any;
  chartWidth: number = 800;
  chartHeight: number = 600;

  constructor() { }

  ngOnInit() {
    if (this.scopes != null) {
      let foundDefaultScope = false;
      for (let scope of this.scopes) {
        if (scope.default) {
          foundDefaultScope = true;
          this.scope = scope.value;
        }
      }
      if (!foundDefaultScope) {
        this.scope = this.scopes[0].value;
      }
    }
    this.loadChart(this.labels, this.values);
  }
    
  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart != null) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.values;
      this.chart.update(); 
    }
  }

  onChartScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.onScopeChange.emit(scope);
  }

  loadChart(labels: any[], values: any[]) {
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: function(ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);

          if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            var activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                x = activePoint.tooltipPosition().x,
                topY = this.chart.legend.bottom,
                bottomY = this.chart.chartArea.bottom;

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#D3D3D3';
            ctx.stroke();
            ctx.restore();
          }
      }
    });
    this.chart = new Chart('data-chart', {
      type: 'LineWithLine',
      data: {
        labels: labels
        // Array.from(dataMap.keys()).reverse().map(
        //   (dateKey) => {
        //     if (dateKey === moment().format("YYYY-MM-DD")) {
        //       return 'Today';
        //     }
        //     else if (dateKey === moment().subtract(1, "days").format("YYYY-MM-DD")) {
        //       return 'Yesterday';
        //     }
        //     return moment(dateKey).format("MM-DD");
        //   }
        // )
        ,
        datasets: [
          {
            label: this.title,
            data: values,
            //Array.from(dataMap.values()).reverse(),
            borderWidth: 3,
            fill: false,
            backgroundColor: 'rgb(173,216,230)',
            borderColor: 'rgb(173,216,230)'
          }
        ]
      },
      options: {
        title: {
          display: false
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false,
          displayColors: false,
          callbacks: {
            title: function(tooltipItem, data) {
              return "";
            },
            label: function(tooltipItem, data) {
              return tooltipItem.xLabel + " ($" + Number(tooltipItem.yLabel).toFixed(2) + ")";
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
              maxTicksLimit: 31
            }
          }],
          yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: function(value, index, values) {
                    return '$' + value;
                }
              }
          }]
        },
        plugins: {
          datalabels: {
            display: false,
            formatter: (value, context) => {
              return value.toFixed(2);
            }
          }
        }
      }
    });
  }

}
