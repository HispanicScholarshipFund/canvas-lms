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

import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useEditor, useNode, type Node} from '@craftjs/core'

import {Img} from '@instructure/ui-img'

import {ImageBlockToolbar} from './ImageBlockToolbar'
import {useClassNames} from '../../../../utils'
import {type ImageBlockProps, type ImageVariant, type ImageConstraint} from './types'
import {BlockResizer} from '../../../editor/BlockResizer'

import {useScope as useI18nScope} from '@canvas/i18n'

const I18n = useI18nScope('block-editor/image-block')

const ImageBlock = ({
  src,
  width,
  height,
  constraint,
  maintainAspectRatio,
  sizeVariant,
}: ImageBlockProps) => {
  const {enabled} = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    actions: {setProp, setCustom},
    connectors: {connect, drag},
  } = useNode((n: Node) => {
    return {
      node: n,
    }
  })
  const clazz = useClassNames(enabled, {empty: !src}, ['block', 'image-block'])
  const [styl, setStyl] = useState<any>({})
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currSzVariant, setCurrSzVariant] = useState(sizeVariant)
  const [currKeepAR, setCurrKeepAR] = useState(maintainAspectRatio)
  const [aspectRatio, setAspectRatio] = useState(1)
  // in preview mode, node.dom is null, so use a ref to the element
  const [blockRef, setBlockRef] = useState<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const setSize = useCallback(() => {
    if (!blockRef) return

    if (!src || sizeVariant === 'auto') {
      setStyl({
        width: 'auto',
        height: 'auto',
      })
      return
    }
    const sty: any = {}
    if (width) {
      if (sizeVariant === 'percent') {
        const parent = blockRef.offsetParent
        const pctw = parent ? (width / parent.clientWidth) * 100 : 100
        sty.width = `${pctw}%`
      } else {
        sty.width = `${width}px`
      }
    }
    if (maintainAspectRatio) {
      sty.height = 'auto'
    } else if (sizeVariant === 'pixel' || sizeVariant === 'percent') {
      sty.height = `${height}px`
    }
    setStyl(sty)
  }, [blockRef, height, maintainAspectRatio, sizeVariant, src, width])

  useEffect(() => {
    if (!src) return
    if (imageLoaded) return

    const loadTimer = window.setInterval(() => {
      if (!imgRef.current) return
      if (!imgRef.current.complete) return
      const img = imgRef.current
      setImageLoaded(true)
      setAspectRatio(img.naturalWidth / img.naturalHeight)
      setProp((props: any) => {
        props.width = img.width
        props.height = img.height
      })
      clearInterval(loadTimer)
    }, 10)
    return () => {
      clearInterval(loadTimer)
    }
  }, [imageLoaded, setProp, src])

  useEffect(() => {
    setSize()
  }, [width, height, aspectRatio, setSize])

  useEffect(() => {
    if (currSzVariant !== sizeVariant || currKeepAR !== maintainAspectRatio) {
      setCurrSzVariant(sizeVariant)
      setCurrKeepAR(maintainAspectRatio)
      setSize()
      if (!maintainAspectRatio) {
        setProp((props: any) => {
          if (imgRef.current) {
            props.width = imgRef.current.clientWidth
            props.height = imgRef.current.clientHeight
          }
        })
      }
    }
  }, [currKeepAR, currSzVariant, maintainAspectRatio, setProp, setSize, sizeVariant])

  useEffect(() => {
    setCustom((ctsm: any) => {
      ctsm.isResizable = !!src && sizeVariant !== 'auto'
    })
  }, [setCustom, sizeVariant, src])

  const imgConstrain =
    (maintainAspectRatio ? 'cover' : constraint) || ImageBlock.craft.defaultProps.constraint
  if (!src) {
    return (
      <div className={clazz} style={styl} ref={el => el && connect(drag(el as HTMLDivElement))} />
    )
  } else {
    return (
      <div
        className={clazz}
        style={styl}
        ref={el => {
          el && connect(drag(el as HTMLDivElement))
          setBlockRef(el)
        }}
      >
        <Img
          elementRef={el => (imgRef.current = el as HTMLImageElement)}
          display="inline-block"
          src={src || ImageBlock.craft.defaultProps.src}
          constrain={imgConstrain}
        />
      </div>
    )
  }
}

ImageBlock.craft = {
  displayName: I18n.t('Image'),
  defaultProps: {
    src: '',
    variant: 'default' as ImageVariant,
    constraint: 'cover' as ImageConstraint,
    maintainAspectRatio: false,
    sizeVariant: 'auto',
  },
  related: {
    toolbar: ImageBlockToolbar,
    resizer: BlockResizer,
  },
  custom: {
    isResizable: true,
  },
}

export {ImageBlock}
