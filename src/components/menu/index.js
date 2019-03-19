import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import classNames from 'classnames';

import './style.css';
import logo from './logo.svg';

class Menu extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			indicatorLeft: 0,
			indicatorRight: 0,
			showIndicator: false,
			isLeftToRight: true
		};

		this.listContainer = React.createRef();

		this.handleClick = this.handleClick.bind(this);
		this.init = this.init.bind(this);
		this.debouncedResize = debounce(this.init, 50);

		this.indicatorPositions = [];
		this.containerBound = {};
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
		this.init();
		this.toggleIndicator();

		window.addEventListener('resize', this.debouncedResize, false);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.debouncedResize, false);
	}

	init() {
		this.getDimensions();
		this.setIndicatorPositionByIndex(this.currentIndex);
	}

	getDimensions() {
		this.containerBound = this.listContainer.current.getBoundingClientRect();
		this.indicatorPositions = this.getIndicatorPositions();
	}

	getIndicatorPositions() {
		const anchors = this.listContainer.current.querySelectorAll('a');
	
		return Array.from(anchors)
			.map(item => item.getBoundingClientRect())
			.map(({ width, left }) => {
				const indicatorLeft = this.fixAnchorLeftPosition(left);
				const indicatorRight = this.fixAnchorLeftPosition(this.containerBound.right) - indicatorLeft - width;
		
				return {
					indicatorLeft,
					indicatorRight
				}
			})
	}

	toggleIndicator(showIndicator = true) {
		this.setState({
			showIndicator
		});
	}

	setIndicatorPositionByIndex(index) {
		const { indicatorLeft, indicatorRight } = this.indicatorPositions[index];

		this.setState({
			indicatorLeft,
			indicatorRight
		});
	}

	fixAnchorLeftPosition(left) {
		const container = this.listContainer.current;
		return left - container.getBoundingClientRect().x;
	}

	changeAnimationDirection(index, callback) {
		return new Promise(resolve => {
			this.setState({
				isLeftToRight: index > this.currentIndex
			}, resolve);
		})
	}

	async changeIndicator(index) {
		await this.changeAnimationDirection(index);
		this.setIndicatorPositionByIndex(index);
		this.currentIndex = index;
	}

	handleClick(index, e) {
		if (this.currentIndex !== index) {
			this.changeIndicator(index);
			this.props.handleChange(this.props.links[index], index, e);
		}
	}

	render() {
		const {
			indicatorLeft,
			indicatorRight,
			isLeftToRight,
			showIndicator
		} = this.state;

		const indicatorStyle = {
			left: `${indicatorLeft}px`,
			right: `${indicatorRight}px`,
		};

		const menuIndicator = classNames('menuIndicator', {
			'menuIndicatorAnimLeftToRight': isLeftToRight,
			'menuIndicatorAnimRightToLeft': !isLeftToRight
		});

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
							className={menuIndicator}
							style={indicatorStyle}
						/>
					)}
				</ul>
			</nav>
		);
	}
}

export default Menu;
