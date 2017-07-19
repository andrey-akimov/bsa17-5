
// Имена переменных берутся любые, а require берется строго из package.json
var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		browserSync 	= require('browser-sync'),
		concat 				= require('gulp-concat'),
		uglyfy 				= require('gulp-uglify'),
		cssnano 			= require('gulp-cssnano'),
		rename 				= require('gulp-rename'),
		del						= require('del'),
		imagemin			= require('gulp-imagemin'),
		pngquant			=	require('imagemin-pngquant'),
		cache 				= require('gulp-cache'),
		autoprefixer	= require('gulp-autoprefixer');


// sass => css + autoprefixer
gulp.task('sass', function () {								// Создаем таск sass
  return gulp.src('app/sass/**/*.sass')				// Берем источник
    .pipe(sass().on('error', sass.logError))	// Преобразуем sass в css посредством gulp-sass
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'))								// Выгружаем результата в папку app/css
    .pipe(browserSync.reload({stream: true}));// Обновляем css на странице при изменении
});


// Таск 'min' содержит в себе 2 функции: кокатенацию и минификацию подключаемых js библиотек
gulp.task('js-min', function() {
  return gulp.src([														//Передаем массивом библиотеки для обработки
  	'app/libs/jquery/jquery_2.2.4.min.js',
  	'app/libs/bootstrap/bootstrap.min.js',
		'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))								//Объеденяем все библиотеки в один файл
  .pipe(uglyfy())															//Минифицируем его
  .pipe(gulp.dest('app/js'));									//Выгружаем объедененный минифицированный файл
});


// Таск 'css-min' сначала запускает таск 'sass', а потом выполняется сам
gulp.task('css-min', ['sass'], function() {
  return gulp.src('app/css/style.css')				//Данные берем из этого файла
  .pipe(cssnano())														//Минифицируем css
  .pipe(rename({suffix: '.min'}))							//В конце имени файла добавляем приставку '.min'
  .pipe(gulp.dest('app/css'));								//Выгружаем готовый файл в директорию
});


// Автообновление
gulp.task('browser-sync', function() {
  browserSync({
  	server: {
  		baseDir: 'app'
  	},
  	notify: false
  })
});


// Минификация картинок
gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({											// Кэширование изображения
  	interlaced: true,
  	progressive: true,
  	svgoPlugins: [{removeViewBox: false}],
  	use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});


// Таск 'watch' следит за файлами и запускает функцию, если находит в них изменения
gulp.task('watch', ['browser-sync', 'css-min', 'js-min'], function () {	// Создаем таск gulp-watch. Всё, что в [] будет выполнено в первую очередь
  gulp.watch('app/sass/**/*.sass', ['sass']);														// Наблюдение за .sass файлами в папке sass
	gulp.watch('app/*.html', browserSync.reload);													// Наблюдение за .html файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);											// Наблюдение за .js файлами в папке js
});


//defaul
gulp.task('default', ['watch']);


// Таск 'build' перемещает файлы в указанные директории
gulp.task('build', ['clean', 'img', 'css-min', 'js-min'], function() {

  var buildCss = gulp.src([
  	'app/css/style.css',
  	'app/css/libs.min.css'
  ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

});


// Удаление указанной директории
gulp.task('clean', function() {
  return del.sync('dist');
});


// Очистка кэша
gulp.task('clearcache', function() {
  return cache.clearAll();
});
