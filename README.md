# 圖片裁切工具

這是一個基於 React Router v7 和 react-image-crop 的圖片裁切工具，可以讓使用者上傳圖片並裁切為 512x512 大小。

## 功能特色

- 📸 支援上傳 1024x1024 或更大的圖片
- ✂️ 使用 react-image-crop 進行圖片裁切
- 🎯 固定裁切為 512x512 大小
- 🔄 支援圖片縮放和旋轉
- 💾 一鍵下載裁切後的圖片
- 🎨 現代化的 UI 設計

## 技術棧

- **React Router v7** - 檔案式路由系統
- **TypeScript** - 完整的 TypeScript 支援
- **Tailwind CSS** - 實用優先的 CSS 框架
- **react-image-crop** - 圖片裁切功能
- **Vite** - 快速的建置工具和開發伺服器

## 開始使用

1. **安裝依賴:**
   ```bash
   npm install
   ```

2. **啟動開發伺服器:**
   ```bash
   npm run dev
   ```

3. **開啟瀏覽器:**
   前往 [http://localhost:5173](http://localhost:5173)

## 使用方式

1. 點擊「選擇圖片」按鈕上傳一張 1024x1024 或更大的圖片
2. 在編輯器中拖拽選擇要裁切的區域（固定為正方形）
3. 可以調整縮放和旋轉來獲得最佳效果
4. 在右側預覽區域查看裁切結果
5. 點擊「下載裁切圖片」按鈕下載 512x512 的裁切圖片

## 專案結構

```
app/
├── components/          # React 元件
│   └── ImageCropTool.tsx # 圖片裁切工具元件
├── routes/             # 檔案式路由
│   └── home.tsx        # 首頁路由
├── root.tsx            # 根佈局元件
└── app.css             # 全域樣式

public/                 # 靜態資源
├── favicon.ico
└── ...

package.json            # 依賴和腳本
vite.config.ts          # Vite 配置
react-router.config.ts  # React Router 配置
```

## 建置和部署

```bash
# 建置專案
npm run build

# 啟動生產伺服器
npm start
```

### Docker 部署

```bash
# 建置 Docker 映像
docker build -t imagetool .

# 執行容器
docker run -p 3000:3000 imagetool
```

## 學習更多

- [React Router 文檔](https://reactrouter.com)
- [react-image-crop 文檔](https://github.com/DominicTobias/react-image-crop)
- [Vite 文檔](https://vitejs.dev)
- [Tailwind CSS 文檔](https://tailwindcss.com)

---

使用 ❤️ 和 React Router 建置。