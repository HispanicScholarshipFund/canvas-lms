/*
 * Copyright (C) 2024 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {fireEvent, render, act} from '@testing-library/react'
import React from 'react'
import GroupEditForm from '../GroupEditForm'
import {focusChange} from './helpers'
import injectGlobalAlertContainers from '@canvas/util/react/testing/injectGlobalAlertContainers'

injectGlobalAlertContainers()

describe('GroupEditForm - Submit', () => {
  let onCloseHandler, onSubmit

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const defaultProps = (props = {}) => ({
    isOpen: true,
    onSubmit,
    onCloseHandler,
    ...props,
  })

  beforeEach(() => {
    onCloseHandler = jest.fn()
    onSubmit = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls onSubmit when submission', async () => {
    const initialValues = {
      title: 'The Group Name',
      description: 'The Group Description',
    }
    const {getByLabelText, getByText} = render(<GroupEditForm {...defaultProps({initialValues})} />)
    await act(async () => jest.runAllTimers())
    
    focusChange(getByLabelText('Group Name'), 'New group name')
    await act(async () => jest.runAllTimers())
    
    fireEvent.click(getByText('Save'))
    await act(async () => jest.runAllTimers())

    expect(onSubmit).toHaveBeenCalledWith(
      {
        title: 'New group name',
        description: 'The Group Description',
      },
      expect.anything(),
      expect.anything()
    )
  })

  it('disables submission if form is invalid', async () => {
    const {getByLabelText, getByText} = render(<GroupEditForm {...defaultProps()} />)
    await act(async () => jest.runAllTimers())

    focusChange(getByLabelText('Group Name'), 'a'.repeat(256))
    await act(async () => jest.runAllTimers())

    expect(getByText('Save').closest('button')).toBeDisabled()
  })

  it('only enable submission if form is edited', async () => {
    const initialValues = {
      title: 'The Group Name',
      description: 'The Group Description',
    }
    const {getByLabelText, getByText} = render(<GroupEditForm {...defaultProps({initialValues})} />)
    await act(async () => jest.runAllTimers())

    expect(getByText('Save').closest('button')).toBeDisabled()

    focusChange(getByLabelText('Group Name'), 'New Group Name')
    await act(async () => jest.runAllTimers())

    expect(getByText('Save').closest('button')).toBeEnabled()

    focusChange(getByLabelText('Group Name'), initialValues.title)
    await act(async () => jest.runAllTimers())

    expect(getByText('Save').closest('button')).toBeDisabled()
  })

  it('enables submission if form is valid', async () => {
    const {getByLabelText, getByText} = render(<GroupEditForm {...defaultProps()} />)
    await act(async () => jest.runAllTimers())

    focusChange(getByLabelText('Group Name'), 'Group Name value')
    await act(async () => jest.runAllTimers())

    expect(getByText('Save').closest('button')).toBeEnabled()
  })
})
