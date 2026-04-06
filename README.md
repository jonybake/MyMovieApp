# MyMovieApp

一个基于 React Native + Vite Web 适配的电影应用示例项目。

当前项目已经实现：

- 全局底部 Tab 导航：`首页 / 发现 / 我的`
- 首页热门轮播、每日推荐、近期热播
- 首页顶部分类切换
- 分类电影列表
- 详情页通过 TMDB 详情接口加载标题、评分、年份、类型、演员表
- 预告片链接加载
- Web 和 Android 双端运行

## 技术栈

- React Native `0.84.1`
- React `19.2.3`
- React Navigation
- Axios
- Vite
- React Native Web

## 目录结构

```text
src/
  api.ts
  components/
    MoviePosterCard.tsx
    VideoPlayer.tsx
    VideoPlayer.web.tsx
  screens/
    HomeScreen.tsx
    SearchScreen.tsx
    DetailScreen.tsx
    ProfileScreen.tsx
    CategoryScreen.tsx
  utils/
    image.ts
```

## 启动项目

### 1. 安装依赖

```bash
npm install
```

或

```bash
yarn
```

### 2. 启动 Metro

```bash
npm start
```

或

```bash
yarn start
```

### 3. 启动 Android

先确保：

- 已连接 Android 真机或启动模拟器
- `adb devices` 能看到设备处于 `device` 状态

然后执行：

```bash
npm run android
```

或

```bash
yarn android
```

### 4. 启动 Web

```bash
yarn web
```

默认访问：

```text
http://localhost:5173/
```

## TMDB 接口说明

项目当前使用 TMDB Bearer Token 请求接口。

主要接口：

- 热门电影列表：`/movie/popular`
- 电影分类：`/genre/movie/list`
- 分类筛选：`/discover/movie`
- 电影详情：`/movie/{id}?append_to_response=credits`
- 视频列表：`/movie/{id}/videos?language=en-US`

说明：

- Web 端通过 Vite 代理请求 `/api`
- Android / iOS 端直接请求 `https://api.themoviedb.org/3`
- TMDB 不提供正片播放流，`/movie/{id}/videos` 获取的是预告片等视频信息

## 当前页面说明

### 首页

- 顶部轮播使用 `/movie/popular?page=1`
- 前 6 条作为“每日推荐”
- 第 7 到 12 条作为“近期热播电影”
- 点击顶部分类会在首页内部切换分类内容

### 详情页

进入详情页时只传 `movieId`。

详情页内部会自行请求：

- 电影详情
- 演员表
- 预告片链接

当前展示字段：

- 标题
- 评分
- 年份
- 类型

## 公共组件

### `MoviePosterCard`

位置：

- [`src/components/MoviePosterCard.tsx`](./src/components/MoviePosterCard.tsx)

用途：

- 海报图
- 热门角标
- 评分
- 标题
- 副标题

热门判断规则：

```ts
movie.popularity >= 300
```

## 已知问题

- 当前 TypeScript 检查仍有一个第三方库报错：
  - `node_modules/@tamagui/element/src/getWebElement.ts`
- 这个问题不在当前业务代码内

## 常用命令

```bash
# 启动 Metro
npm start

# 启动 Android
npm run android

# 启动 Web
yarn web

# 类型检查
npx tsc --noEmit
```
