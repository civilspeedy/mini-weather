import React from 'react';
import './App.css';
import Time from './components/Time';

//location request doesn't work on mac

export default function App(): React.JSX.Element {
    return (
        <div>
            <Time />
        </div>
    );
}
