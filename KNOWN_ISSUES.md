# 待处理问题清单（明天提醒）

> 创建日期：2026-08-06
> 用途：提醒明天需处理/跟进的问题

## 1. 导航「联系」链接断链（`#contact`）

- **位置**：所有页面的导航栏「联系」链接 `<a href="#contact">`（在 index.html 内）及子页面导航 `<a href="index.html#contact">`
- **问题**：目标页 `index.html` 中**不存在 `id="contact"`** 区块，点击后无法定位
- **处理方向**：后续新建「联系」页面/区块后补齐锚点
- **状态**：⏳ 待建联系页面（用户已确认后续处理）

## 2. 首页轮播 CTA「了解专业」（`#services`）

- **位置**：`index.html` 首页轮播内 `<a class="cta" href="#services">了解专业</a>`
- **问题**：目标 `index.html` 中**不存在 `id="services"`**
- **处理方向**：该 CTA 应定位到轮播（carousel）区域，后续放置轮播图片时补齐锚点
- **状态**：⏳ 待放轮播图片（用户已确认后续处理）

---

## 3. Git 认证（已解决 — 通过新建自己的仓库）
- **原现象**：本地提交成功（commit `4388d3a`），但 `git push origin main` 返回 **403 Permission denied**
- **原错误**：`remote: Permission to OttoDIY/OttoDIYLib.git denied to wz19921208`
- **原因**：`OttoDIY/OttoDIYLib` 仓库所有权不属于当前账号 `wz19921208`
- **解决方案（已执行）**：新建自己的仓库 **`wz19921208/QLCS_web`**，将站点文件作为仓库根目录推送成功
- **状态**：✅ 已解决（站点已托管至新仓库，不再依赖 OttoDIYLib 的推送权限）
---

## 4. 生成公网测试链接（GitHub Pages — ✅ 已完成部署）

- **方案**：GitHub **Pages** 部署，生成他人可直接访问的公开链接
- **部署仓库**：`wz19921208/QLCS_web`（main 分支，根目录 `/`）
- **公开访问链接**：**https://wz19921208.github.io/QLCS_web/**
- **验证结果**：✅ 已上线可直接访问（200 OK），首页与全部子页面、css/js 资源均可正常加载
- **备注**：后续如需更新站点，提交推送到 `QLCS_web` 的 `main` 分支即可自动重新部署（GitHub Pages 自动构建）
- **状态**：✅ 已完成

