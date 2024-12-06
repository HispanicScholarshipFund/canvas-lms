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
import {View} from '@instructure/ui-view'
import {Flex} from '@instructure/ui-flex'
import type {BlockTemplate} from '../../types'
import {Button} from '@instructure/ui-buttons'
import {useScope as useI18nScope} from '@canvas/i18n'

const I18n = useI18nScope('block-editor')

export default function TemplateCardSkeleton({
  template,
  createAction,
  quickLookAction,
  inLayout,
}: {
  template: BlockTemplate
  createAction: () => void
  quickLookAction?: () => void
  inLayout: 'grid' | 'rows'
}) {
  return (
    <View
      data-testid="template-card-skeleton"
      as="div"
      className={`block-template-preview-card ${inLayout} ${
        template.id === 'blank_page' ? 'blank-card' : ''
      }`}
      display="flex"
      position="relative"
      shadow="above"
      tabIndex={0}
      style={{backgroundImage: template?.thumbnail && `url(${template.thumbnail})`}}
      aria-label={I18n.t('%{name} template', {name: template.name})}
      aria-describedby={template.description ? `${template.id}-description` : undefined}
    >
      {template.id === 'blank_page' && <div className="curl" />}
      <Flex alignItems="center" height="100%" justifyItems="center" width="100%">
        {template.id !== 'blank_page' ? (
          <div className="buttons">
            <Button color="secondary" margin="0 x-small 0 0" size="small" onClick={quickLookAction}>
              {I18n.t('Quick Look')}
            </Button>
            <Button color="primary" size="small" onClick={createAction}>
              {I18n.t('Customize')}
            </Button>
          </div>
        ) : (
          <Button color="primary" size="small" onClick={createAction}>
            {I18n.t('New Blank Page')}
          </Button>
        )}
      </Flex>
      {template.description && (
        <div id={`${template.id}-description`} style={{position: 'absolute', left: '-9999px'}}>
          {template.description}
        </div>
      )}
    </View>
  )
}
