/**
 * Created by zuozhuo on 2016/12/8.
 */
'use strict'

import _ from 'lodash'

class XEnumItem {
  constructor(value, text, meta = {}) {
    this.value = value
    this.text = text
    this.meta = meta
  }

  getValue() {
    return this.value
  }

  getText() {
    return this.text
  }

  equals(value) {
    if (value instanceof XEnumItem) {
      value = value.getValue()
    }
    return this.value === value
  }
}
class XEnum {
  constructor(enumDict) {
    this.enumItems = Object.values(enumDict)
    Object.keys(enumDict).forEach((key) => {
      this[key] = enumDict[key]
    })
  }

  findItem(itemValue) {
    if (itemValue instanceof XEnumItem) {
      itemValue = itemValue.getValue()
    }
    return this.enumItems.find((e) => e.getValue() === itemValue)
  }

  findItemByText(itemText) {
    if (itemText instanceof XEnumItem) {
      itemText = itemText.getText()
    }
    return this.enumItems.find((e) => e.getText() === itemText)
  }

  toText(value) {
    let item = _.find(this.enumItems, ['value', value])
    return item === undefined ? null : item.getText()
  }

  parseValueByText(text) {
    let exist = _.find(this.enumItems, (ele) => {
      return ele.getText() === text
    })
    if (exist === undefined) {
      return null
    } else {
      return exist.getValue()
    }
  }

  getOptions(excludeIndex) {
    if (!this.options) {
      console.log('excludeIndex: ', this.enumItems)
      return this.enumItems
        .filter((e) => excludeIndex !== e.getValue())
        .map((e) => {
          return {
            value: e.getValue(),
            label: e.getText(),
            text: e.getText(),
          }
        })
    } else {
      return []
    }
  }
}

const PRODUCT_STATUS = new XEnum({
  DRAFT: new XEnumItem(0, '草稿'),
  WAITING: new XEnumItem(1, '待审核'),
  REJECTED: new XEnumItem(2, '审核失败'),
  ON_SALE: new XEnumItem(3, '已上架'),
  INVALID: new XEnumItem(4, '已下架'),
})

export default {
  PRODUCT_STATUS,
}
