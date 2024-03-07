// src/contexts/MapContext.js
import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext(null);


export const MapProvider = ({ children }) => {
    const [visibleMarkersData, setVisibleMarkersData] = useState([]);

    return (
        <MapContext.Provider value={{ visibleMarkersData, setVisibleMarkersData }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => useContext(MapContext);
