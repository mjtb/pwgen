/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
const gulp = require('gulp');
const ts = require('gulp-typescript');
const jsdoc = require('gulp-jsdoc3');
const proj = ts.createProject('tsconfig.json');
const jasmine = require('gulp-jasmine');

gulp.task('default', function() {
	return proj.src().pipe(proj()).js.pipe(gulp.dest('lib'));
});
gulp.task('test', function() {
	return gulp.src([
		'lib/**/*[Ss]pec.js',
		'spec/helpers/**/*.js'
	]).pipe(jasmine());
});
gulp.task('doc', function(cb) {
	gulp.src([
		'README.md',
		'lib/category.js',
		'lib/constraint.js',
		'lib/generator.js',
		'lib/generators.js',
		'lib/entropy.js',
		'lib/range.js'
	], { read: false }).pipe(jsdoc(cb));
});
