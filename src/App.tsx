import './App.css';
import { useTime, useWeather } from './logic/hooks';

function App() {
    const time = useTime();
    const weather = useWeather();
    return (
        <div>
            <p>{time}</p>
            <p>{JSON.stringify(weather)}</p>
        </div>
    );
}

export default App;
