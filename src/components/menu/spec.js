import React from 'react';
import { mount } from 'enzyme';

import Menu from './';

const defaultProps = {
	links: [
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
	]
};

const containerListBound = {
	bottom: 153,
	height: 153,
	left: 0,
	right: 492,
	top: 0,
	width: 492,
	x: 0,
	y: 0
};

const anchorsBounds = [
	{
		bottom: 153,
		height: 53,
		left: 99.03125,
		right: 167.03125,
		top: 100,
		width: 68,
		x: 99.03125,
		y: 100
	},
	{
		bottom: 153,
		height: 53,
		left: 167.03125,
		right: 242.15625,
		top: 100,
		width: 75.125,
		x: 167.03125,
		y: 100
	},
	{
		bottom: 153,
		height: 53,
		left: 242.15625,
		right: 338.296875,
		top: 100,
		width: 96.140625,
		x: 242.15625,
		y: 100
	},
	{
		bottom: 153,
		height: 53,
		left: 338.296875,
		right: 392.96875,
		top: 100,
		width: 54.671875,
		x: 338.296875,
		y: 100
	}
];

const indicatorsPositions = [
	{ indicatorLeft: 99.03125, indicatorRight: 324.96875 },
	{ indicatorLeft: 167.03125, indicatorRight: 249.84375 },
	{ indicatorLeft: 242.15625, indicatorRight: 153.703125 },
	{ indicatorLeft: 338.296875, indicatorRight: 99.03125 }
];

const getWrapper = (props = defaultProps) => mount(<Menu {...props} />);

describe('<Menu/>', () => {
	describe('#componentDidMount', () => {
		it('should call #init', () => {
			const spy = jest.spyOn(Menu.prototype, 'init');
			getWrapper();
			expect(spy).toHaveBeenCalled();
		});

		it('should call #toggleIndicator', () => {
			const spy = jest.spyOn(Menu.prototype, 'toggleIndicator');
			getWrapper();
			expect(spy).toHaveBeenCalled();
		});

		it('should call #addEventListener', () => {
			const spy = jest.spyOn(global, 'addEventListener');
			const instace = getWrapper().instance();
			expect(spy).toHaveBeenCalledWith('resize', instace.debouncedResize, false);
		});
	});

	describe('#componentWillUnmount', () => {
		it('should call #removeEventListener', () => {
			const spy = jest.spyOn(global, 'removeEventListener');
			const wrapper = getWrapper();
			const instance = wrapper.instance();
			wrapper.unmount();
			expect(spy).toHaveBeenCalledWith('resize', instance.debouncedResize, false);
		});
	});

	describe('#init', () => {
		it('should call #getDimensions', () => {
			const spy = jest.spyOn(Menu.prototype, 'getDimensions');
			getWrapper();
			expect(spy).toHaveBeenCalled();
		});

		it('should call #setIndicatorPositionByIndex', () => {
			const spy = jest.spyOn(Menu.prototype, 'setIndicatorPositionByIndex');
			const instance = getWrapper().instance();
			expect(spy).toHaveBeenCalledWith(instance.currentIndex);
		});
	});

	describe('#getDimensions', () => {
		it('should get bounds from list container and set this value in `containerBound` property', () => {
			jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementationOnce(() => containerListBound);
			const instance = getWrapper().instance();
			instance.getDimensions();
			expect(instance.containerBound).toBe(instance.containerBound);
		});

		it('should set value returned from #getIndicatorsPositions in `indicatorPositions` property', () => {
			const spy = jest.spyOn(Menu.prototype, 'getIndicatorsPositions').mockImplementationOnce(() => indicatorsPositions);
			const instance = getWrapper().instance();
			expect(instance.indicatorsPositions).toEqual(indicatorsPositions);
			spy.mockRestore();
		});
	});

	describe('#getIndicatorsPositions', () => {
		it('should return an array of indicators positions', () => {
			const spy = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementationOnce(() => containerListBound);
			const instance = getWrapper().instance();

			spy
				.mockImplementationOnce(() => anchorsBounds[0])
				.mockImplementationOnce(() => anchorsBounds[1])
				.mockImplementationOnce(() => anchorsBounds[2])
				.mockImplementationOnce(() => anchorsBounds[3]);

			expect(instance.getIndicatorsPositions()).toEqual(indicatorsPositions);
		});
	});

	describe('#toggleIndicator', () => {
		it('should change `showIndicator` state by param', () => {
			const wrapper = getWrapper();
			wrapper.instance().toggleIndicator(false);
			expect(wrapper.state().showIndicator).toBe(false);
		});

		it('should change `showIndicator` state to true when not pass parameter', () => {
			const wrapper = getWrapper();
			wrapper.setState({
				showIndicator: false
			});
			wrapper.instance().toggleIndicator();
			expect(wrapper.state().showIndicator).toBe(true);
		});
	});

	describe('#setIndicatorPositionByIndex', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			jest.spyOn(Element.prototype, 'getBoundingClientRect')
				.mockImplementationOnce(() => containerListBound)
				.mockImplementationOnce(() => anchorsBounds[0])
				.mockImplementationOnce(() => anchorsBounds[1])
				.mockImplementationOnce(() => anchorsBounds[2])
				.mockImplementationOnce(() => anchorsBounds[3]);
		});

		it('should change `indicatorLeft` and `indicatorRight` state by index', () => {
			const index = 1;
			const wrapper = getWrapper();
			const instance = wrapper.instance();

			instance.setIndicatorPositionByIndex(index);

			expect(wrapper.state().indicatorLeft).toBe(indicatorsPositions[index].indicatorLeft);
			expect(wrapper.state().indicatorRight).toBe(indicatorsPositions[index].indicatorRight);
		});
	});

	describe('#fixAnchorLeftPosition', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			jest.spyOn(Element.prototype, 'getBoundingClientRect')
				.mockImplementationOnce(() => containerListBound)
				.mockImplementationOnce(() => anchorsBounds[0])
				.mockImplementationOnce(() => anchorsBounds[1])
				.mockImplementationOnce(() => anchorsBounds[2])
				.mockImplementationOnce(() => anchorsBounds[3]);
		});

		it('should fix `left` parameter number by container list x axis', () => {
			const instance = getWrapper().instance();
			expect(instance.fixAnchorLeftPosition(anchorsBounds[0].left)).toBe(indicatorsPositions[0].indicatorLeft);
		});
	});

	describe('#changeAnimationDirection', () => {
		it('`isLeftToRight` state should be true when index passed by parameter is greater than `currentIndex` state', async () => {
			const wrapper = getWrapper();
			await wrapper.instance().changeAnimationDirection(1);
			wrapper.state('isLeftToRight');
			expect(wrapper.state('isLeftToRight')).toBe(true);
		});

		it('`isLeftToRight` state should be false when index passed by parameter is less than `currentIndex` state', async () => {
			const wrapper = getWrapper();
			await wrapper.instance().changeAnimationDirection(-1);
			wrapper.state('isLeftToRight');
			expect(wrapper.state('isLeftToRight')).toBe(false);
		});
	});
});
