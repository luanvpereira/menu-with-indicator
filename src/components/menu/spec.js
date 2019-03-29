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
	left: 0,
	right: 492,
	width: 492
};

const anchorsBounds = [
	{
		left: 99.03125,
		width: 68
	},
	{
		left: 167.03125,
		width: 75.125
	},
	{
		left: 242.15625,
		width: 96.140625
	},
	{
		left: 338.296875,
		width: 54.671875
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
			expect(spy).toHaveBeenCalledWith(
				'resize',
				instace.debouncedResize,
				false
			);
		});
	});

	describe('#componentWillUnmount', () => {
		it('should call #removeEventListener', () => {
			const spy = jest.spyOn(global, 'removeEventListener');
			const wrapper = getWrapper();
			const instance = wrapper.instance();
			wrapper.unmount();
			expect(spy).toHaveBeenCalledWith(
				'resize',
				instance.debouncedResize,
				false
			);
		});
	});

	describe('#init', () => {
		it('should call #getDimensions', () => {
			const spy = jest.spyOn(Menu.prototype, 'getDimensions');
			getWrapper();
			expect(spy).toHaveBeenCalled();
		});

		it('should call #setIndicatorPositionByIndex', () => {
			const spy = jest.spyOn(
				Menu.prototype,
				'setIndicatorPositionByIndex'
			);
			const instance = getWrapper().instance();
			expect(spy).toHaveBeenCalledWith(instance.currentIndex);
		});
	});

	describe('#getDimensions', () => {
		it('should get bounds from list container and set this value in `containerBound` property', () => {
			jest.spyOn(
				Element.prototype,
				'getBoundingClientRect'
			).mockImplementationOnce(() => containerListBound);
			const instance = getWrapper().instance();
			instance.getDimensions();
			expect(instance.containerBound).toBe(instance.containerBound);
		});

		it('should set value returned from #getIndicatorsPositions in `indicatorPositions` property', () => {
			const spy = jest
				.spyOn(Menu.prototype, 'getIndicatorsPositions')
				.mockImplementationOnce(() => indicatorsPositions);
			const instance = getWrapper().instance();
			expect(instance.indicatorsPositions).toEqual(indicatorsPositions);
			spy.mockRestore();
		});
	});

	describe('#getIndicatorsPositions', () => {
		it('should return an array of indicators positions', () => {
			const spy = jest
				.spyOn(Element.prototype, 'getBoundingClientRect')
				.mockImplementationOnce(() => containerListBound);
			const instance = getWrapper().instance();

			spy.mockImplementationOnce(() => anchorsBounds[0])
				.mockImplementationOnce(() => anchorsBounds[1])
				.mockImplementationOnce(() => anchorsBounds[2])
				.mockImplementationOnce(() => anchorsBounds[3]);

			expect(instance.getIndicatorsPositions()).toEqual(
				indicatorsPositions
			);
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

			expect(wrapper.state().indicatorLeft).toBe(
				indicatorsPositions[index].indicatorLeft
			);
			expect(wrapper.state().indicatorRight).toBe(
				indicatorsPositions[index].indicatorRight
			);
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
			expect(instance.fixAnchorLeftPosition(anchorsBounds[0].left)).toBe(
				indicatorsPositions[0].indicatorLeft
			);
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

	describe('#changeIndicator', () => {
		it('should call #changeAnimationDirection and #setIndicatorPositionByIndex, and change currentIndex property', async () => {
			const index = 2;
			const changeAnimationDirection = jest
				.spyOn(Menu.prototype, 'changeAnimationDirection')
				.mockImplementation(() => Promise.resolve(true));

			const setIndicatorPositionByIndex = jest
				.spyOn(Menu.prototype, 'setIndicatorPositionByIndex')
				.mockImplementation(() => Promise.resolve(true));

			const instance = getWrapper().instance();
			await instance.changeIndicator(index);

			expect(changeAnimationDirection).toHaveBeenCalledWith(index);
			expect(setIndicatorPositionByIndex).toHaveBeenCalledWith(index);
			expect(instance.currentIndex).toBe(index);
		});
	});

	describe('#handleClick', () => {
		it('should call #changeIndicator and `handleChange` prop', () => {
			const changeIndicator = jest
				.spyOn(Menu.prototype, 'changeIndicator')
				.mockImplementation(() => {});

			const newIndex = 1;
			const event = {};
			const handleChange = jest.spyOn(Menu.defaultProps, 'handleChange');

			const wrapper = getWrapper();

			wrapper.instance().handleClick(newIndex, event);

			expect(changeIndicator).toHaveBeenCalledWith(newIndex);
			expect(handleChange).toHaveBeenCalledWith(
				wrapper.props().links[newIndex],
				newIndex,
				event
			);
		});
	});
});
