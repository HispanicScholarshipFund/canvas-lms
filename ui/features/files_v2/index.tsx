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
import filesEnv from '@canvas/files_v2/react/modules/filesEnv'
import FilesApp from './react/components/FilesApp'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {QueryProvider} from '@canvas/query'
import {createRoot} from 'react-dom/client'
import {generateFolderByPathUrl} from './utils/apiUtils'
import AllMyFilesTable from './react/components/AllMyFilesTable'

const contextAssetString = window.ENV.context_asset_string
const showingAllContexts = filesEnv.showingAllContexts

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: showingAllContexts ? (
        <AllMyFilesTable />
      ) : (
        <FilesApp contextAssetString={contextAssetString} />
      ),
      loader: async () => {
        if (showingAllContexts) return null

        const url = generateFolderByPathUrl('')
        return fetch(url)
      },
    },
    {
      path: '/folder/*',
      element: <FilesApp contextAssetString={contextAssetString} />,
      loader: async ({params}) => {
        const url = generateFolderByPathUrl(`/${params['*']}`)
        return fetch(url)
      },
    },
  ],
  {
    basename: filesEnv.baseUrl,
  },
)

const root = createRoot(document.getElementById('content')!)

root.render(
  <QueryProvider>
    <RouterProvider router={router} />
  </QueryProvider>,
)
