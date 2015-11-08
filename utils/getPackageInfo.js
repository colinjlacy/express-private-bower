/**
 * Created by colinjlacy on 11/7/15...
 *
 * ...ish.  I shamelessly took mirror-like inspiration from the packageDetailsProvider
 * in https://github.com/Hacklone/private-bower
 */

'use strict';

const
	exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path'),

	tempFolder = path.join(__dirname, '../.bow/packageDetails');

String.prototype.format = function format() {
	const
		args = arguments;

	return this.replace(/\{(\d+)\}/g, function($0, $1) {
		return args[+$1];
	});
};

function _exec(command, cwd) {
	return new Promise(function(resolve, reject) {
		exec(command, {cwd: cwd}, function(error, stdout) {
			if(error) {
				logger.log('Error during "{0}" in "{1}". Output was: {2}'.format(command, cwd, stdout));

				reject(error);
			}
			else {
				resolve(stdout);
			}
		});
	});
}

function _getRandomString() {
	return Math.random().toString(36).substring(2);
}

function _parseOwner(url) {
	// makes the assumption that the package is stored on either a public
	// or private GitHub
	const
		start = url.indexOf('.com/') + 5,
		end = url.indexOf('/', start);
	return {
		owner: url.slice(start, end),
		ownerUrl: url.slice(0, end)
	}
}

function _removeDirectory(dirPath) {
	if(!fs.existsSync(dirPath)) {
		return;
	}

	fs.readdirSync(dirPath).forEach(function(file) {
		const
			currentFilePathPath = path.join(dirPath, file);

		if(fs.lstatSync(currentFilePathPath).isDirectory()) {
			_removeDirectory(currentFilePathPath);
		}
		else {
			fs.unlinkSync(currentFilePathPath);
		}
	});

	fs.rmdirSync(dirPath);
}

function getPackageDetails(packageUrl) {
	return new Promise(function(resolve, reject) {
		const
			tempName = _getRandomString(),
			gitCloneFolder = path.join(tempFolder, tempName);

		_exec('git clone {0} {1} --depth=1'.format(packageUrl, gitCloneFolder))
			.then(function() {
				const
					bowerJsonLocation = path.join(gitCloneFolder, 'bower.json'),
					fileContent = fs.readFileSync(bowerJsonLocation),
					ownerInfo = _parseOwner(packageUrl);

				let bowerJson = JSON.parse(fileContent);

				for(let prop in ownerInfo) {
					if(ownerInfo.hasOwnProperty(prop)) bowerJson[prop] = ownerInfo[prop];
				}

				_removeDirectory(gitCloneFolder);

				resolve(bowerJson);
			})
			.catch(reject);
	});
}

module.exports = getPackageDetails;