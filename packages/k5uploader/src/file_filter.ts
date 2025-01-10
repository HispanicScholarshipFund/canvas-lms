/*
 * Copyright (C) 2019 - present Instructure, Inc.
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

interface FileFilterParams {
  extensions: string
  id: string
  description: string
  entryType: string
  mediaType: string
  type: string
}

class FileFilter {
  extensions: string[]
  id: string
  description: string
  entryType: string
  mediaType: string
  type: string

  constructor(params: FileFilterParams) {
    this.extensions = this.parseExtensions(params.extensions)
    this.id = params.id
    this.description = params.description
    this.entryType = params.entryType
    this.mediaType = params.mediaType
    this.type = params.type
  }

  private parseExtensions(extString: string): string[] {
    return extString.split(';').map(ext => ext.substring(2))
  }

  includesExtension(extension: string): boolean {
    return this.extensions.indexOf(extension.toLowerCase()) !== -1
  }

  toParams(): {[key: string]: string} {
    const params = {
      entry1_type: this.entryType,
      entry1_mediaType: this.mediaType,
    }

    return params
  }
}

export default FileFilter
