# Убедись, что ты на main
git checkout main

# Сборка проекта
npm run build

# Удаляем старую gh-pages, если есть
git branch -D gh-pages 2>$null

# Создаем новую gh-pages ветку
git checkout --orphan gh-pages

# Удаляем все файлы (чтобы не тянуть из main)
git rm -rf .

# Копируем dist в корень
Copy-Item -Path .\dist\* -Destination . -Recurse

# Коммитим
git add .
git commit -m "deploy"

# Пушим в gh-pages
git push origin gh-pages --force

# Возвращаемся на main
git checkout main

Write-Host "✅ Deployed to GitHub Pages!"