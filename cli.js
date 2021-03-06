#!/usr/bin/env node
'use strict'
const meow       = require('meow')
const getStdin   = require('get-stdin')
const logSymbols = require('log-symbols')

const cli = meow(`
	Usage
	  ~ ❯❯❯ binary [string]
	  ~ ❯❯❯ echo [string] | bin -d
	Options
		-d, --decode  Decode binary-encoded string
		-p, --plain   Display output without log symbols
	Examples
	  ~ ❯❯❯ binary foo
	  ${logSymbols.success} 1100110 1101111 1101111
	  ~ ❯❯❯ binary -d "1100010 1100001 1110010"
	  ${logSymbols.success} bar
`, {
	flags: {
		decode: {
			type: 'boolean',
			alias: 'd',
			default: false
		},
		plain: {
			type: 'boolean',
			alias: 'p',
			default: false
		}
	}
})

const input = cli.input[0]

function binEncode (text) {
	return text.split("").map(char => char.charCodeAt(0).toString(2)).join(" ")
}

function binEncodedRegex (text) {
	const re = '(?:[01]+)'
	if (new RegExp(re, 'g').test(text)) return true
	else return false
}

function binDecode (bin) {
	if (binEncodedRegex(bin)) {
		var ascii = ''
		bin.replace(/[01]+/g, function (i) {
			ascii += String.fromCharCode(parseInt(i, 2))
		})
		return ascii
	}
	else return 'Text doesn\'t seem to be binary-encoded'
}

function display (plaintext) {
	if (plaintext != 'Text doesn\'t seem to be binary-encoded') {
		const leading = (cli.flags["plain"]) ? `` : `${logSymbols.success} `
		console.log(leading + plaintext)
	} else {
		const leading = (cli.flags["plain"]) ? `` : `${logSymbols.error} `
		console.log(leading + `Text doesn\'t seem to be binary-encoded`)
		process.exit(1)
	}
}

if (!input && process.stdin.isTTY) {
	console.log('Enter string to binary encode/decode')
	process.exit(1)
}
if (input) {
	if (cli.flags["decode"]) {
		display(binDecode(input))
	} else {
		display(binEncode(input))
	}
} else {
	getStdin().then(stdin => {
		if (cli.flags["decode"]) {
			display(binDecode(stdin))
		} else {
			display(binEncode(stdin))
		}
	})
}