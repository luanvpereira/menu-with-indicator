import React, { Component } from 'react';

import './style.css';
import Menu from '../menu';

const links = [
	{
		label: 'Home',
		link: '/home'
	},
	{
		label: 'About',
		link: '/about'
	},
	{
		label: 'Contact',
		link: '/contact'
	},
	{
		label: 'Map',
		link: '/map'
	}
];

class App extends Component {
	render() {
		return <Menu links={links} />;
	}
}

export default App;
