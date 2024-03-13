# MyServe Demo

Репозиторий содержит отдельные упрощенные фрагменты кода проекта MyServe - https://mms.dminc.com/

### Технологический стэк

- Node v20
- Yarn (Classic)
- Webpack
- Vue3
- Vue Router
- GrahpQL
- Appolo Client
- SCSS
- Pug
- ESLint
- Prettier
- Cypress

### Инициализация

- yarn install

### Особенности

- автогенерация маршрутов Vue Router при запуске (yarn serve): `config/generate-vue-routes-file.mjs`
- собстенные композитные функции для работы с GraphQL: `app/javascript/helpers/use-apollo.js`
- типизация композитной функции useI18n: `app/javascript/helpers/use-i18n.d.ts`
