const cheerio = require('cheerio');
const got = require('got');

const citiesURL = 'https://worldpopulationreview.com/world-cities';
const countriesURL = 'https://www.worldometers.info/world-population/population-by-country/';

async function getCities(){
  const response = await got(citiesURL);
  let $ = cheerio.load(response.body);

  const arr = []
  const top20 = $('tbody > tr').slice(0,21)  
  $(top20).each(function(i, obj) {
    const cols = $(obj).find('td')
    arr.push({
      id: $(cols[0]).text(),
      name: $(cols[1]).text(),
      country: $(cols[2]).text(),
      pop21: $(cols[3]).text(),
      pop20: $(cols[4]).text(),
      change: $(cols[5]).text()
    })
  })
  return arr
}

async function getCountries(){
  const response = await got(countriesURL);
  let $ = cheerio.load(response.body);

  const arr = []
  const top20 = $('tbody > tr').slice(0, 32) //argentina 32  
  $(top20).each(function(i, obj) {
    const cols = $(obj).find('td')
    arr.push({
      id: $(cols[0]).text(),
      name: $(cols[1]).text(),
      pop20: $(cols[2]).text(),
      change: $(cols[3]).text(),
    })
  })
  return arr
}

(async () => {

  // Promise.all([getCities(), getCountries()])
  //   .then( (result) => initData( {
  //     cities: result[0],
  //     contries: result[1]
  //   }))

  // let citiesList, countriesList = []
  // function initData( { cities, countries } ){
  //   console
  //   citiesList = cities
  //   countriesList = countries
  // }

  const [cities, countries] = await Promise.all([ getCities(), getCountries() ]);
  // console.log(cities)
  // console.log(contries)


  // const cities = await getCities()
  // const countries = await getCountries()
  
  // console.table(cities)
  // console.table(countries)

  const getCountryByName = country => 
    countries.find(co => co.name.toLowerCase() === country.toLowerCase()) 

  const sanitizeNumber = n => 
    Number(n.replace(/[^0-9.-]+/g,""))
  
  const mixed = cities.map( ci => {

    const country = getCountryByName(ci.country)
    const percentCityPerCountry = ((sanitizeNumber(ci.pop20) / sanitizeNumber(country.pop20)) * 100).toFixed(2)

    return {
      ...ci,
      totalCountry: country.pop20,
      percentCityPerCountry
    }

  })
  mixed.forEach(item => {
    delete item.change
    delete item.pop21    
  })
  console.table(mixed)

})();