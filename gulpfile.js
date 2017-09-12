const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const ejs = require("gulp-ejs");
const del = require("del");
const gutil = require("gulp-util");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require("gulp-if");
const seq = require("gulp-sequence");
const debug = require("gulp-debug");
const rev = require("gulp-rev");
const yaml = require("yaml-js");
const fs = require("fs");
const dotenv = require("dotenv");
const envs = dotenv.load().parsed;

const isProduction = process.env.NODE_ENV === "production";

function getHashForFile(filePattern) {
  const allFiles = fs.readdirSync("./dist");
  const matchedFiles = allFiles.filter(fileName => !!fileName.match(filePattern));
  if (matchedFiles.length === 0) {
    return "";
  } else {
    const matchedFile = matchedFiles[0]; // first result is good enough
    return matchedFile.match(filePattern)[1];
  }
}

gulp.task("clean", () => del(["dist"]));

gulp.task("page", () => {
  const jsBundleHash = getHashForFile(/main(.*)\.js/);
  const cssBundleHash = getHashForFile(/app(.*)\.css/);

  const content = yaml.load(fs.readFileSync("./content.yml", "utf8"));
  const productContent = yaml.load(fs.readFileSync("./productContent.yml", "utf8"));
  const faq = yaml.load(fs.readFileSync("./faq.yml", "utf8"));

  const templateData = {
    content,
    productContent,
    faq,
    hashes: {
      jsBundleHash,
      cssBundleHash,
    },
    GA_ID: envs.GA_ID,
    FAQ_ENABLED:!!parseInt(envs.FAQ_ENABLED)
  };

  // notice no return here: https://github.com/rogeriopvl/gulp-ejs/issues/86
  gulp
    .src("./page/index.ejs")
    .pipe(ejs(templateData, {}, { ext: ".html" }).on("error", gutil.log))
    .pipe(gulp.dest("./dist/"));

  gulp
    .src("./page/faq.ejs")
    .pipe(ejs(templateData, {}, { ext: ".html" }).on("error", gutil.log))
    .pipe(gulp.dest("./dist/"));

  gulp
    .src("./page/product.ejs")
    .pipe(ejs(templateData, {}, { ext: ".html" }).on("error", gutil.log))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("sass", () => {
  const minifyOptions = {
    outputStyle: "compressed",
  };
  return gulp
    .src("./page/sass/app.scss")
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass(isProduction ? minifyOptions : null).on("error", gutil.log))
    .pipe(gulpif(isProduction, rev()))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("copy", () => {
  return gulp.src("./page/assets/**/*").pipe(gulp.dest("./dist/assets/"));
});

gulp.task("copy-fa", () =>
  gulp.src("./node_modules/font-awesome/fonts/*").pipe(gulp.dest("./dist/fonts/"))
);
gulp.task("copy-js", () => gulp.src("./page/js/**/*").pipe(gulp.dest("./dist/js/")));

gulp.task("watch", () => {
  gulp.watch("./page/**/*.ejs", ["page"]);
  gulp.watch(["./page/sass/*.scss", "./common/sass/*.scss"], ["sass"]);
  gulp.watch("./page/assets/**/*", ["copy"]);
  gulp.watch("./page/js/**/*", ["copy-js"]);
  gulp.watch("./*.yml", ["page"]);
});

// this has to be called separately because page task is not synchronous
gulp.task("minify-html", () => {
  return gulp
    .src("./dist/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("build", seq("clean", "build:prod"));
// we skip clean task because its called before by yarn
gulp.task("build:prod", seq(["sass", "copy", "copy-fa", "copy-js"], "page"));
