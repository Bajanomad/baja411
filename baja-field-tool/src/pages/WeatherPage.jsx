import { weatherMock } from '../data/seed'
export function WeatherPage(){return <main><h2>Weather & storms</h2><p>{weatherMock.summary}</p><p>Rain chance: {weatherMock.rainChance}% · Wind: {weatherMock.windKph} kph</p><p>Drive call: High-profile vehicles should avoid exposed roads this afternoon.</p></main>}
