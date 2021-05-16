import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input('title') title: string;
  @Input('showDisclaimer') showDisclaimer: boolean = true;
  @Input('scopes') scopes: any[];
  @Input('labels') labels: any[];
  @Input('values') values: any[];
  @Output('onScopeChange') onScopeChange = new EventEmitter();
  
  scope: string;

  chart: any;

  constructor(private globals: Globals) { }

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
    this.loadChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart != null) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.values;
      this.chart.data.datasets[0].backgroundColor = this.globals.getMultipleOfRGBString(this.values.length);
      this.chart.update(); 
    }
  }

  loadChart() {
    let backgroundColors = this.globals.getMultipleOfRGBString(this.values.length);
    this.chart = new Chart('data-chart', {
      type: 'doughnut',
      data: {
        datasets: [{
            data: this.values,
            backgroundColor: backgroundColors
        }],
        labels: this.labels
      },
      options: {
        title: {
          display: false
        },
        cutoutPercentage: 40,
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                let labelForTooltip = data.labels[tooltipItem.index];
                let dataSet = (<any>data.datasets[0]);
                return labelForTooltip + ": $" + (<number>dataSet.data[tooltipItem.index]).toFixed(2);
              }
          }
        },
        hover: {
          onHover: this.hoverOverSliceEvent
        },
        legend: {
          /*onHover: (() => {
            let prevTarget;
            return (e, el) => {
              const section = el.index;
              if (prevTarget !== section) {    
                console.log(e, el);          
                const currentStyle = e.target.style;
                currentStyle.cursor = section ? 'pointer' : 'default';
              }
              prevTarget = section;
            }
          })(),*/
          onClick: (e, legendItem) => {
            // this.clickedChartIndex(legendItem.index);
          }
        },
        plugins: {
          plugins: [ChartDataLabels],
          datalabels: {
            color: 'white',
            display: (context) => {
              let sum = 0;
              let dataArr = <number[]>context.chart.data.datasets[0].data;
              dataArr.map(data => {
                  sum += data;
              });
              let percentage = (<number>context.chart.data.datasets[0].data[context.dataIndex])*100 / sum;
              return percentage >= 5; 
            },
            formatter: (value, context) => {
              let sum = 0;
              let dataArr = <number[]>context.chart.data.datasets[0].data;
              dataArr.map(data => {
                  sum += data;
              });
              let percentage = "~" + ((value / sum)* 100).toFixed(0)+"%";
              return percentage;
            },
            labels: {
              title: {
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        }
        /*plugins: [{
          afterLayout: function(chart) {
            chart.legend.legendItems.forEach(
              (legendLabel, index) => {
                let label = chart.data.labels[index];
                let data = chart.data.datasets[0].data[index];
                let sameCount = chart.data.datasets[0].sameCount[index];
    
                legendLabel.text = label
                return label;
              }
            )
          }
        }]*/
      }
    });  
  }

  onChartScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.onScopeChange.emit(scope);
  }

  hoverOverSliceEvent = (() => {
    let prevTarget;
    return (e, el) => {
      const section = el[0];
      if (prevTarget !== section) {
        const currentStyle = e.target.style;
        currentStyle.cursor = section ? 'pointer' : 'default';
      }
      prevTarget = section;
    }
  })();
}
