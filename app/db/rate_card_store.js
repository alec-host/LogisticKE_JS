rateCardConfig = function () {
    var rate =
	{
		"data":
        [
            {
                "min":0,"max":5,"price":150
            }, 
            {
                "min":6,"max":10,"price":250
            },
            {
                "min":11,"max":15,"price":380
            },
            {
                "min":16,"max":20,"price":510
            },
            {
                "min":21,"max":25,"price":640
            },
            {
                "min":26,"max":30,"price":770
            },
            {
                "min":31,"max":35,"price":890
            },
            {
                "min":36,"max":40,"price":1000
            },
            {
                "min":41,"max":45,"price":1150
            },
            {
                "min":46,"max":50,"price":1280
            }
        ]
	}

    return rate;
}

module.exports.rateCardConfig=rateCardConfig;