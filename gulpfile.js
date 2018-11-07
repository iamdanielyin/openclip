/**
 * 模块依赖
 */

const path = require('path');
const fsx = require('fs-extra');
const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const sequence = require('gulp-sequence');
const dest = 'dist';

// 清空输出目录
gulp.task('clean', function () {
  return fsx.emptyDirSync(__dirname + '/' + dest);
});

// 编译服务端
gulp.task('build:server', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['env'],
      plugins: ['transform-runtime']
    }))
    .pipe(uglify({
      sourceMap: {
        url: 'inline'
      }
    }))
    .pipe(gulp.dest(dest));
});

// 复制其余文件
gulp.task('copy:others', function () {
  return gulp.src([
    'package.json',
    'src/**/*.json',
    'src/**/*.html'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('default', sequence('clean', ['build:server', 'copy:others']));