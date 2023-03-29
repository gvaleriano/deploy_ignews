import { render, screen } from '@testing-library/react'

import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
  it('renders correctly when user is not authentication', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    //const { debug } = render(<SignInButton />) // Test with Debug
    render(<SignInButton />) // Test less Debug
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('renders correctly when user is authentication', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([
      { user: { name: 'John Dow', email: 'john.doe@example.com' }, expires: 'fake-expires' },
      false
    ])

    render(<SignInButton />)
    expect(screen.getByText('John Dow')).toBeInTheDocument()
  })

})
