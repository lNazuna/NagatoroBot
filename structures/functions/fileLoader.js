const { glob } = require("glob")

/**
 * @param {String} folderName
 */
async function loadFiles(folderName) {

    const files = await glob(`${process.cwd().replace(/\\/g, "/")}/${folderName}/*/*.js`)

    files.forEach(file => delete require.cache[require.resolve(file)])

    return files

}

module.exports = { loadFiles }