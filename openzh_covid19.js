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

function getCantonInhabitants() {
	const inhabitants = {
		AG: 678207,
		AI: 16145,
		AR: 55234,
		BL: 288132,
		BS: 194766,
		BE: 1034977,
		FR: 318714,
		GE: 499480,
		GL: 40403,
		GR: 198379,
		JU: 73419,
		LU: 409577,
		NE: 176850,
		NW: 43223,
		OW: 37841,
		SG: 507697,
		SH: 81991,
		SO: 273194,
		SZ: 159165,
		TG: 276472,
		TI: 353343,
		UR: 36433,
		VD: 799145,
		VS: 343955,
		ZH: 1520968,
		ZG: 126837,
		FL: 38114,
	};
	return inhabitants;
}

function getOpenZhCovid19Data(data_columns, callback) {
 	Plotly.d3.csv("https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv",
		function(rows){
			for (c = 0; c < data_columns.length; ++c) {
				let data_column = data_columns[c];
				let total_cases = [];
				let total_dates = [];

				const cantons = getCantons();

				for (let i = 0; i < rows.length; ++i) {
					let row = rows[i];
					let d = row['date'];
					let d_index = total_dates.indexOf(d)
					if (d_index === -1) {
						d_index = total_dates.push(d) - 1;
						let x = []
						x.length = cantons.length
						for (let j = 0; j < x.length; ++j) {
							x[j] = NaN;
						}
						total_cases.push(x)
					}
					let canton = row['abbreviation_canton_and_fl'];
					let c_index = cantons.indexOf(canton);
					let numcul_confirmed = row[data_column];
					if (numcul_confirmed !== "") {
						total_cases[d_index][c_index] = parseInt(numcul_confirmed);
					}
					else {
						total_cases[d_index][c_index] = NaN;
					}
				}
				callback(total_dates, total_cases, data_column);
			}
		}
	);
}

function fillUnavailableValues(data) {
	// fills NaN / unavailable with the last known value
	let data_fixed = [];
	data_fixed.length = data.length;
	for (let i = 0; i < data.length; ++i) {
		data_fixed[i] = [];
		data_fixed[i].length = data[i].length;
		for (let j = 0; j < data[i].length; ++j) {
			if (data[i][j] > 0) {
				data_fixed[i][j] = data[i][j];
			}
			else {
				for (let x = i; x >= 0; --x) {
					if (data[x][j] > 0) {
						data_fixed[i][j] = data[x][j];
						break;
					}
				}
			}
		}
	}
	return data_fixed;
}

function sumCantonalData(data) {
	let data_sum = [];
	data_sum.length = data.length;
	for (let i = 0; i < data.length; ++i) {
		data_sum[i] = 0;
		for (let j = 0; j < data[i].length; ++j) {
			if (!isNaN(data[i][j])) {
				data_sum[i] += data[i][j];
			}
		}
	}
	return data_sum;
}

function diffData(data) {
	let data_inc = [];
	const n = data.length;
	data_inc.length = n;
	data_inc[0] = 0;
	let last_val = data.length > 0 ? data[0] : 0;
	for (let i = 1; i < n; ++i) {
		if (!isNaN(data[i])) {
			data_inc[i] = data[i] - last_val;
			last_val = data[i];
		}
		else {
			data_inc[i] = NaN;
		}
	}
	data_inc[0] = data_inc[1] ;
	return data_inc;
}

function selectCantonalData(data, canton) {
	const cantons = getCantons();
	const c_index = cantons.indexOf(canton);
	if (c_index >= 0) {
		const n = data.length;
		let c_data = []
		c_data.length = n;
		for (let i = 0; i < n; ++i) {
			c_data[i] = data[i][c_index];
		}
		return c_data;
	}
	console.error('canton not found!');
}

function average(data, window_size) {
	const n = data.length;
	const w2 = Math.floor(window_size / 2);
	data_avg = [];
	data_avg.length = n;
	for (let i = w2; i < n - w2; ++i) {
		data_avg[i] = 0;
		for (let j = -w2; j <= w2; ++j) {
			data_avg[i] += data[i + j];
		}
		data_avg[i] /= window_size;
	}
	for (let i = 0; i < w2; ++i) {
		data_avg[i] = data_avg[w2];
	}
	for (let i = n - w2; i < n; ++i) {
		data_avg[i] = data_avg[n - w2 - 1];
	}
	return data_avg;
}
