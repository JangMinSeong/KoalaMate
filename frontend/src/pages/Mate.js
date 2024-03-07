import React, { useState } from 'react';
import Map from 'components/FindMate/Map';
import Matelist from 'components/FindMate/MapDrawer';
import {MapProvider} from 'context/MapContext';
import mapBanner from 'assets/map_banner.svg'

const Mate = () => {
	return (
		<MapProvider>
			<div>
				<img src={mapBanner} alt={mapBanner} style={{ width: '100%', height: 'auto' }}/>
				<Matelist />
				<Map />
			</div>
		</MapProvider>
	);
}

export default Mate;