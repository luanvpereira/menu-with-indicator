import React from 'react';
import PropTypes from 'prop-types';

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

		this.handleClick = this.handleClick.bind(this);
		this.onResize = this.onResize.bind(this);
		this.listContainer = React.createRef();

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
		handleClick: PropTypes.func
	};

	componentDidMount() {
		this.setAnchorsBounds();
		this.setIndicatorPositionByIndex(this.currentIndex);
		this.showIndicator();

		window.addEventListener('resize', this.onResize, false);
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(prevProps.links) !== JSON.stringify(this.props.links)
		) {
			this.setAnchorsBounds();
			this.setIndicatorPositionByIndex(0);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize, false);
	}

	onResize() {
		this.setAnchorsBounds();
		this.setIndicatorPositionByIndex(this.currentIndex);
	}

	getAnchorsByListContainer() {
		return this.listContainer.current.querySelectorAll('a');
	}

	showIndicator() {
		this.setState({
			showIndicator: true
		});
	}

	setAnchorsBounds() {
		const anchors = this.getAnchorsByListContainer();
		this.bounds = Array.from(anchors)
			.map(item => item.getBoundingClientRect())
			.map(({ x, width }) => ({
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
		return e => {
			e.preventDefault();

			if (this.currentIndex !== index) {
				this.changeIndicator(index);

				if (this.props.handleClick) {
					this.props.handleClick(index, e);
				}
			}
		};
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
							<a onClick={this.handleClick(index)} href={link}>
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
