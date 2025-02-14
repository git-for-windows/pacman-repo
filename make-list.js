#!/usr/bin/env node

module.exports = () => {
  const fs = require("fs")
  l = ["i686", "x86-64", "aarch64", "sources"]
    .reduce((a, e) => {
      return [
          ...a,
          ...JSON.parse(fs.readFileSync(`${e}-list.txt`))
      ]
    }, [])

  let lastUpdate = -1
  return l.map(e => {
      return {
      name: `${e.container}/${e.name}`,
      date: e.properties.lastModified,
      size: e.properties.contentLength
      }
    })
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .reduce((a, e) => {
      let last = a.pop() || { date: e.date, start: e.date, names: [], totalSize: 0 }
      if (Date.parse(last.date) + 10 * 60 * 1000 < Date.parse(e.date)) {
      a.push(last)
      last = { start: e.date, names: [], totalSize: 0 }
      }
      last.date = e.date
      last.names.push(e.name)
      last.totalSize += e.size
      a.push(last)
      return a
    }, [])
    .map(e => {
      const secondsBetweenUpdates = lastUpdate < 0 ? undefined : (Date.parse(e.date) - lastUpdate) / 1000
      lastUpdate = Date.parse(e.date)
      return {
        ...e,
        duration: (Date.parse(e.date) - Date.parse(e.start)) / 1000,
        secondsBetweenUpdates,
        date: new Date(e.date)
      }
    })
}

if (require.main === module) {
  console.log(JSON.stringify(module.exports(), null, 2))
}
