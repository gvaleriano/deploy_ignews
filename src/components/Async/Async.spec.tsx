import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async />)


  //Método Tests : findBy, waitFor, waitForElementToBeRemoved

  expect(screen.getByText('Hello World')).toBeInTheDocument()


  //findByText
  //expect(await screen.findByText('Button')).toBeInTheDocument()

  //waitFor
  //await waitFor(() => {
  //  return expect(expect(screen.getByText('Button')).toBeInTheDocument()
  //  )
  //})

  //waitForElementToBeRemoved
  await waitForElementToBeRemoved(screen.queryByText('Button'))

});