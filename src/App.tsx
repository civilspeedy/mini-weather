import './App.css';
import { storeWeather } from './logic/fileSystem';
import { useTime, useWeather } from './logic/hooks';
storeWeather();
function App() {
    const time = 'test';
    const weather = 'test';

    return (
        <div>
            <p>{time}</p>
            <p>{JSON.stringify(weather)}</p>
        </div>
    );
}

export default App;
