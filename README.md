# 食堂雷达

校园食堂点评与选餐推荐 MVP。Vue 3 + TypeScript + Vite + Vue Router，纯前端运行，不需要 API Key、数据库或登录服务。

## 本地启动

使用 Node.js 22.12+（本次开发验证为 Node.js 24）。

```bash
npm ci
npm run dev
```

打开终端显示的本地地址。生产包验证：

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

## 页面与交互

- `/`：首页搜索、预算口味选择、随机推荐、今日推荐、热门菜单及食堂入口。
- `/explore`：菜品/窗口/食堂名称即时搜索，食堂、预算上限、口味、类型筛选，评分及价格排序。条件同步至 URL，可刷新或分享。
- `/rankings`：好评榜、尝鲜榜、避雷观察，规则在页面公开展示。
- `/dishes/:id`：菜品详情、食堂关联、评价、收藏与本地评价表单。
- `/canteens/:id`：食堂信息、按窗口关联的菜品与窗口锚点。
- `/favorites`：收藏清单、取消收藏及空状态。
- 无效地址、菜品或食堂 ID 显示友好空状态。

## 模块划分

```text
src/
  components/
    common/           搜索框、空状态
    layout/           桌面导航、手机底部导航
    dish/             菜品卡片、食物视觉、筛选器、评分
    review/           评价卡片、评价表单
  views/              六个独立业务页面及 404 页
  router/             懒加载路由、滚动恢复、页面标题
  data/campus.ts      统一的食堂、窗口、菜品、模拟评价
  types/              公共 TypeScript 数据契约
  services/catalog.ts 搜索、排序、评分、榜单、随机推荐
  services/storage.ts 带校验与异常捕获的 localStorage 读写
  composables/        本机收藏、评价状态及轻提示
  styles/             设计变量、共享基础样式
```

页面负责组织展示；演示数据、计算规则、持久化分别维护。`App.vue` 仅负责全局导航、路由、页脚及反馈布局。页面与组件的特有样式使用 scoped CSS。

## 演示数据与规则

青禾大学完全虚构，包含 3 个食堂、9 个窗口、36 道菜品。所有页面使用统一 ID 关联，已有评价带 `source: demo` 标识。食物视觉使用本地 CSS、内嵌纹理与系统 emoji，不依赖外链图片、在线字体或远端 API。

- 好评榜：至少 5 条评价，加权分 `(评分总和 + 4 × 5) / (评价数 + 5)`。
- 尝鲜榜：筛选本周新品后使用同一加权分排序。
- 避雷观察：至少 8 条评价、至少 3 条 1–2 星评价且低分比例 ≥30%，按低分占比排序。单条差评不会触发。
- 随机推荐：先满足预算和口味，再从候选集中等概率抽取；候选超过一项时避免连续重复。
- 今日推荐：从好评榜选择不同窗口；人气菜单：按当前评价数量排序。均为演示推荐规则。

收藏使用 `radar:favorites`，评价使用 `radar:reviews`。新增评价标记 `source: local`，仅当前浏览器可见，不会与其他用户共享。新增评价会参与本机展示的综合评分与榜单。存储被禁用、JSON 损坏或数据格式不合法时安全回退；写入失败时保留当前会话状态并提示。清除对应站点存储可重置本机演示操作。

## 验证

`npm test` 覆盖数据 ID/关联、组合搜索筛选、价格排序、推荐边界、观察榜门槛及 localStorage 异常容错。手动验收建议：搜索番茄→预算 10 元→进入菜品→收藏→填写评价→刷新→收藏页取消→食堂窗口→三个榜单；在 390px 与桌面视口检查布局。

## 部署到现有 Vercel 项目

保留现有 GitHub 仓库、Vercel 项目和域名。根目录 `vercel.json` 指定：

- Framework：`vite`
- Build Command：`npm run build`
- Output Directory：`dist`
- SPA fallback：页面路由回退至 `/index.html`，保留 `/assets/` 和 favicon 静态资源路径。

旧的 `public/index.html` 已删除，构建入口为根目录 `index.html`。`public/` 仅保存直接复制的静态资源。

用户推送前，在已有 Vercel Dashboard 的 Build and Deployment 设置中检查 Root Directory 为仓库根目录；旧的 `Other` / `public` 覆盖设置如仍生效，应改为 Vite / `dist`，不要新建项目。安装命令使用默认的 `npm install` 或 `npm ci`。Node 版本应满足上述要求。

部署完成后直接访问并刷新 `/explore`、`/dishes/d1`、`/canteens/c1`、`/rankings`、`/favorites`，确认 SPA 回退在现有项目生效。本次没有访问或修改 Vercel Dashboard，也没有执行 Git push 或线上部署。
