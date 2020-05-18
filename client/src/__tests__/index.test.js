import React from 'react'
import { shallow } from 'enzyme'
import App from '../App'

import Header from '../components/Header'

describe('Renders <App />', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<App />)
        expect(wrapper.contains(<Header />)).toEqual(true)
    })
})
