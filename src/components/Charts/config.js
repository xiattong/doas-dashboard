export const basicOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  responsive: true,
};

export let purpleChartOptions = {
  ...basicOptions,
  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest"
  },
  legend:{ // title下面的 小标题 和 小图的配置
	display:true, //是显示
	position: "top",
	fullWidth:"true", //标记此框应占据画布的整个宽度（按下其他框）。这在日常使用中不太可能需要改变
	labels:{ //图例标签配置
		boxWidth:10 ,//彩色框的宽度
		fontSize: 18,
		fontStyle:"normal", //字体风格
		padding: 20, //填充行之间的彩色框
		usePointStyle:true //标签样式将匹配相应的点样式（大小基于fontSize，在这种情况下不使用boxWidth
	}
  },
  scales: {
    yAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.0)',
        zeroLineColor: "transparent",
      },
      ticks: {
		beginAtZero:true,
        suggestedMin: 0,
        suggestedMax: 10,
        padding: 20,
        fontColor: "#9a9a9a",
      }
    }],

    xAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        zeroLineColor: "transparent",
      },
      ticks: {
		beginAtZero:true,
        padding: 20,
        fontColor: "#9a9a9a"
      }
    }]
  }
}