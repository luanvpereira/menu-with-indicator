import React from 'react';
import { shallow } from 'enzyme';

import Menu from './';

const defaultProps = {
	links: []
};

const getWrapper = (props = defaultProps) => shallow(<Menu {...props} />);

const mockMethod = (...mocks) =>
	mocks.map(currentMock =>
		jest.spyOn(Menu.prototype, currentMock).mockImplementation(() => {})
	);

const restoreMocks = mocks => {
	mocks.forEach(mock => mock.mockRestore());
};

describe('<Menu/>', () => {
	let componentDidMount;

	beforeEach(() => {
		componentDidMount = jest
			.spyOn(Menu.prototype, 'componentDidMount')
			.mockImplementation(() => ({}));
	});

	describe('#componentDidMount', () => {
		it('should call `setAnchorsBounds`, `setIndicatorPositionByIndex` and `showIndicator`', () => {
			componentDidMount.mockRestore();

			const spies = mockMethod(
				'setAnchorsBounds',
				'setIndicatorPositionByIndex',
				'showIndicator'
			);

			getWrapper();

			spies.forEach(spy => {
				expect(spy).toHaveBeenCalled();
			});

			restoreMocks(spies);
		});
	});

	describe('#componentDidUpdate', () => {
		it('should call `setAnchorsBounds` and `setIndicatorPositionByIndex` when `links` props changed', () => {
			const spies = mockMethod(
				'setAnchorsBounds',
				'setIndicatorPositionByIndex'
			);

			const wrapper = getWrapper();

			wrapper.instance().componentDidUpdate({
				links: [{ label: 'Home', link: '/home' }]
			});

			spies.forEach(spy => {
				expect(spy).toHaveBeenCalled();
			});

			restoreMocks(spies);
		});
	});

	describe('#onResize', () => {
		it('should call `setAnchorsBounds` and `setIndicatorPositionByIndex`', () => {
			const spies = mockMethod(
				'setAnchorsBounds',
				'setIndicatorPositionByIndex'
			);

			const wrapper = getWrapper();
			wrapper.instance().onResize();

			spies.forEach(spy => {
				expect(spy).toHaveBeenCalled();
			});

			restoreMocks(spies);
		});
	});
});
