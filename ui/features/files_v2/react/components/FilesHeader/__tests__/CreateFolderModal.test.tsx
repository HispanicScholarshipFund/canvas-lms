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

import React from 'react'
import CreateFolderModal from '../CreateFolderModal'
import {render, screen} from '@testing-library/react'
import {MockedQueryClientProvider} from '@canvas/test-utils/query'
import {queryClient} from '@canvas/query'
import fetchMock from 'fetch-mock'
import userEvent from '@testing-library/user-event'
import {FileManagementContext} from '../../Contexts'

const defaultProps = {
  isOpen: true,
  onRequestClose: jest.fn(),
}

const renderComponent = (props = {}) => {
  return render(
    <FileManagementContext.Provider value={{folderId: '1', contextType: 'course', contextId: '1'}}>
      <MockedQueryClientProvider client={queryClient}>
        <CreateFolderModal {...defaultProps} {...props} />
      </MockedQueryClientProvider>
    </FileManagementContext.Provider>,
  )
}
describe('CreateFolderModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetchMock.post(/.*\/folders/, 200)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('closes when Cancel is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()
    const cancelButton = screen.getByRole('button', {name: /cancel/i})
    await user.click(cancelButton)
    expect(defaultProps.onRequestClose).toHaveBeenCalled()
  })

  it('closes when Close Button is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()
    const closeButton = screen.getByRole('button', {name: /close/i})
    await user.click(closeButton)
    expect(defaultProps.onRequestClose).toHaveBeenCalled()
  })

  it('submits when Create Folder button is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()
    const createFolderButton = screen.getByRole('button', {name: /Create Folder/i})
    await user.click(createFolderButton)
    expect(fetchMock.lastCall()?.[1]?.body).toEqual('{"name":""}')
  })
})
