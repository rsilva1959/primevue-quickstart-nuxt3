import FireStoreParser from 'firestore-parser'
import axios from 'axios';
import { apiUrl } from './useFirebase'



// console.log(apiUrl)

const getFieldType = (value) => {
  if (typeof value === 'boolean') return 'booleanValue'
  if (typeof value === 'string') return 'stringValue'
  if (!isNaN(value)) return 'integerValue'
  if (value instanceof Array) return 'arrayValue'
  return 'stringValue'
}

const getFieldValue = (value) => {
  if (value instanceof Array) return { values: value.map(v => ({ [getFieldType(v)]: getFieldValue(v) })) }
  return value
}

const list_api = (_path, args) => {
  const collectionId = _path.split('/').pop()
  const path = args.group || _path.split('/').length === 1 ?
    _path : _path.replace(`/${collectionId}`, '')

  // console.log(_path, path, collectionId)
  const ops = {
    '==': 'EQUAL',
    '!=': 'NOT_EQUAL',
    '<': 'LESS_THAN',
    '<=': 'LESS_THAN_OR_EQUAL',
    '>': 'GREATER_THAN',
    '>=': 'GREATER_THAN_OR_EQUAL',
    'array-contains': 'ARRAY_CONTAINS',
    'in': 'IN'
  }
  const directions = {
    asc: 'ASCENDING',
    ASC: 'ASCENDING',
    desc: 'DESCENDING',
    DESC: 'DESCENDING'
  }
  const url = `${apiUrl}/${path}:runQuery?t=${new Date().getTime()}`
  const structuredQuery = { from: { collectionId } }
  if (args) {
    if (args.group) structuredQuery.from['allDescendants'] = true
    if (args.select)
      structuredQuery['select'] = { fields: args.select.map(s => ({ fieldPath: s })) }
    if (args.where)
      structuredQuery['where'] = {
        compositeFilter: {
          filters: args.where.map(w => ({
            fieldFilter: {
              field: { fieldPath: w[0] },
              op: ops[w[1]],
              value: { [getFieldType(w[2])]: getFieldValue(w[2]) }
            }
          })), op: 'AND'
        }
      }
    if (args.orderBy)
      structuredQuery['orderBy'] = {
        field: { fieldPath: args.orderBy },
        direction: args.direction ? directions[args.direction] : directions.asc
      }
    if (args.limit) structuredQuery['limit'] = +args.limit
    if (args.offset) structuredQuery['offset'] = +args.offset
  }
  // console.log('API :', JSON.stringify(structuredQuery))
  // console.log('API :', url, { structuredQuery })

  return axios.post(url, { structuredQuery })
    .then(res => res.data)
    .then(res => res.map(r => {
      if (!r.document || !r.document.fields) return false
      const doc: any = FireStoreParser(r.document.fields, r.document.name || null)
      const id = r.document.name.split('/')[r.document.name.split('/').length - 1]
      // console.log('ID  :', id)
      // console.log({ ...doc, id })
      return { ...doc, id }
    })).catch(error => console.log(error.toJSON())
    )
}

const get_api = (_path, id) => {
  // console.log(`${apiUrl}/${_path}/${id}`)
  return axios.get(`${apiUrl}/${_path}/${id}`)
    .then((res) => res.data)
    .then(res => {
      // console.log( res['fields'])
      // console.log(res['fields'] ? FireStoreParser(res['fields']) : [])
      return res['fields'] ? FireStoreParser(res['fields']) : []
    })
    .catch(error => console.log(error.toJSON()))
}

export {
  get_api,
  list_api
}