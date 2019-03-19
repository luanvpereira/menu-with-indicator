import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import './style.css';
import logo from './logo.svg';

class Menu extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			indicatorWidth: 0,
			indicatorLeft: 0,
			showIndicator: false
		};

		this.listContainer = React.createRef();

		this.handleClick = this.handleClick.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.debouncedResize = debounce(this.handleResize, 50);

		this.bounds = [];
		this.currentIndex = 0;
	}

	static propTypes = {
		links: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				link: PropTypes.string.isRequired
			})
		).isRequired,
		handleChange: PropTypes.func
	}

	static defaultProps = {
		handleChange: () => {}
	}

	componentDidMount() {
		this.setAnchorsBounds();
		this.setIndicatorPositionByIndex(this.currentIndex);
		this.toggleIndicator();

		window.addEventListener('resize', this.debouncedResize, false);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.debouncedResize, false);
	}

	handleResize() {
		this.setAnchorsBounds();
		this.setIndicatorPositionByIndex(this.currentIndex);
	}

	toggleIndicator(showIndicator = true) {
		this.setState({
			showIndicator
		});
	}

	setAnchorsBounds() {
		const anchors = this.listContainer.current.querySelectorAll('a');
		this.bounds = Array.from(anchors)
			.map(item => item.getBoundingClientRect())
			.map(({x, width}) => ({
				width,
				x: this.fixAnchorLeftPosition(x)
			}));
	}

	setIndicatorPositionByIndex(index) {
		const { x, width } = this.bounds[index];

		this.setState({
			indicatorLeft: x,	
			indicatorWidth: width
		});
	}

	fixAnchorLeftPosition(left) {
		const container = this.listContainer.current;
		return left - container.getBoundingClientRect().x;
	}

	changeIndicator(index) {
		this.setIndicatorPositionByIndex(index);
		this.currentIndex = index;
	}

	handleClick(index) {
		if (this.currentIndex !== index) {
			this.changeIndicator(index);
			this.props.handleChange(this.props.links[index], index);
		}
	}

	render() {
		const { indicatorLeft, indicatorWidth, showIndicator } = this.state;

		const indicatorStyle = {
			transform: `translateX(${indicatorLeft}px)`,
			width: `${indicatorWidth}px`
		};

		return (
			<nav className="menu">
				<img src={logo} className="menuLogo" alt="logo" />
				<ul className="menuContainer" ref={this.listContainer}>
					{this.props.links.map(({ label, link }, index) => (
						<li key={index}>
							<a onClick={this.handleClick.bind(this, index)} href={link}>
								{label}
							</a>
						</li>
					))}
					{showIndicator && (
						<span
							className="menuIndicator"
							style={indicatorStyle}
						/>
					)}
				</ul>
			</nav>
		);
	}
}

export default Menu;
