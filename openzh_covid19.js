function getCantons() {
	const cantons = [
		"AG",
		"AI",
		"AR",
		"BE",
		"BL",
		"BS",
		"FR",
		"GE",
		"GL",
		"GR",
		"JU",
		"LU",
		"NE",
		"NW",
		"OW",
		"SG",
		"SH",
		"SO",
		"SZ",
		"TG",
		"TI",
		"UR",
		"VD",
		"VS",
		"ZG",
		"ZH",
		"FL",
	];
	return cantons;
}

function getOpenZhCovid19Data(data_columns, callback) {
 	Plotly.d3.csv("https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv",
		function(rows){
			for (c = 0; c < data_columns.length; ++c) {
				data_column = data_columns[c];
				total_cases = [];
				total_dates = [];

				const cantons = getCantons();

				for (let i = 0; i < rows.length; ++i) {
					row = rows[i];
					let d = row['date'];
					let d_index = total_dates.indexOf(d)
					if (d_index === -1) {
						d_index = total_dates.push(d) - 1;
						let x = []
						x.length = cantons.length
						total_cases.push(x)
					}
					let canton = row['abbreviation_canton_and_fl'];
					let c_index = cantons.indexOf(canton);
					let numcul_confirmed = row[data_column];
					if (numcul_confirmed !== "") {
						total_cases[d_index][c_index] = parseInt(numcul_confirmed);
					}
					else if (numcul_confirmed === "" && d_index > 0) {
						total_cases[d_index][c_index] = total_cases[d_index - 1][c_index];
					}
				}

				// "fix" unavailable data entries
				total_cases_fixed = [];
				total_cases_fixed.length = total_cases.length;
				for (let i = 0; i < total_cases.length; ++i) {
					total_cases_fixed[i] = [];
					total_cases_fixed[i].length = total_cases[i].length;
					for (let j = 0; j < total_cases[i].length; ++j) {
						if (total_cases[i][j] > 0) {
							total_cases_fixed[i][j] = total_cases[i][j];
						}
						else {
							for (let x = i; x >= 0; --x) {
								if (total_cases[x][j] > 0) {
									total_cases_fixed[i][j] = total_cases[x][j];
									break;
								}
							}
						}
					}
				}

				callback(total_dates, total_cases_fixed, data_column);
			}
		}
	);
}

function sumCantonalData(data) {
	data_sum = [];
	data_sum.length = data.length;
	for (let i = 0; i < data.length; ++i) {
		data_sum[i] = 0;
		for (let j = 0; j < data[i].length; ++j) {
			if (data[i][j] > 0) {
				data_sum[i] += data[i][j];
			}
		}
	}
	return data_sum;
}

function diffData(data) {
	data_inc = [];
	const n = data.length;
	data_inc.length = n;
	data_inc[0] = 0;
	for (let i = 1; i < n; ++i) {
		data_inc[i] = data[i] - data[i - 1];
	}
	data_inc[0] = data_inc[1] ;
	return data_inc;
}
