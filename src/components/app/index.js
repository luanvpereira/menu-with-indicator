import React from 'react';

import './style.css';
import Menu from '../menu';

const links = [
	{
		label: 'Home',
		link: '#/'
	},
	{
		label: 'About',
		link: '#/about'
	},
	{
		label: 'Contact',
		link: '#/contact'
	},
	{
		label: 'Map',
		link: '#/map'
	}
];

const App = () => <Menu links={links} />;

export default App;
