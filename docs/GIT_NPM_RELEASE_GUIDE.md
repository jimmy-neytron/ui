# Git, локальная проверка и публикация Compact UI в npm

Инструкция относится к текущей структуре проекта `compact-ui`.

## 1. Что понадобится

Установите:

- Git;
- Node.js 24;
- npm;
- аккаунт GitHub;
- аккаунт npm с включённой двухфакторной аутентификацией.

Проверьте окружение:

```bash
git --version
node --version
npm --version
```

В проекте указано `node >=24`, а workflow используют Node.js 24.

## 2. Распаковка и первичная настройка

Распакуйте архив и перейдите в каталог проекта:

```bash
cd compact-ui
```

До публикации замените placeholder-значения в корневом `package.json`:

```json
{
  "name": "@neytron/compact-ui",
  "author": "YOUR_NAME",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jimmy-neytron/ui.git"
  },
  "homepage": "https://github.com/jimmy-neytron/ui#readme",
  "bugs": {
    "url": "https://github.com/jimmy-neytron/ui/issues"
  }
}
```

Scope `jimmy-neytron` должен принадлежать вашему npm-аккаунту или npm organization.

Проверьте, что имя пакета свободно:

```bash
npm view @neytron/compact-ui name
```

Ошибка `E404` обычно означает, что такой пакет ещё не опубликован.

Также выполните поиск placeholder-значений по проекту:

```bash
git grep -n "your-scope\|your-account\|Your Name\|placeholder"
```

До `git init` ту же проверку можно выполнить средствами IDE.

## 3. Создание lock-файлов

В исходном архиве lock-файлы отсутствуют. Они обязательны, потому что CI и consumer-тест используют `npm ci`.

Установите зависимости библиотеки:

```bash
npm install
```

Затем установите зависимости отдельного consumer-приложения:

```bash
npm install --prefix examples/consumer
```

После этого должны появиться:

```text
package-lock.json
examples/consumer/package-lock.json
```

Оба файла нужно хранить в Git.

Для дальнейших чистых установок используйте:

```bash
npm ci
npm ci --prefix examples/consumer
```

## 4. Локальная разработка

### Playground с HMR

```bash
npm run dev
```

Vite выведет локальный адрес, обычно `http://localhost:5173`.

Playground импортирует компоненты из `src`, поэтому он удобен для быстрой визуальной разработки. Он не доказывает, что npm-пакет и его `exports` собраны правильно.

### Production-сборка playground

```bash
npm run playground:build
npm run playground:preview
```

### Unit-тесты

Один запуск:

```bash
npm run test
```

Режим наблюдения:

```bash
npm run test:watch
```

Покрытие:

```bash
npm run test:coverage
```

### Проверка типов

```bash
npm run typecheck
```

### ESLint

```bash
npm run lint
```

### Production build библиотеки

```bash
npm run build
```

Готовый пакет появится в `dist/`. Команда собирает JavaScript, source maps, CSS и TypeScript declarations.

### Проверка размера

```bash
npm run check:size
```

### Проверка состава npm-пакета

```bash
npm run check:package
```

Скрипт выполняет `npm pack --json`, проверяет обязательные файлы и запрещает попадание `src`, playground, tests, `.github`, `.env`, tarball-файлов и других лишних данных.

### Проверка реального tarball в consumer-приложении

```bash
npm run test:package
```

Этот сценарий:

1. собирает библиотеку;
2. создаёт настоящий `.tgz` через `npm pack`;
3. устанавливает его в `examples/consumer`;
4. проверяет root imports;
5. проверяет direct imports;
6. проверяет CSS export;
7. запускает typecheck consumer-приложения;
8. выполняет production build consumer-приложения.

По умолчанию временный tarball удаляется. Чтобы сохранить его:

```bash
npm run test:package -- --keep
```

### Полная проверка

```bash
npm run check
npm run test:package
npm run pack:dry
```

`npm run check` уже включает lint, typecheck, unit-тесты, build, size check и package validation.

Перед публикацией можно выполнить одну команду:

```bash
npm run prepublishOnly
```

При обычном `npm publish` npm запустит `prepublishOnly` автоматически.

## 5. Создание локального tarball

Просмотреть будущий состав пакета без сохранения архива:

```bash
npm run pack:dry
```

Создать tarball в `.artifacts/`:

```bash
npm run pack
```

Проверить его вручную можно так:

```bash
npm pack --dry-run
```

Нельзя считать `npm link` основной проверкой пакета: он может скрыть ошибки `exports`, peer dependencies и состава tarball.

## 6. Подключение Git

### Настройка пользователя Git

Если Git ещё не настроен:

```bash
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR_GITHUB_EMAIL"
```

### Создание локального репозитория

Из корня `compact-ui`:

```bash
git init
git branch -M main
git add .
git status
git commit -m "feat: initialize Compact UI library"
```

Перед commit убедитесь, что в индекс не попали:

```text
node_modules/
dist/
.artifacts/
coverage/
*.tgz
.env
```

### Создание репозитория на GitHub

На GitHub создайте новый пустой repository, например `compact-ui`.

Не добавляйте при создании удалённого репозитория README, `.gitignore` и LICENSE, потому что эти файлы уже находятся в локальном проекте.

Подключите remote по HTTPS:

```bash
git remote add origin https://github.com/jimmy-neytron/ui.git
git remote -v
git push -u origin main
```

Или по SSH:

```bash
git remote add origin git@github.com:jimmy-neytron/ui.git
git push -u origin main
```

Если `origin` уже существует:

```bash
git remote set-url origin https://github.com/jimmy-neytron/ui.git
git remote -v
```

## 7. CI в GitHub Actions

Workflow уже находится в:

```text
.github/workflows/ci.yml
```

Он запускается:

- для pull request;
- для push в `main`.

Он выполняет:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:size
npm run check:package
npm run test:package
```

После первого push откройте вкладку **Actions** в GitHub и убедитесь, что workflow `CI` завершился успешно.

Если шаг `npm ci` падает с сообщением об отсутствии lock-файла, создайте и закоммитьте оба lock-файла из раздела 3.

Рекомендуемый рабочий процесс:

```text
feature branch → pull request → CI → review → merge в main
```

Пример:

```bash
git checkout -b feat/new-component
# изменения
git add .
git commit -m "feat: add new component"
git push -u origin feat/new-component
```

Затем создайте pull request в `main`.

## 8. Первая ручная публикация в npm

### 8.1. Подготовьте npm-аккаунт

1. Создайте аккаунт npm.
2. Подтвердите email.
3. Включите 2FA.
4. Убедитесь, что scope в `package.json` принадлежит вам или вашей организации.

### 8.2. Авторизуйтесь локально

```bash
npm login
npm whoami
```

`npm whoami` должен вывести ожидаемое имя пользователя.

### 8.3. Проверьте пакет

Рабочее дерево должно быть чистым:

```bash
git status
```

Выполните:

```bash
npm ci
npm run check
npm run test:package
npm run pack:dry
```

Проверьте имя и версию:

```bash
npm pkg get name version
```

### 8.4. Опубликуйте версию `0.1.0`

Для scoped public package:

```bash
npm publish --access public
```

Реальную публикацию нельзя отменить заменой той же версии: опубликованную версию повторно использовать нельзя.

После публикации проверьте:

```bash
npm view @neytron/compact-ui version
npm view @neytron/compact-ui dist-tags
```

И установите пакет в отдельном временном приложении:

```bash
npm create vite@latest compact-ui-smoke -- --template vue-ts
cd compact-ui-smoke
npm install
npm install @neytron/compact-ui
```

## 9. GitHub Environment для защищённой публикации

Текущий `publish.yml` использует environment:

```text
npm-production
```

Создайте его на GitHub:

1. Откройте repository.
2. Перейдите в **Settings**.
3. Откройте **Environments**.
4. Нажмите **New environment**.
5. Введите `npm-production`.
6. Добавьте required reviewers, если этот механизм доступен для вашего repository и тарифа.
7. При необходимости ограничьте deployment branches/tags.

Секрет `NPM_TOKEN` для Trusted Publishing добавлять не нужно.

Важно: название environment в GitHub, в npm Trusted Publisher и в `publish.yml` должно совпадать посимвольно:

```text
npm-production
```

## 10. Настройка npm Trusted Publishing

После первой ручной публикации откройте страницу пакета на npm:

1. Откройте пакет.
2. Перейдите в **Settings**.
3. Найдите **Trusted Publisher**.
4. Выберите **GitHub Actions**.
5. Заполните:

```text
Organization or user: jimmy-neytron
Repository: compact-ui
Workflow filename: publish.yml
Environment name: npm-production
Allowed action: npm publish
```

В поле workflow filename указывается только имя файла `publish.yml`, а не полный путь `.github/workflows/publish.yml`.

В workflow уже настроены минимально необходимые permissions:

```yaml
permissions:
  contents: read
  id-token: write
```

`id-token: write` позволяет GitHub Actions получить краткоживущий OIDC token. Долгоживущий npm token в GitHub Secrets не требуется.

Trusted Publishing должен выполняться на GitHub-hosted runner. Текущий workflow использует `ubuntu-latest`.

## 11. Как выпускается новая версия

### 11.1. Подготовьте изменения

```bash
git checkout main
git pull --ff-only origin main
git status
```

Рабочее дерево должно быть чистым.

Обновите `CHANGELOG.md`, затем выполните проверки:

```bash
npm ci
npm run check
npm run test:package
npm run pack:dry
```

Закоммитьте changelog, если меняли его отдельно:

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog"
```

### 11.2. Увеличьте версию

Исправление без breaking changes:

```bash
npm version patch -m "chore(release): v%s"
```

Новая обратно совместимая функциональность:

```bash
npm version minor -m "chore(release): v%s"
```

Breaking change:

```bash
npm version major -m "chore(release): v%s"
```

`npm version` изменит версию, создаст release commit и Git tag вида `vX.Y.Z`.

Проверьте:

```bash
git log -1 --oneline
git tag --points-at HEAD
npm pkg get version
```

### 11.3. Отправьте commit и tag

```bash
git push origin main --follow-tags
```

Обычный push tag сам по себе не запускает текущий publish workflow. Workflow настроен на опубликованный GitHub Release либо ручной запуск.

### 11.4. Создайте GitHub Release

1. Откройте GitHub repository.
2. Перейдите в **Releases**.
3. Нажмите **Draft a new release**.
4. Выберите уже существующий tag, например `v0.1.1`.
5. Укажите title, например `v0.1.1`.
6. Добавьте release notes.
7. Нажмите **Publish release**.

Событие `release: published` запустит `.github/workflows/publish.yml`.

### 11.5. Подтвердите deployment

Если у environment `npm-production` включены required reviewers, job перейдёт в состояние ожидания. Откройте workflow run и подтвердите deployment.

Publish workflow:

1. checkout конкретного release tag;
2. проверяет, что tag равен `v${package.json.version}`;
3. выполняет `npm ci`;
4. запускает полный `npm run check`;
5. тестирует настоящий tarball;
6. проверяет, что версия отсутствует в npm;
7. выполняет `npm publish --access public` через OIDC.

После успеха проверьте:

```bash
npm view @neytron/compact-ui version
```

## 12. Ручной запуск publish workflow

Ручной запуск нужен как fallback для уже существующего tag:

1. GitHub → **Actions**.
2. Выберите **Publish to npm**.
3. Нажмите **Run workflow**.
4. Введите tag строго в формате `vX.Y.Z`, например `v0.1.1`.
5. Запустите workflow.

Tag обязан существовать в Git, а его версия должна совпадать с `package.json` в этом tag.

Не вводите `main` вместо tag.

## 13. Что не нужно настраивать

При Trusted Publishing не создавайте:

```text
NPM_TOKEN
NODE_AUTH_TOKEN
```

Не добавляйте npm token в:

- GitHub repository secrets;
- `.env`;
- `.npmrc` в репозитории;
- workflow YAML;
- package scripts.

`registry-url` в `setup-node` не является секретом.

## 14. Типовые ошибки

### `npm ci` требует package-lock

Причина: lock-файл не создан или не закоммичен.

Исправление:

```bash
npm install
npm install --prefix examples/consumer
git add package-lock.json examples/consumer/package-lock.json
git commit -m "chore: add npm lock files"
```

### `403 Forbidden` при первой публикации

Проверьте:

- принадлежит ли вам npm scope;
- включена ли 2FA;
- выполнили ли вы `npm login`;
- используется ли `--access public`;
- свободно ли имя пакета.

### Trusted Publishing не авторизуется

Проверьте точное совпадение:

```text
GitHub owner
GitHub repository
publish.yml
npm-production
```

Также проверьте:

- workflow находится в `.github/workflows/publish.yml`;
- job содержит `permissions: id-token: write`;
- используется GitHub-hosted runner;
- запускается tag, совпадающий с версией;
- trusted publisher разрешает действие `npm publish`.

### Workflow не запустился после push tag

Это ожидаемо. Текущий trigger:

```yaml
on:
  release:
    types:
      - published
  workflow_dispatch:
```

Нужно опубликовать GitHub Release или вручную запустить workflow с существующим tag.

### Версия уже существует в npm

Нельзя повторно публиковать ту же версию. Создайте новую:

```bash
npm version patch
```

Нельзя исправлять ситуацию с помощью `--force`.

### Tag не совпадает с package version

Должно быть:

```text
package.json: 0.1.1
Git tag:      v0.1.1
```

Workflow намеренно остановит публикацию при расхождении.

## 15. Краткий ежедневный процесс

Разработка:

```bash
git checkout -b feat/example
npm ci
npm run dev
npm run check
npm run test:package
git add .
git commit -m "feat: describe change"
git push -u origin feat/example
```

Релиз после merge в `main`:

```bash
git checkout main
git pull --ff-only origin main
npm ci
npm run check
npm run test:package
npm run pack:dry
npm version patch -m "chore(release): v%s"
git push origin main --follow-tags
```

Затем опубликуйте GitHub Release для созданного tag и подтвердите environment deployment.

## 16. Итоговая схема

```text
локальная разработка
→ npm run check
→ npm run test:package
→ feature branch
→ pull request
→ CI
→ merge в main
→ npm version patch/minor/major
→ push commit и tag
→ GitHub Release
→ environment approval
→ GitHub Actions OIDC
→ npm publish
```
