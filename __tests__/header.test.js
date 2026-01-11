const fs = require("fs")
const path = require("path")

test("Header component contains expected Contentful query fields", () => {
  const headerPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "header.js"
  )
  const contents = fs.readFileSync(headerPath, "utf8")
  expect(contents).toMatch(/contentfulLayoutHeader/) // top-level query
  expect(contents).toMatch(/navItems/) // nav items
  expect(contents).toMatch(/cta/) // call-to-action
})
