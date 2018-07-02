import theModule from '../dist'

describe('Default module', () => {
	it('Should have content', () => {
		const testVar = theModule()
		expect(testVar).toBeDefined()
	})
})