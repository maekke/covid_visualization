function getOpenZhCovid19Data(data_column, callback) {
 	Plotly.d3.csv("https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv",
		function(rows){
			total_cases = [];
			total_dates = [];

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
			console.log(total_cases)

			total_cases_sum = [];
			total_cases_sum.length = total_cases.length;
			for (let i = 0; i < total_cases.length; ++i) {
				total_cases_sum[i] = 0;
				for (let j = 0; j < total_cases[i].length; ++j) {
					if (total_cases[i][j] > 0) {
						total_cases_sum[i] += total_cases[i][j];
					}
					else {
						for (let x = i; x >= 0; --x) {
							if (total_cases[x][j] > 0) {
								total_cases_sum[i] += total_cases[x][j];
								break;
							}
						}
					}
				}
			}
			console.log(total_cases_sum);

			total_cases_inc = [];
			total_cases_inc.length = total_cases_sum.length;
			total_cases_inc[0] = 0;
			for (let i = 1; i < total_cases_sum.length; ++i) {
				total_cases_inc[i] = total_cases_sum[i] - total_cases_sum[i - 1];
			}
			console.log(total_cases_inc);

			callback(total_dates, total_cases, total_cases_sum, total_cases_inc);
		}
	);
}

