
gg.directive('terranchart', [function() {
  return {
    restrict: 'E',
    scope: {
      match: '=',
      classes: '@'
    },
    replace: true,
    transclude: true,
    template: '<div class="chart {{ classes }}"><div ng-transclude></div><div class="canvas"></div></div>',

    link: function(scope, element, attrs) {

      options = {
        chart: {
          renderTo: element.find('.canvas')[0],
          backgroundColor: null,
          zoomType: "y",
          animation: false,
          width: 310,
          height: 150,
          inverted: true
        },
        plotOptions: {
          columnrange: {
            animation: false,
          },
        },
        legend: {enabled: false},
        xAxis: {
          title: {
            text: null
          },
          labels: {
            style: {
              fontFamily: "'Open Sans', verdana, arial, helvetica, sans-serif"
            },
            enabled: false
          },
          gridLineWidth: 0,
          lineWidth: 0,
          tickLength: 0,
          endOnTick: false
        },
        yAxis: {
          labels: {
            enabled: true,
            style: {
              fontFamily: "'Open Sans', verdana, arial, helvetica, sans-serif"
            }
          },
          title: {
            text: null
          },
          min: 0,
          max: (scope.match.duration_seconds / 60.0),
          allowDecimals: false,
          lineWidth: 1.0,
          tickLength: 5.0,
          endOnTick: false
        },
        tooltip:  {
          enabled: false,
          style: {
            fontFamily: "'Open Sans', verdana, arial, helvetica, sans-serif"
          }
        },
        subtitle: {},
        title: {text: ""},
        credits: {"enabled":false},
        series: []
      };

      macro = scope.match.tmacro;

      nametoshow = scope.$parent.entity.identity.name;
      idtoshow = scope.$parent.entity.identity.id;
      base_stats = macro[idtoshow];
      if (!base_stats) return;

      numbases = base_stats.length
      maxouts = []
      for (basenum=0; basenum<numbases; basenum++) {
        maxout_blob = base_stats[basenum][3];
        for (j=0; j<maxout_blob.length; j++) {
          maxout = maxout_blob[j]
          maxouts.push([basenum, maxout[0] / (16.0 * 60.0), maxout[1] / (16.0 * 60.0)])
        }
      }

      options.series.push({
        name: nametoshow,
        data: maxouts,
        type: 'columnrange',
        color: '#' + scope.$parent.entity.color,
      });

      // mule, supplydrop, scan
      symbols = ['square', 'diamond', 'circle']
      for (i=0; i<3; i++) {
        abilities = [];
        for (basenum=0; basenum<numbases; basenum++) {
          ability_blob = base_stats[basenum][i];
          for (abilnum=0; abilnum<ability_blob.length; abilnum++) {
            abilities.push([basenum, ability_blob[abilnum] / (16.0 * 60.0)]);
          }
        }

        options.series.push({
          name: nametoshow,
          data: abilities,
          color: '#' + scope.$parent.entity.color,
          type: 'scatter',
          marker: { enabled: true,
                  symbol: symbols[i],
                  fillColor: 'rgba(0,0,0,0)',
                  color: '#' + scope.$parent.entity.color,
                  radius: 24 / numbases,
                  lineColor: '#' + scope.$parent.entity.color,
                  lineWidth: 1,
                  states: {
                    hover: {
                      enabled: false
                    }
                  }
                }
        });
      }

      if (scope.$parent.match.engagements) {
          options.yAxis.plotBands = [];
          _.each(scope.$parent.match.engagements, function(engagement) {
            options.yAxis.plotBands.push({
              color: 'rgba(150, 50, 50, 0.1)',
              from: engagement[0] / 960.0,
              to: engagement[1] / 960.0,
              zIndex: 10
            });
          });
      }
            
      scope.chart = new Highcharts.Chart(options);
      scope.show = true;
    }
  }
}]);
