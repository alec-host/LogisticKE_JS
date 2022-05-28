function testEstimatePayload() {
	const payload =
	{
		"distance": 5,
		"time": 6,
		"currency": "KES",
		"estimates": [
			{
				"vehicle": "Basic",
				"estimate": "300 - 315",
				"icon": "https://littleimages.blob.core.windows.net/app/vehicletypes/Logos_1/BASIC.png",
				"meta": {
					"maxSize": 1,
					"perKM": 35,
					"perMin": 4,
					"min": 200,
					"base": 100
				}
			},
			{
				"vehicle": "LittleBODA",
				"estimate": "150 - 160",
				"icon": "https://littleimages.blob.core.windows.net/app/vehicletypes/Logos_1/BLUEBODA.png",
				"meta": {
					"maxSize": 1,
					"perKM": 14,
					"perMin": 3,
					"min": 100,
					"base": 60
				}
			},
			{
				"vehicle": "Comfort",
				"estimate": "360 - 380",
				"icon": "https://littleimages.blob.core.windows.net/app/vehicletypes/Logos_1/COMFORT.png",
				"meta": {
					"maxSize": 1,
					"perKM": 47,
					"perMin": 4,
					"min": 250,
					"base": 100
				}
			},
			{
				"vehicle": "LadyBUG",
				"estimate": "300 - 315",
				"icon": "https://littleimages.blob.core.windows.net/app/vehicletypes/Logos_1/LADYBUG.png",
				"meta": {
					"maxSize": 1,
					"perKM": 35,
					"perMin": 4,
					"min": 250,
					"base": 100
				}
			},
			{
				"vehicle": "Comfort+",
				"estimate": "390 - 410",
				"icon": "https://littleimages.blob.core.windows.net/app/vehicletypes/Logos_1/COMFORT+.png",
				"meta": {
					"maxSize": 3,
					"perKM": 52,
					"perMin": 4,
					"min": 270,
					"base": 100
				}
			}
		]
	};

	return payload;
};

module.exports.testEstimatePayload=testEstimatePayload;