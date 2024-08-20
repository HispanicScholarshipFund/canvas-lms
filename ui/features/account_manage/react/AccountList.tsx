/*
 * Copyright (C) 2023 - present Instructure, Inc.
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

import React, {useState} from 'react'
// @ts-expect-error
import errorShipUrl from '@canvas/images/ErrorShip.svg'
import {Spinner} from '@instructure/ui-spinner'
import {AccountNavigation} from './AccountNavigation'
import {useScope as useI18nScope} from '@canvas/i18n'
import {View} from '@instructure/ui-view'
import getAccounts from '@canvas/api/accounts/getAccounts'
import {useQuery} from '@canvas/query'
import {IconCoursesLine, IconSettingsLine} from '@instructure/ui-icons'
import GenericErrorPage from '@canvas/generic-error-page/react'
import {Table} from '@instructure/ui-table'
import {IconButton} from '@instructure/ui-buttons'
import {Tooltip} from '@instructure/ui-tooltip'

const I18n = useI18nScope('account_manage')

const ErrorPage = ({error}: {error?: unknown}) => {
  return (
    <GenericErrorPage
      imageUrl={errorShipUrl}
      errorSubject={I18n.t('Accounts initial query error')}
      errorCategory={I18n.t('Accounts Error Page')}
      errorMessage={error instanceof Error ? error?.message : ''}
    />
  )
}

export function AccountList() {
  const [pageIndex, setPageIndex] = useState(1)

  const {data, error, isLoading, isError} = useQuery({
    queryKey: ['accounts', {pageIndex}],
    queryFn: getAccounts,
    fetchAtLeastOnce: true,
  })

  const last = parseInt(String(data?.link?.last?.page || ''), 10)

  if (isError) {
    return <ErrorPage error={error} />
  }

  if (isLoading) {
    return (
      <View>
        <Spinner
          renderTitle={I18n.t('Loading')}
          size="small"
          delay={500}
          margin="large auto 0 auto"
        />
      </View>
    )
  }

  const accounts = data?.json

  return (
    <View>
      <Table caption={I18n.t('Accounts')}>
        <Table.Head>
          <Table.Row>
            <Table.ColHeader id="name-header" width="65%">
              {I18n.t('Name')}
            </Table.ColHeader>
            <Table.ColHeader id="sub_account_count-header" width="15%">
              {I18n.t('Subaccounts')}
            </Table.ColHeader>
            <Table.ColHeader id="course_count-header" width="15%">
              {I18n.t('Courses')}
            </Table.ColHeader>
            <Table.ColHeader id="settings-header" width="5%">
              {I18n.t('Settings')}
            </Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {accounts?.map(account => {
            const settingsTip = I18n.t('Settings for %{name}', {name: account.name})
            const courseTemplateTip = I18n.t('Course template for %{name}', {name: account.name})

            return (
              <Table.Row key={account.id}>
                <Table.Cell>
                  <a href={`/accounts/${account.id}`}>{account.name}</a>
                </Table.Cell>
                <Table.Cell>
                  <a href={`/accounts/${account.id}/sub_accounts`}>{account.sub_account_count}</a>
                </Table.Cell>
                <Table.Cell>{account.course_count}</Table.Cell>
                <Table.Cell textAlign="end">
                  {account.course_template_id && (
                    <Tooltip placement="start center" offsetX={5} renderTip={courseTemplateTip}>
                      <IconButton
                        withBorder={false}
                        withBackground={false}
                        size="small"
                        href={`/courses/${account.course_template_id}`}
                        screenReaderLabel={courseTemplateTip}
                      >
                        <IconCoursesLine title={courseTemplateTip} />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip placement="start center" offsetX={5} renderTip={settingsTip}>
                    <IconButton
                      withBorder={false}
                      withBackground={false}
                      size="small"
                      href={`/accounts/${account.id}/settings#tab-settings`}
                      screenReaderLabel={settingsTip}
                    >
                      <IconSettingsLine title={settingsTip} />
                    </IconButton>
                  </Tooltip>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      {last > 1 && (
        <AccountNavigation currentPage={pageIndex} onPageClick={setPageIndex} pageCount={last} />
      )}
    </View>
  )
}
