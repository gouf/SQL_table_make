function applyQueryStringToDisplay() {
  insertQueries = collectRowValuesAndConvertToInsertQuery()

  allQueries =
    ''.concat(
      buildColumnQuery(), "\n",
      insertQueries.join("\n"), "\n"
    )

  $('#result').text(allQueries)
}

function tableNames() {
  return (
    $('#app .table-name input').get().map(function(elm) {
      return elm.value
    }).filter(function(elm) {
      return elm.length != 0
    })
  )
}

function nameAndType(str) {
  splitedData = str.split(':') // eg. columnName:varchar(255)

  return {name: splitedData[0], type: splitedData[1]}
}

// FIXME: 仕事内容が多すぎるので複数に分割する
function collectRowValuesAndConvertToInsertQuery() {
  // FIXME: 配列で1~4 直接指定ではなくHTML の内容から<input/> の内容を取り出す
  inputValues =
    [1, 2, 3, 4].map(function(index) { // HTML で使用する</input> にinput + 1~4 までのクラス名を指定済み
      // input で入力済みのデータを行ごとに収集
      return (
        $(''.concat('.input-', index)).get()
        .map(function(elm) { return elm.value })
        .filter(function(elm) { return elm.length != 0 })
      )
    }).filter(function(array) { return array.length != 0 })

  return (
    inputValues.map(function(values) {
      // input で入力された内容をINSERT 構文に変換
      return buildInsertQuery(values)
    })
  )
}

function buildColumnQuery() {
  columnNames =
    tableNames().map(function(name) {
      return ''.concat('    ', nameAndType(name).name, ' ', nameAndType(name).type)
    }).join(",\n")

  tableName = 'Table1'

  return ''.concat('CREATE TABLE ', tableName, " (\n",
    columnNames, "\n",
    ') DEFAULT CHARSET=utf8;')
}

function buildInsertQuery(arrayValues) {
  name = tableNames().map(function (name) { return nameAndType(name).name }).join(', ')
  values =
    arrayValues.map(function (value) {
      switch(true) {
        case value === 'Null':
          return 'Null'
        case isNaN(parseInt(value)):
          return ''.concat('"', value, '"')
        default:
          return value
      }
    }).join(', ')
  return ''.concat('INSERT INTO Table1(', name, ') VALUES(', values, ');')
}

$(function() {
  $('#app .row input').on('keyup', function(_) {
    applyQueryStringToDisplay()
  })

  applyQueryStringToDisplay()
})
