import React from 'react';

function DeparturesDisplay() {
    // Hypothetical URL with a query parameter indicating that we want custom styles.
    // This requires server-side support which might not be present, this is just an illustrative example.
    const url = "https://mon.ruter.no/departures/59.90005-10.625458/N4Igrgzgpgwg9gGzAWwHYBkCGBPOYAuIAXAGaYLQA0IARnJgE4AmExA2qBPnAA4AKCTAGMoASRbsQAOQDKAJSIzu-QSKIBmAGwBGABwgAutSZRB2KEyWN8AFQCWyKMQAM1ABZ2mJjHdRRWRMAAvtSoKDRQDADyJAAiUDzWYAz+xABMriD4dvgITkQgNqZQqHAMAAQAYmV+NGAgxnYQmDR5TDYMmKgQPGX4ALJwJgFsRiAlLW3E+AxgUO6eUB3CANbwSGjEZBRQIZzKAsJiEkRs0vKKB6pQGppp2obGpjgWVgy2DvmZHl4l6L6pQIhEBhZARaJxBJJFIBXTUbK5fIgaoMWpgRIMFYlBogJhNSYWZbdXrvQbDdhjCatCxbchUEA-JadIRrRAoVC0nZBMYAN0iEDscA5RDSQSAA";

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Using an iframe to embed the website */}
            <iframe
                src={url}
                title="Departures Display"
                style={{ border: 'none', width: '100%', height: '100%' }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
            />
        </div>
    );
}

export default DeparturesDisplay;
