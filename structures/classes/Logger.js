const { redBright, yellowBright, greenBright, cyanBright, blueBright, red } = require("chalk")

class Logger {

    /**
     * @param {String} group - group of the logged statement
     * @param {String} description - description of the logged statment
     */
    error(group, description) {

        return console.log("[ " + getDateInFormat() + " ]" + " | " + redBright("[ " + group.toUpperCase() + " ]") + " " + red(description))

    }

    /**
     * @param {String} group - group of the logged statement
     * @param {String} description - description of the logged statment
     */
    debug(group, description) {

        return console.log("[ " + getDateInFormat() + " ]" + " | " + yellowBright("[ " + group.toUpperCase() + " ]") + " " + cyanBright(description))

    }

    /**
     * @param {String} group - group of the logged statement
     * @param {String} description - description of the logged statment
     */
    info(group, description) {

        return console.log("[ " + getDateInFormat() + " ]" + " | " + greenBright("[ " + group.toUpperCase() + " ]") + " " + cyanBright(description))

    }

    /**
     * @param {String} text - text to be highlighted
     */
    highlight(text) {

        return blueBright(text)

    }

}

module.exports = { Logger }

function getDateInFormat() {

    /**
     * @param {Number} number 
     * @param {Number} padLength 
     */
    function toString(number, padLength) {
        return number.toString().padStart(padLength, "0")
    }

    let date = new Date()

    let dateTimeNow =
        toString(date.getFullYear(), 4)
        + "/" + toString(date.getMonth() + 1, 2)
        + "/" + toString(date.getDate(), 2)
        + " | " + toString(date.getHours(), 2)
        + ":" + toString(date.getMinutes(), 2)
        + ":" + toString(date.getSeconds(), 2)

    return dateTimeNow
}