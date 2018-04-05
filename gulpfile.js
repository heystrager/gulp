var gulp = require('gulp'),                                  // Подрубаем gulp к проекту
    stylus = require('gulp-stylus');                         // Подключаем stylus пакет
    browserSync = require('browser-sync'),                   // Подключаем Browser Sync
    concat = require('gulp-concat'),                         // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'),                       // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'),                       // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'),                         // Подключаем библиотеку для переименования файлов
    del = require('del');                                    // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'),                     // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'),                 // Подключаем библиотеку для работы с png
    autoprefixer = require('gulp-autoprefixer');             // Подключаем пакет для автопрефиксов


gulp.task('stylus',function(){ 
  return gulp.src('app/stylus/**/*.styl') // Берем файл .styl
  .pipe(stylus())   // Преобразуем в css
  .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true})) // создаем автопрефиксы
  .pipe(gulp.dest('app/css'))  // Выгружаем в папку css
  .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});    

gulp.task('browser-sync', function() {
  browserSync({ // Выполняем browser Sync
      server: { // Определяем параметры сервера
          baseDir: 'app' // Директория для сервера - app
      },
      notify: false // Отключаем уведомления
  });
});

gulp.task('scripts', function() {
  return gulp.src([ // Берем все необходимые библиотеки
      'app/libs/jquery/dist/jquery.min.js' // Берем jQuery
      ])
      .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
      .pipe(uglify()) // Сжимаем JS файл
      .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['stylus'], function() {
  return gulp.src('app/css/libs.css') // Выбираем файл для минификации
      .pipe(cssnano()) // Сжимаем
      .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
      .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'stylus', 'scripts'], function() {
  gulp.watch('app/stylus/**/*.styl', ['stylus']); // Наблюдение за stylus файлами
  gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
  // Наблюдение за другими типами файлов
});

gulp.task('clean', function() {
  return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*') // Берем все изображения из app
      .pipe(imagemin({ // Сжимаем их с наилучшими настройками
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'stylus', 'scripts'], function() {

  var buildCss = gulp.src([ // Переносим CSS стили в продакшен
      'app/css/main.css',
      'app/css/libs.min.css'
      ])
  .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
  .pipe(gulp.dest('dist/fonts'))

  var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
  .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
  .pipe(gulp.dest('dist'));

});      
