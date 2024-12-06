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
import {Spinner} from '@instructure/ui-spinner'
import {Text} from '@instructure/ui-text'
import type {ChangeEvent} from 'react'
import {Table} from '@instructure/ui-table'
import {useScope as useI18nScope} from '@canvas/i18n'
import {RadioInput} from '@instructure/ui-radio-input'
import {ScreenReaderContent} from '@instructure/ui-a11y-content'
import {Flex} from '@instructure/ui-flex'
import React, {useState, useEffect} from 'react'
import type {User, DuplicateUser} from './types'
import {Alert} from '@instructure/ui-alerts'
import doFetchApi from '@canvas/do-fetch-api-effect'
import {TempEnrollAvatar} from './TempEnrollAvatar'

const I18n = useI18nScope('temporary_enrollment')

interface Props {
  foundUsers: User[]
  duplicateUsers: Record<string, DuplicateUser[]>
  searchFailure: Function
  readySubmit: Function
  canReadSIS: boolean
}

export function TempEnrollSearchConfirmation(props: Props) {
  const [userDetails, setUserDetails] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  // @ts-expect-error
  const [selectedDupes, setSelectedDupes] = useState<Record<string, DuplicateUser | null>>([])

  useEffect(() => {
    const processFoundUsers = async (users: User[]) => {
      if (users[0].id == null) {
        setLoading(true)
        const promises: Promise<User>[] = []
        users.forEach(user => {
          if (user.id == null) {
            // @ts-expect-error
            promises.push(fetchUserDetails(user))
          } else {
            // @ts-expect-error
            promises.push(user)
          }
        })
        Promise.all(promises)
          .then(value => {
            setUserDetails(value)
            if (duplicateCount === 0 && value.length > 0) {
              props.readySubmit(value)
            }
          })
          .catch(() => {
            props.searchFailure()
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setUserDetails(users)
      }
    }
    const duplicateCount = Object.keys(props.duplicateUsers).length

    const templateSelectedUsers = () => {
      const emptyMap: Record<string, DuplicateUser | null> = {}

      for (const duplicatePair in props.duplicateUsers) {
        emptyMap[duplicatePair] = null
      }
      setSelectedDupes(emptyMap)
    }

    if (props.foundUsers.length > 0) {
      processFoundUsers(props.foundUsers)
    }

    if (duplicateCount > 0) {
      templateSelectedUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.duplicateUsers, props.foundUsers])

  // user_lists.json does not always return email, sis id, and login
  const fetchUserDetails = async (user: User) => {
    const userId = user.user_id || user.id
    const {json} = await doFetchApi({
      path: `/api/v1/users/${userId}/profile`,
      method: 'GET',
    })
    return json
  }

  const handleDuplicateUserSelection = (event: ChangeEvent<HTMLElement>, key: string) => {
    const target = event.target as HTMLTextAreaElement
    const copyDupes = {...selectedDupes}
    props.duplicateUsers[key].forEach(function (dupeUser: DuplicateUser) {
      if (dupeUser.user_id.toString() === target.value) {
        copyDupes[key] = dupeUser
        setSelectedDupes(copyDupes)
      }
    })
    const values = Object.values(copyDupes)
    if (values.every(dupe => dupe !== null)) {
      const dupes: User[] = values.map(dupe => {
        return {id: dupe.user_id, name: dupe.user_name, ...dupe}
      })
      const allEnrollments = dupes.concat(userDetails)
      props.readySubmit(allEnrollments)
    }
  }

  const renderDupeRow = (key: string, dupeUser: DuplicateUser) => {
    const k = `dupeuser_${dupeUser.user_id}`
    let checked = false
    if (selectedDupes[key] != null) {
      checked = selectedDupes[key].user_id === dupeUser.user_id
    }
    return (
      <Table.Row key={k}>
        <Table.RowHeader>
          <RadioInput
            value={dupeUser.user_id}
            name={dupeUser.user_name}
            onChange={event => handleDuplicateUserSelection(event, key)}
            checked={checked}
            label={
              <ScreenReaderContent>
                {I18n.t('Click to select user %{name}', {name: dupeUser.user_name})}
              </ScreenReaderContent>
            }
          />
        </Table.RowHeader>
        <Table.Cell>{dupeUser.user_name}</Table.Cell>
        <Table.Cell>{dupeUser.email}</Table.Cell>
        <Table.Cell>{dupeUser.login_id}</Table.Cell>
        {props.canReadSIS ? <Table.Cell>{dupeUser.sis_user_id || ''}</Table.Cell> : null}
        <Table.Cell>{dupeUser.account_name || ''}</Table.Cell>
      </Table.Row>
    )
  }

  const renderDupeTables = (key: string, dupePair: DuplicateUser[]) => {
    return (
      <Flex.Item key={`dupepair_${key}`}>
        <Text>{I18n.t('Possible matches for "%{key}". Select the desired one below.', {key})}</Text>
        <Table
          caption={
            <Text>
              {I18n.t('Possible matches for "%{key}". Select the desired one below.', {key})}
            </Text>
          }
          margin="small 0 medium 0"
        >
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="dupesection-select">
                <ScreenReaderContent>{I18n.t('User Selection')}</ScreenReaderContent>
              </Table.ColHeader>
              <Table.ColHeader id="dupesection-name">{I18n.t('Name')}</Table.ColHeader>
              <Table.ColHeader id="dupesection-email">{I18n.t('Email Address')}</Table.ColHeader>
              <Table.ColHeader id="dupesection-loginid">{I18n.t('Login ID')}</Table.ColHeader>
              {props.canReadSIS ? (
                <Table.ColHeader id="dupesection-sisid">{I18n.t('SIS ID')}</Table.ColHeader>
              ) : null}
              <Table.ColHeader id="dupesection-inst">{I18n.t('Institution')}</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {dupePair.map((dupeUser: DuplicateUser) => {
              return renderDupeRow(key, dupeUser)
            })}
          </Table.Body>
        </Table>
      </Flex.Item>
    )
  }

  const renderFoundRows = () => {
    return userDetails.map(user => {
      const key = `found_${user.id}`
      return (
        <Table.Row key={key}>
          <Table.RowHeader>
            <TempEnrollAvatar user={user} />
          </Table.RowHeader>
          <Table.Cell>{user.primary_email}</Table.Cell>
          <Table.Cell>{user.login_id}</Table.Cell>
          {props.canReadSIS ? <Table.Cell>{user.sis_user_id}</Table.Cell> : null}
        </Table.Row>
      )
    })
  }

  const renderDupes = () => {
    const tables: JSX.Element[] = []
    for (const key in props.duplicateUsers) {
      tables.push(renderDupeTables(key, props.duplicateUsers[key]))
    }
    return tables
  }

  const renderAlert = () => {
    const selectedDupeCount = Object.keys(selectedDupes).length
    const nonNullCount = Object.values(selectedDupes).filter(value => value !== null).length
    const userCount = userDetails.length + nonNullCount
    const variant = nonNullCount === selectedDupeCount ? 'success' : 'warning'
    return (
      <Alert variant={variant} margin="0">
        {I18n.t(
          {
            zero: 'No users are ready, select a user from the duplicates below.',
            one: 'One user is ready to be assigned temporary enrollments.',
            other: '%{count} users are ready to be assigned temporary enrollments',
          },
          {count: userCount}
        )}
      </Alert>
    )
  }

  if (loading) {
    return (
      <Flex justifyItems="center" alignItems="center">
        <Spinner renderTitle={I18n.t('Retrieving user information')} />
      </Flex>
    )
  }
  // only dupes
  if (userDetails.length === 0) {
    return (
      <>
        <Flex.Item shouldGrow={true}>{renderAlert()}</Flex.Item>
        <Flex.Item>{renderDupes()}</Flex.Item>
      </>
    )
  }
  // found users and dupes
  return (
    <>
      <Flex.Item shouldGrow={true}>{renderAlert()}</Flex.Item>
      <Flex.Item>{renderDupes()}</Flex.Item>
      <Flex.Item shouldGrow={true}>
        <Table caption={<ScreenReaderContent>{I18n.t('User information')}</ScreenReaderContent>}>
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="usertable-name">{I18n.t('Name')}</Table.ColHeader>
              <Table.ColHeader id="usertable-email">{I18n.t('Email Address')}</Table.ColHeader>
              <Table.ColHeader id="usertable-loginid">{I18n.t('Login ID')}</Table.ColHeader>
              {props.canReadSIS ? (
                <Table.ColHeader id="usertable-sisid">{I18n.t('SIS ID')}</Table.ColHeader>
              ) : null}
            </Table.Row>
          </Table.Head>
          <Table.Body>{renderFoundRows()}</Table.Body>
        </Table>
      </Flex.Item>
    </>
  )
}
