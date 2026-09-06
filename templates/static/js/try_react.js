import React, { useState, useEffect } from 'react';

function MyComponent() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/endpoint')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    if (!data) {
        return <p > Loading data... < /p>;
    }

    return ( <
        div >
        <
        p > Key: { data.key } < /p> < /
        div >
    );
}

export default MyComponent;