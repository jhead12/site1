const fs = require("fs")
const path = require("path")

test("Footer component contains expected Contentful query fields", () => {
  const footerPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "footer.js"
  )
  const contents = fs.readFileSync(footerPath, "utf8")
  expect(contents).toMatch(/allContentfulLayout/) // top-level layout query
  expect(contents).toMatch(/footer/) // footer field
  expect(contents).toMatch(/links/) // footer links
  expect(contents).toMatch(/meta/) // meta links
  expect(contents).toMatch(/socialLinks/) // social links
})
